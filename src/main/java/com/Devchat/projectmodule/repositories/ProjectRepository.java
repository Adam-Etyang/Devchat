package com.Devchat.projectmodule.repositories;

import com.Devchat.projectmodule.Project;
// This import is needed because we're working with Project entities
// It's our main entity class that this repository will manage
import org.springframework.data.jpa.repository.JpaRepository;
// This is the core Spring Data JPA interface that provides:
// - Basic CRUD operations
// - Pagination support
// - Sorting capabilities
// We extend this to get all these features without writing them ourselves
import org.springframework.stereotype.Repository;
// This annotation marks our interface as a Spring Data repository
// It enables:
// - Component scanning
// - Exception translation
// - Transaction management
import java.util.List;
// Used for returning collections of Project entities
// List is used instead of Set because:
// - Order might be important
// - Duplicates are unlikely in this context
// - It's more commonly used in JPA repositories
import com.Devchat.projectmodule.Role;
//For role-based queries


// Marks this interface as a Spring Data repository
@Repository
// JpaRepository<Project, Long> provides basic CRUD operations for Project entity
// Project is the entity type, Long is the type of the primary key
public interface ProjectRepository extends JpaRepository<Project, Long> {

    // Find projects by name (case-insensitive search)
    // Spring Data JPA will automatically create a query based on the method name
    List<Project> findByNameContainingIgnoreCase(String name);

    // Find all projects created by a specific user
    // Uses the createdBy relationship to find projects
    List<Project> findByCreatedBy_Id(Long userId);

    // Find all projects where a user is a member
    // Uses the members relationship to find projects
    List<Project> findByMembers_User_Id(Long userId);

    // Check if a user is a member of a project
    // Returns true if the user is a member of the specified project
    boolean existsByIdAndMembers_User_Id(Long projectId, Long userId);

    // Find projects where a user has a specific role
    // Uses both the members relationship and role field
    List<Project> findByMembers_User_IdAndMembers_Role(Long userId, Role role);
}