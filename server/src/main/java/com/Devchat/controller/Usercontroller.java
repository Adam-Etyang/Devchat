//Handles HTTP requests from clients(the frontend) and interacts with the service layer to perform operations related to users.
// and exposes RESTful endpoints for user-related actions
//acts as the entry point for user related operations in the application

package com.Devchat.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Devchat.model.User;
import com.Devchat.service.Userservice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/api/users") // Base URL for user-related endpoints

public class Usercontroller {
    private final Userservice userService;

    public UserController(Userservice userService){
        this.userService = userService;
    }
    // Define endpoints for user-related operations here
    @PostMapping("/register")
    public ResponseEntity<User>register(@RequestBody UserRegistrationDTO registrationDTO) {
        
        User user = userService.registerUser(
            registrationDTO.email(),
            registrationDTO.username(),
            registrationDTO.password(),
            registrationDTO.fullName()
    ); 
        return ResponseEntity.ok(user);
    }
    @GetMapping("/{id}")
    public ResponseEntity <User> getUser(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    @PutMapping("{id}")
    public ResponseEntity<User> updateuser(@PathVariable Long id, @RequestBody UserUpdateDTO updateDTO) {
 
       User user = userService.updateUser(id, updateDTO.fullName(), updateDTO.profilePicture()); 
        return ResponseEntity.ok(user);
    }
    // Delete user endpoint
    
    
}

record UserRegistrationDTO(String email, String username, String password, String fullName) {}
record UserUpdateDTO(String fullName, String profilePicture) {}