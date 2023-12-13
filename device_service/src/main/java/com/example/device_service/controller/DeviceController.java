package com.example.device_service.controller;

import com.example.device_service.DTO.DeviceDto;
import com.example.device_service.model.Device;
import com.example.device_service.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/device")
public class DeviceController {
    private final DeviceService deviceService;

    @GetMapping("/find/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable("id") Long id){
        Device device = deviceService.findDeviceById(id);
        return new ResponseEntity<>(device, HttpStatus.OK);
    }
    @PostMapping("/find/name")
    public ResponseEntity<Device> getDeviceByEmail(@RequestBody DeviceDto deviceDto){
        Device device = deviceService.findDeviceByName(deviceDto.getName());
        return new ResponseEntity<>(device, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Device>> getAllDevices(){
        List<Device> devices = deviceService.findAllDevices();
        return new ResponseEntity<>(devices, HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<?> addDevice(@RequestBody DeviceDto deviceDto){
        deviceService.addDevice(deviceDto);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDevice(@RequestBody DeviceDto deviceDto,
                                        @PathVariable Long id){
        deviceService.updateDevice(id, deviceDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDevice(@PathVariable("id") Long id){
        deviceService.deleteDevice(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/add-user/{id}")
    public ResponseEntity<?> addUser(@PathVariable ("id") Long id){
        deviceService.addUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/{deviceId}/{userId}")
    public ResponseEntity<?> saveDeviceToUser(@PathVariable("userId") Long userid,
                                              @PathVariable("deviceId") Long deviceId){
        deviceService.addDeviceToUser(userid, deviceId);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @DeleteMapping("/delete/user/{id}")
    public ResponseEntity<?> deleteUser (@PathVariable Long id){
        deviceService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
