package com.Devchat.repository;

import com.Devchat.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // checking if email or username already exists when signing up
    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);
}
