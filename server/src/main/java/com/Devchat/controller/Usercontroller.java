//Handles HTTP requests from clients(the frontend) and interacts with the service layer to perform operations related to users.
// and exposes RESTful endpoints for user-related actions
//acts as the entry point for user related operations in the application

package com.Devchat.controller;

import com.Devchat.model.User;
import com.Devchat.service.Userservice;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users") // Base URL for user-related endpoints

public class Usercontroller {
  private final Userservice userService;

  public Usercontroller(Userservice userService) {
    this.userService = userService;
  }

  // Define endpoints for user-related operations here
  @PostMapping("/register") // Endpoint for user registration
  // Accepts a JSON payload containing user details
  // and returns the created user object
  // The @RequestBody annotation binds the incoming JSON to the
  // UserRegistrationDTO object
  public ResponseEntity<User> register(@RequestBody UserRegistrationDTO registrationDTO) {

    User user = userService.registerUser(
        registrationDTO.email(),
        registrationDTO.username(),
        registrationDTO.password(),
        registrationDTO.fullName());
    return ResponseEntity.ok(user);
  }

  // Get user by ID endpoint
  // Accepts a user ID as a path variable and returns the user object
  // The @PathVariable annotation binds the path variable to the method parameter
  // The @GetMapping annotation specifies that this method handles GET requests
  // The ResponseEntity class represents the entire HTTP response, including
  // status code and body
  @GetMapping("/{id}")
  public ResponseEntity<User> getUser(@PathVariable Long id) {
    User user = userService.getUserById(id);
    return ResponseEntity.ok(user);
  }

  // Update user endpoint
  // Accepts a user ID as a path variable and a JSON payload containing updated
  // user details
  // The @PutMapping annotation specifies that this method handles PUT requests
  // The @RequestBody annotation binds the incoming JSON to the UserUpdateDTO
  // object
  @PutMapping("/{id}")
  public ResponseEntity<User> updateuser(@PathVariable Long id, @RequestBody UserUpdateDTO updateDTO) {

    User user = userService.updateUser(id, updateDTO.fullName(), updateDTO.profilePicture(), updateDTO.password());
    return ResponseEntity.ok(user);
  }

  // Delete user endpoint
  // Accepts a user ID as a path variable and deletes the user
  // The @DeleteMapping annotation specifies that this method handles DELETE
  // requests
  // The ResponseEntity class represents the entire HTTP response, including
  // status code and body
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    userService.deleteUser(id);
    return ResponseEntity.noContent().build();
  }

}

// Data Transfer Objects (DTOs) for user registration and update
// These classes are used to transfer data between the client and server
// They are simple Java classes with no business logic
record UserRegistrationDTO(String email, String username, String password, String fullName) {
}

record UserUpdateDTO(String fullName, String profilePicture, String password) {
}
