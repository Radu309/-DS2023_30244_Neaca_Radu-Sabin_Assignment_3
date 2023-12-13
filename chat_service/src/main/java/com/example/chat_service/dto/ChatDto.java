package com.example.chat_service.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Builder
public class ChatDto {
    private String userId;
    private String userRole;
    private String text;
}
