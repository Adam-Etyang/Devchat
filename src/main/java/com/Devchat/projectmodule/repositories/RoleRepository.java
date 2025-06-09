package com.Devchat.projectmodule.repositories;

import com.Devchat.projectmodule.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Role entity.
 * Provides database operations for Role entity.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    /**
     * Finds a role by its name.
     *
     * @param name The name of the role to find
     * @return Optional containing the role if found, empty otherwise
     */
    Optional<Role> findByName(String name);
}