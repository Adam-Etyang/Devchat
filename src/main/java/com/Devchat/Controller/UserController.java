package com.Devchat.Controller;

import com.Devchat.DTO.userDTO;
import com.Devchat.Service.UserService;
import com.Devchat.entity.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public String registerUser(@RequestBody userDTO userDto) {
        User created = userService.registerUser(userDto);
        return created.getUsername() + "registered successfully";
    }

    // Additional endpoints can be added here for login, profile updates, etc.
}