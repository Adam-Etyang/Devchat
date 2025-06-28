package com.Devchat.Service;

import com.Devchat.DTO.LoginDTO;
import com.Devchat.DTO.RegisterDTO;
import com.Devchat.DTO.UserprofileDTO;
import com.Devchat.entity.User;
import com.Devchat.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
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
        // system info for login
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

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
    }

    // Update user profile
    public User updateUserProfile(Long userId, UserprofileDTO profileDTO) {
        User user = getUserById(userId);

        if (profileDTO.getUsername() != null) {
            user.setUsername(profileDTO.getUsername());
        }
        if (profileDTO.getEmail() != null) {
            user.setEmail(profileDTO.getEmail());
        }
        if (profileDTO.getFullName() != null) {
            user.setFullName(profileDTO.getFullName());
        }
        if (profileDTO.getPhone() != null) {
            user.setPhone(profileDTO.getPhone());
        }
        if (profileDTO.getBio() != null) {
            user.setBio(profileDTO.getBio());
        }
        if (profileDTO.getLocation() != null) {
            user.setLocation(profileDTO.getLocation());
        }

        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    // Update user password
    public void updatePassword(Long userId, String currentPassword, String newPassword) {
        User user = getUserById(userId);

        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    // Update user preferences (placeholder implementation)
    public void updatePreferences(Long userId, Map<String, Object> preferences) {
        User user = getUserById(userId);
        // For now, just update the timestamp
        // In a real implementation, you might store preferences in a separate table
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    // Update notification preferences (placeholder implementation)
    public void updateNotificationPreferences(Long userId, Map<String, Object> notificationPrefs) {
        User user = getUserById(userId);
        // For now, just update the timestamp
        // In a real implementation, you might store notification preferences in a
        // separate table
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    // Delete user account
    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
    }
}
