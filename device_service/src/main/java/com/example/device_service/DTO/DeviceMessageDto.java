package com.example.device_service.DTO;

import com.example.device_service.enums.RabbitMessage;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DeviceMessageDto {
    private RabbitMessage operation;
    private Long deviceId;
    private Long userId;
    private String hours;
}
