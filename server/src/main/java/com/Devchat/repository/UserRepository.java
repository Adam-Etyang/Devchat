//part of the data access layer
// This is the repository interface for the User entity

package com.Devchat.repository;

import com.Devchat.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {}
