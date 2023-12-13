package com.example.device_service.service;

import com.example.device_service.DTO.DeviceDto;
import com.example.device_service.DTO.DeviceMessageDto;
import com.example.device_service.config.MQConfig;
import com.example.device_service.enums.RabbitMessage;
import com.example.device_service.exception.ResourceNotFoundException;
import com.example.device_service.model.Device;
import com.example.device_service.model.User;
import com.example.device_service.repository.DeviceRepository;
import com.example.device_service.repository.UserRepository;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceService {
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;
    private final RabbitTemplate rabbitTemplate;
    private final MQConfig mqConfig;


    public Device findDeviceById(Long id){
        if(deviceRepository.findById(id).isPresent())
            return deviceRepository.findById(id).get();
        else
            return null;
    }
    public Device findDeviceByName(String name){
        return deviceRepository.findByName(name);
    }
    public List<Device> findAllDevices(){
        return deviceRepository.findAll();
    }
    public void addDevice(DeviceDto newDevice){
        System.out.println(newDevice);
        var device = Device.builder()
                .name(newDevice.getName())
                .details(newDevice.getDetails())
                .address(newDevice.getAddress())
                .hours(newDevice.getHours())
                .build();
        deviceRepository.save(device);
        rabbitTemplate.convertAndSend(mqConfig.getEXCHANGE(), mqConfig.getROUTING_KEY(), new DeviceMessageDto(RabbitMessage.CREATE, device.getId(), null, device.getHours()));
    }
    public void updateDevice(Long id, DeviceDto editedDevice){
        if(deviceRepository.findById(id).isPresent()) {
            Device device = deviceRepository.findById(id).get();
            device.setName(editedDevice.getName());
            device.setDetails(editedDevice.getDetails());
            device.setAddress(editedDevice.getAddress());
            device.setHours(editedDevice.getHours());
            deviceRepository.save(device);
            rabbitTemplate.convertAndSend(mqConfig.getEXCHANGE(), mqConfig.getROUTING_KEY(), new DeviceMessageDto(RabbitMessage.UPDATE, device.getId(), null, device.getHours()));
        }
    }
    public void deleteDevice(Long id){
        deviceRepository.deleteById(id);
        rabbitTemplate.convertAndSend(mqConfig.getEXCHANGE(), mqConfig.getROUTING_KEY(), new DeviceMessageDto(RabbitMessage.DELETE, id, null, null));
    }
    public void addUser(Long id){
        User user = new User();
        user.setId(id);
        userRepository.save(user);
        rabbitTemplate.convertAndSend(mqConfig.getEXCHANGE(), mqConfig.getROUTING_KEY(), new DeviceMessageDto(RabbitMessage.ADD_USER, null, id, null));
    }
    public void addDeviceToUser(Long userId, Long deviceId){
        User user = new User();
        Device device = new Device();
        try {
            if (deviceRepository.findById(deviceId).isEmpty())
                throw new ResourceNotFoundException("Device not found with id: " + deviceId);
            if (userRepository.findById(userId).isEmpty())
                throw new ResourceNotFoundException("User not found with id: " + userId);
            device = deviceRepository.findById(deviceId).get();
            user = userRepository.findById(userId).get();
            device.getUsers().add(user);
            user.getDevices().add(device);
            userRepository.save(user);
            deviceRepository.save(device);
            rabbitTemplate.convertAndSend(mqConfig.getEXCHANGE(), mqConfig.getROUTING_KEY(), new DeviceMessageDto(RabbitMessage.USER_DEVICE, deviceId, userId, device.getHours()));
        } catch (ResourceNotFoundException e) {
            System.out.println("Exception occurred: " + e.getMessage());
        }
    }
    @Transactional
    public void deleteUser(Long id){
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            user.getDevices().forEach(device -> device.getUsers().remove(user));
            user.getDevices().clear();
            userRepository.delete(user);
            rabbitTemplate.convertAndSend(mqConfig.getEXCHANGE(), mqConfig.getROUTING_KEY(), new DeviceMessageDto(RabbitMessage.DELETE_USER, null, id, null));
        }
    }
}
