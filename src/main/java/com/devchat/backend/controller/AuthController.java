package com.devchat.backend.controller;

import com.devchart.dto.LoginDTO;
import com.devchart.dto.UserDTO;
import com.devchart.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // Register
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO) {
        String result = userService.registerUser(userDTO);
        return ResponseEntity.ok(result);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        String result = userService.loginUser(loginDTO);
        return ResponseEntity.ok(result);
    }
}