package com.example.chat_service.controller;

import com.example.chat_service.dto.ChatDto;
import com.google.gson.JsonObject;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@Controller
@RestController
@RequiredArgsConstructor
public class NotificationController {
    @Autowired
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendMessage")
    @SendTo("/user/message")
    public ResponseEntity<?> sendNotification(@Payload ChatDto message) {
        String destination;
        if(Objects.equals(message.getUserRole(), "admin"))
            destination = "/user/message/client" + "/" + message.getUserId();
        else
            destination = "/user/message/admin" + "/" + message.getUserId();

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("userId", message.getUserId());
        jsonObject.addProperty("userRole", message.getUserRole());
        jsonObject.addProperty("text", message.getText());
        String content  = jsonObject.toString();

        System.out.println(content);
        System.out.println(destination);
        messagingTemplate.convertAndSend(destination, content);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
