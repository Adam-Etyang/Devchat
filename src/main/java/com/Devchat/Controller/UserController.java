package com.Devchat.Controller;

import com.Devchat.DTO.*;
import com.Devchat.Service.UserService;
import com.Devchat.entity.User;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/auth/signup")
    public ResponseEntity<?> registerUser(@RequestBody RegisterDTO registerdto) {
        try {
            System.out.println(registerdto);
            User createdUser = userService.registerUser(registerdto);

            // Create response with user data
            AuthresponseDTO response = new AuthresponseDTO();
            response.setUserProfile(new UserprofileDTO());
            response.getUserProfile().setId(createdUser.getId());
            response.getUserProfile().setUsername(createdUser.getUsername());
            response.getUserProfile().setEmail(createdUser.getEmail());
            response.getUserProfile().setFullName(createdUser.getFullName());
            response.getUserProfile().setPhone(createdUser.getPhone());
            response.getUserProfile().setBio(createdUser.getBio());
            response.getUserProfile().setLocation(createdUser.getLocation());
            response.getUserProfile().setCreatedAt(createdUser.getCreatedAt());

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred: " + ex.getMessage()));
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginDTO logindto) {
        try {
            User loggedInUser = userService.loginUser(logindto);

            // Create response with user data
            AuthresponseDTO response = new AuthresponseDTO();
            response.setUserProfile(new UserprofileDTO());
            response.getUserProfile().setId(loggedInUser.getId());
            response.getUserProfile().setUsername(loggedInUser.getUsername());
            response.getUserProfile().setEmail(loggedInUser.getEmail());
            response.getUserProfile().setFullName(loggedInUser.getFullName());
            response.getUserProfile().setPhone(loggedInUser.getPhone());
            response.getUserProfile().setBio(loggedInUser.getBio());
            response.getUserProfile().setLocation(loggedInUser.getLocation());
            response.getUserProfile().setCreatedAt(loggedInUser.getCreatedAt());

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred: " + ex.getMessage()));
        }
    }

    @GetMapping("/auth/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get user profile by ID
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserprofileDTO> getUserProfile(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            UserprofileDTO profileDTO = new UserprofileDTO();
            profileDTO.setId(user.getId());
            profileDTO.setUsername(user.getUsername());
            profileDTO.setEmail(user.getEmail());
            profileDTO.setFullName(user.getFullName());
            profileDTO.setPhone(user.getPhone());
            profileDTO.setBio(user.getBio());
            profileDTO.setLocation(user.getLocation());
            profileDTO.setCreatedAt(user.getCreatedAt());
            return ResponseEntity.ok(profileDTO);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Update user profile
    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long userId, @RequestBody UserprofileDTO profileDTO) {
        try {
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }

    // Update user password
    @PutMapping("/users/{userId}/password")
    public ResponseEntity<?> updatePassword(@PathVariable Long userId, @RequestBody Map<String, String> passwordData) {
        try {
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");

            userService.updatePassword(userId, currentPassword, newPassword);
            return ResponseEntity.ok("Password updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating password: " + e.getMessage());
        }
    }

    // Update user preferences
    @PutMapping("/users/{userId}/preferences")
    public ResponseEntity<?> updatePreferences(@PathVariable Long userId,
            @RequestBody Map<String, Object> preferences) {
        try {
            userService.updatePreferences(userId, preferences);
            return ResponseEntity.ok("Preferences updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating preferences: " + e.getMessage());
        }
    }

    // Update notification preferences
    @PutMapping("/users/{userId}/notifications")
    public ResponseEntity<?> updateNotificationPreferences(@PathVariable Long userId,
            @RequestBody Map<String, Object> notificationPrefs) {
        try {
            userService.updateNotificationPreferences(userId, notificationPrefs);
            return ResponseEntity.ok("Notification preferences updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating notification preferences: " + e.getMessage());
        }
    }

    // Delete user account
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok("User account deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting account: " + e.getMessage());
        }
    }
}