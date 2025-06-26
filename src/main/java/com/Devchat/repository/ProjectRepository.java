package com.Devchat.repository;
import com.Devchat.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.Devchat.entity.Role;
import java.util.Optional;

@Repository
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