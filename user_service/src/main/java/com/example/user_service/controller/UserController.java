package com.example.user_service.controller;

import com.example.user_service.DTO.UserDto;
import com.example.user_service.model.User;
import com.example.user_service.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;
    @GetMapping("/find/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id){
        User user = userService.findUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
    @PostMapping("/find/email")
    public ResponseEntity<User> getUserByEmail(@RequestBody UserDto userDto){
        User user = userService.findUserByEmail(userDto.getEmail());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users = userService.findAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<User> addUser(@RequestBody UserDto userDto, @NonNull HttpServletRequest request){
        String jwt = (request.getHeader("Authorization")).substring(7);
        User user = userService.addUser(userDto, jwt);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@RequestBody UserDto userDto,
                                           @PathVariable Long id){
        userService.updateUser(id, userDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @GetMapping("/with-device/{userId}/{deviceId}")
    public ResponseEntity<?> userWithDevice(@PathVariable ("userId") Long userId,
                                            @PathVariable ("deviceId") Long deviceId,
                                            @NonNull HttpServletRequest request){
        String jwt = (request.getHeader("Authorization")).substring(7);
        userService.userWithDevices(userId, deviceId, jwt);
        return new ResponseEntity<>(HttpStatus.OK);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") Long id,  @NonNull HttpServletRequest request){
        String jwt = (request.getHeader("Authorization")).substring(7);
        userService.deleteUser(id, jwt);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
