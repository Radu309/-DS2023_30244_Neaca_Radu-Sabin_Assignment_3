package project.monitoring_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import project.monitoring_service.enums.RabbitMessage;
import lombok.AllArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import project.monitoring_service.dto.DeviceMessageDto;
import project.monitoring_service.model.Device;
import project.monitoring_service.model.Measurement;
import project.monitoring_service.model.User;
import project.monitoring_service.repository.DeviceRepository;
import project.monitoring_service.repository.MeasurementRepository;
import project.monitoring_service.repository.UserRepository;

import java.io.IOException;

import java.util.Set;

//Consumer
@Service
@AllArgsConstructor
public class MonitoringService {
    private final String QUEUE = "ds_2023_queue";
    private final String DEVICE_QUEUE = "ds_2023_device_queue";
    private final MeasurementRepository measurementRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    @Autowired
    private final SimpMessagingTemplate messagingTemplate;

    @RabbitListener(queues = DEVICE_QUEUE)
    public void receiveDeviceMessage(String message) {
        try {
            System.out.println(" [x] Received: " + message);
            processMessages(message);
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
            e.printStackTrace();
        }
    }
    void processMessages(String message) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(message);
        DeviceMessageDto deviceMessageDto = objectMapper.readValue(jsonNode.toString(), DeviceMessageDto.class);
        switch (deviceMessageDto.getOperation()) {
            case CREATE -> createNewDevice(deviceMessageDto.getDeviceId(), deviceMessageDto.getHours());
            case DELETE -> deleteDevice(deviceMessageDto.getDeviceId());
            case USER_DEVICE -> setUserForDevice(deviceMessageDto.getDeviceId(), deviceMessageDto.getUserId());
            case DELETE_USER -> deleteUserWithDevices(deviceMessageDto.getUserId());
            case ADD_USER -> addNewUser(deviceMessageDto.getUserId());
            case UPDATE -> editDevice();
            default -> {}
        }
    }
    public void createNewDevice(Long deviceId, String hours){
        System.out.println("Operation: " + RabbitMessage.CREATE);
        Device device = new Device();
        device.setId(deviceId);
        device.setHours(hours);
        deviceRepository.save(device);
    }
    public void deleteDevice(Long deviceId){
        System.out.println("Operation: " + RabbitMessage.DELETE);
        if(deviceRepository.findById(deviceId).isPresent()) {
            Device device = deviceRepository.findById(deviceId).get();
            deviceRepository.delete(device);
        }
    }
    public void setUserForDevice(Long deviceId, Long userId){
        System.out.println("Operation: " + RabbitMessage.USER_DEVICE);

        Device device = deviceRepository.findById(deviceId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);

        if (device != null && user != null) {
            device.getUsers().add(user);
            user.getDevices().add(device);

            deviceRepository.save(device);
            userRepository.save(user);
        }
    }
    public void deleteUserWithDevices(Long userID){
        System.out.println("Operation: " + RabbitMessage.DELETE_USER);
        User user = userRepository.findById(userID).orElse(null);
        System.out.println(user);
        if(user != null){
            user.getDevices().forEach(device -> device.getUsers().remove(user));
            System.out.println(user);
            user.getDevices().clear();
            userRepository.delete(user);
        }
    }
    public void addNewUser(Long userId){
        System.out.println("Operation: " + RabbitMessage.ADD_USER);
        User user = new User();
        user.setId(userId);
        userRepository.save(user);
    }
    public void editDevice(){
        System.out.println("Operation: " + RabbitMessage.UPDATE);
    }


    @RabbitListener(queues = QUEUE)
    public void receiveCsvMessage(String message) {
        try {
            System.out.println(" [x] Received: " + message);
            processAndStoreEnergyConsumption(message);
            // notifyUserIfExceedsMaxValue();
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void processAndStoreEnergyConsumption(String message) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            System.out.println(message);
            JsonNode jsonNode = objectMapper.readTree(message);
            System.out.println(jsonNode);

            String timestamp = jsonNode.get("timestamp").asText();
            Long deviceId = jsonNode.get("device_id").asLong();
            double measurementValue = jsonNode.get("measurement_value").asDouble();

            Device device = new Device();
            if(deviceRepository.findById(deviceId).isEmpty()){
                device.setId(deviceId);
                device.setUsers(null);

                deviceRepository.save(device);
            }else
                device = deviceRepository.findById(deviceId).get();

            Measurement measurement = new Measurement();
            measurement.setTimeStamp(timestamp);
            measurement.setMeasurementValue(measurementValue);
            measurement.setDevice(device);

            measurementRepository.save(measurement);
            Set<User> users = device.getUsers();
            if(measurement.getMeasurementValue() > Long.parseLong(device.getHours())) {
                sendWebSocketMessage(users, "WARNING!!! MEASUREMENT VALUE = " + measurementValue);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void sendWebSocketMessage(Set<User> users, String content) {
        for(User user: users) {
            String destination = "/topic/notification/" + user.getId();
            messagingTemplate.convertAndSend(destination, content);
        }
    }
}
