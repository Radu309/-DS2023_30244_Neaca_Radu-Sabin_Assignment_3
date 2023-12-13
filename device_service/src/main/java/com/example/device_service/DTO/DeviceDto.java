package com.example.device_service.DTO;

import com.example.device_service.model.Device;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeviceDto {
    @JsonProperty("name")
    private String name;
    @JsonProperty("details")
    private String details;
    @JsonProperty("address")
    private String address;
    @JsonProperty("hours")
    private String hours;

    public static DeviceDto fromDevice(Device device) {
        return new DeviceDto(device.getName(), device.getDetails(), device.getAddress(), device.getHours());
    }

}
