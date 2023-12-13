package com.example.user_service.DTO;

import com.example.user_service.model.User;
import com.example.user_service.model.UserRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    @JsonProperty("name")
    private String name;
    @JsonProperty("email")
    private String email;
    @JsonProperty("password")
    private String password;
    @JsonProperty("userRole")
    private UserRole userRole;

    public static UserDto fromUser(User user) {
        return new UserDto(user.getName(), user.getEmail(), user.getPassword(), user.getUserRole());
    }
}
