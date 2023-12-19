package com.example.user_service.service;

import com.example.user_service.DTO.UserDto;
import com.example.user_service.model.User;
import com.example.user_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@Service
public class UserService {
    @Value("${device_service_url}")
    private String deviceServerUrl;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    @Autowired
    public UserService(PasswordEncoder passwordEncoder, UserRepository userRepository, RestTemplate restTemplate) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
    }

    public User findUserById(Long id){
        if(userRepository.findById(id).isPresent())
            return userRepository.findById(id).get();
        else
            return null;
    }
    public User findUserByEmail(String email){
        if(userRepository.findByEmail(email).isPresent())
            return userRepository.findByEmail(email).get();
        else
            return null;
    }
    public List<User> findAllUsers(){
        return userRepository.findAll();
    }
    @Transactional
    public User addUser(UserDto newUser, String jwt) throws RestClientException{
        if(userRepository.findByEmail(newUser.getEmail()).isEmpty()) {
            var user = User.builder()
                .name(newUser.getName())
                .email(newUser.getEmail())
                .userRole(newUser.getUserRole())
                .password(passwordEncoder.encode(newUser.getPassword()))
                .build();
            userRepository.save(user);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + jwt);

            Long userId = userRepository.findByEmail(newUser.getEmail()).get().getId();
            String endpoint = deviceServerUrl + "/device/add-user/" + userId;
            System.out.println(endpoint);
            HttpEntity<String> requestEntity = new HttpEntity<>(headers);
            restTemplate.exchange(endpoint, HttpMethod.GET, requestEntity, String.class);
        }
        return null;
    }
    public void updateUser(Long id, UserDto editedUser){
        if(userRepository.findById(id).isPresent()) {
            User user = userRepository.findById(id).get();
            user.setName(editedUser.getName());
            user.setEmail(editedUser.getEmail());
            user.setPassword(passwordEncoder.encode(editedUser.getPassword()));
            user.setUserRole(editedUser.getUserRole());
            userRepository.save(user);
        }
    }
    @Transactional
    public void userWithDevices(Long userId, Long deviceId, String jwt){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + jwt);
        String endpoint = deviceServerUrl + "/device/" + deviceId  + "/" + userId;
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        restTemplate.exchange(endpoint, HttpMethod.GET, requestEntity, String.class);
    }
    @Transactional
    public void deleteUser(Long id, String jwt) {
        userRepository.deleteById(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + jwt);
        String endpoint = deviceServerUrl + "/device/delete/user/" + id;
        HttpEntity<String> requestEntity = new HttpEntity<>(headers);
        restTemplate.exchange(endpoint, HttpMethod.DELETE, requestEntity, String.class);
    }
}