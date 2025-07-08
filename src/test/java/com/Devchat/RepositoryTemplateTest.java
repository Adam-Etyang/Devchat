package com.Devchat;

import com.Devchat.entity.Project; // Change to your entity
import com.Devchat.entity.User; // Added import for User entity
import com.Devchat.repository.ProjectRepository; // Change to your repository
import com.Devchat.repository.UserRepository; // Add import for UserRepository
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class RepositoryTemplateTest {

    @Autowired
    private ProjectRepository projectRepository; // Change to your repository

    @Autowired
    private UserRepository userRepository; // Add UserRepository

    @Test
    void testRepositoryQuery() {
        // Create a test user first
        User testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        userRepository.save(testUser); // Save user first

        Project project = new Project();
        project.setName("Alpha");
        project.setStatus("ACTIVE");
        project.setCreatedBy(testUser); // Use User object, not ID
        project.setOwner(testUser); // Use User object, not ID
        projectRepository.save(project);

        // Replace with your actual repository method, e.g., findByName, findById, etc.
        Iterable<Project> projects = projectRepository.findAll();
        assertTrue(projects.iterator().hasNext());
    }
}