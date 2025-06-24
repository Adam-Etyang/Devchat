package com.Devchat.Service;

import com.Devchat.DTO.LoginDTO;
import com.Devchat.DTO.RegisterDTO;
import com.Devchat.entity.User;
import com.Devchat.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User registerUser(RegisterDTO registerDto) {

        if (userRepository.findByemail(registerDto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setFullName(registerDto.getFullName());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public User loginUser(LoginDTO loginDto) {
        String login = loginDto.getEmailOrUsername().trim();

        System.out.println("Attempting to log in user: " + login);

        Optional<User> userOpt = userRepository.findByemail(login);
        System.out.println("User found by email: " + userOpt.isPresent());
        
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByusername(login);
            System.out.println("User found by username: " + userOpt.isPresent());
        }
                if (userOpt.isEmpty()) {
            System.out.println("No user found with email/username: " + login);
            throw new IllegalArgumentException("Invalid email/username or password");
        }
                User user = userOpt.get();
        System.out.println("Found user: " + user.getUsername() + " with email: " + user.getEmail());
        
        // Debug password comparison
        String rawPassword = loginDto.getPassword();
        String hashedPassword = user.getPassword();
        boolean passwordMatches = passwordEncoder.matches(rawPassword, hashedPassword);
        //system info for login
        System.out.println("Raw password: " + rawPassword);
        System.out.println("Stored hash: " + hashedPassword);
        System.out.println("Password matches: " + passwordMatches);

        if (!passwordMatches) {
            System.out.println("Login failed for user: " + loginDto.getEmailOrUsername());
            throw new IllegalArgumentException("Invalid email/username or password");
        }

        System.out.println("User logged in successfully: " + user.getUsername());
        return user;
    }

}
