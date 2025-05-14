package com.Devchat.service;

import com.Devchat.dto.LoginDTO;
import com.Devchat.model.User;
import com.Devchat.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class Userservice {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Userservice(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Method to register a new user
    public User registerUser(String email, String username, String password, String fullname) {
        // Check if the user already exists
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use");
        }
        // Create a new user object
        User user = new User();
        user.setEmail(email);
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password)); // Hash the password
        user.setFullName(fullname);

        // Save the user to the database
        return userRepository.save(user);
    }

    // Method to authenticate a user
    public String loginUser(LoginDTO loginDTO) {
        User user = userRepository.findByUsername(loginDTO.username)
            .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(loginDTO.password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return "Login successful";
    }

    // Method to get user by ID
    public User getUserById(Long Id) {
        return userRepository.findById(Id).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    // Method to update user details
    public User updateUser(Long id, String fullName, String profilePicture, String password) {
        User user = getUserById(id);
        user.setFullName(fullName);
        user.setProfilePicture(profilePicture);
        user.setPassword(passwordEncoder.encode(password)); // Hash the new password

        return userRepository.save(user);
    }

    // Method to delete a user
    public void deleteUser(Long Id) {
        userRepository.deleteById(Id);
    }
}