package com.devchat.controller;

import com.devchat.dto.UserProfileDTO;
import com.devchat.model.User;
import com.devchat.repository.UserRepository;
import com.devchat.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public UserProfileDTO getProfile(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();
        UserProfileDTO dto = new UserProfileDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        return dto;
    }

    @PutMapping
    public UserProfileDTO updateProfile(@RequestBody UserProfileDTO profileDTO,
                                        Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow();

        user.setUsername(profileDTO.getUsername());
        user.setEmail(profileDTO.getEmail());

        userRepository.save(user);

        return profileDTO;
    }
}
