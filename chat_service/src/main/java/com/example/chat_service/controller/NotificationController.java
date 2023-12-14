package com.example.chat_service.controller;

import com.example.chat_service.dto.ChatDto;
import com.example.chat_service.service.NotificationService;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @MessageMapping("/sendMessage")
    @SendTo("/user/message")
    public ResponseEntity<?> sendMessages(@Payload ChatDto message) {
        notificationService.sendMessages(message);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @MessageMapping("/isTyping")
    @SendTo("/user/message")
    public ResponseEntity<?> sendTyping(@Payload ChatDto message) {
        notificationService.sendTyping(message);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @MessageMapping("/seen")
    @SendTo("/user/message")
    public ResponseEntity<?> sendSeen(@Payload ChatDto message) {
        notificationService.sendSeen(message);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
