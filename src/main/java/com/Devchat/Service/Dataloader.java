/*package com.Devchat.Service;

import com.Devchat.entity.User;
import com.Devchat.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class Dataloader implements CommandLineRunner {

    private final UserRepository userRepository;

    public Dataloader(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        User user = new User();
        user.setUsername("demo_user");
        user.setEmail("demo@example.com");
        user.setFullName("Demo User");
        user.setPassword("password123");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setProfilePicture("https://example.com/profile.jpg");
        userRepository.save(user);

        System.out.println("✅ User inserted!");
    }
}
*/