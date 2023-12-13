package project.monitoring_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import project.monitoring_service.enums.RabbitMessage;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeviceMessageDto {
    @JsonProperty("operation")
    private RabbitMessage operation;
    @JsonProperty("deviceId")
    private Long deviceId;
    @JsonProperty("userId")
    private Long userId;
    @JsonProperty("hours")
    private String hours;

}
