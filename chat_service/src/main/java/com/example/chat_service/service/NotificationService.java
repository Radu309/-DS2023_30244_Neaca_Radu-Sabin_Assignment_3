package com.example.chat_service.service;

import com.example.chat_service.dto.ChatDto;
import com.google.gson.JsonObject;
import lombok.AllArgsConstructor;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@AllArgsConstructor
public class NotificationService {
    private final SimpMessagingTemplate messagingTemplate;

    public void sendMessages(ChatDto message) throws MessageDeliveryException {
        String role = "";
        if(Objects.equals(message.getUserRole(), "ADMIN"))
            role = "client";
        else
            role = "admin";
        String destination = "/user/" + role + "/" + message.getUserId() + "/message";

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("userId", message.getUserId());
        jsonObject.addProperty("userRole", message.getUserRole());
        jsonObject.addProperty("text", message.getText());
        String content = jsonObject.toString();

        messagingTemplate.convertAndSend(destination, content);
    }

    public void sendTyping(ChatDto message) {
        String role = "";
        if(Objects.equals(message.getUserRole(), "ADMIN"))
            role = "client";
        else
            role = "admin";

        String destination = "/user/" + role + "/isTyping/" + message.getUserId() + "/message";
        String content = message.getUserId();

        messagingTemplate.convertAndSend(destination, content);
    }

    public void sendSeen(ChatDto message){
        String role = "";
        if(Objects.equals(message.getUserRole(), "ADMIN"))
            role = "client";
        else
            role = "admin";

        String destination = "/user/" + role + "/seen/" + message.getUserId() + "/message";
        String content = message.getUserId();

        System.out.println(content);
        System.out.println(destination);
        messagingTemplate.convertAndSend(destination, content);
    }
}
