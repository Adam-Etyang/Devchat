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
        user.setProfilePicture(registerDto.getProfilePicture());
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public User loginUser(LoginDTO loginDto) {
        String login = loginDto.getEmailOrusername().trim();

        Optional<User> userOpt = userRepository.findByemail(login);

        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByusername(login);
        }

        User user = userOpt.orElseThrow(() -> new IllegalArgumentException("Invalid email/username or password"));

        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            System.out.println("Login failed for user: " + loginDto.getEmailOrusername());
            throw new IllegalArgumentException("Invalid email/username or password");
        }

        System.out.println("User logged in successfully: " + user.getUsername());
        return user;
    }

}
