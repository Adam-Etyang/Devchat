package com.devchat.backend.service;

import com.devchart.dto.LoginDTO;
import com.devchart.dto.UserDTO;
import com.devchart.model.User;
import com.devchart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Register a new user
    public String registerUser(UserDTO userDTO) {
        if (userRepository.existsByUsername(userDTO.username)) {
            return "Username already taken!";
        }

        User user = new User();
        user.setUsername(userDTO.username);
        user.setPassword(passwordEncoder.encode(userDTO.password)); // Encrypt password
        user.setEmail(userDTO.email);
        user.setFullName(userDTO.fullName);

        userRepository.save(user);
        return "User registered successfully!";
    }

    // Login user
    public String loginUser(LoginDTO loginDTO) {
        Optional<User> userOptional = userRepository.findByUsername(loginDTO.username);

        if (userOptional.isEmpty()) {
            return "User not found!";
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(loginDTO.password, user.getPassword())) {
            return "Invalid credentials!";
        }

        return "Login successful!";
    }
}