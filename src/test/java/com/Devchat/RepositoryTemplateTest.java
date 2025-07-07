package com.Devchat;

import com.Devchat.entity.Project; // Change to your entity
import com.Devchat.repository.ProjectRepository; // Change to your repository
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
public class RepositoryTemplateTest {

    @Autowired
    private ProjectRepository projectRepository; // Change to your repository

    @Test
    void testRepositoryQuery() {
        Project project = new Project();
        project.setName("Alpha");
        projectRepository.save(project);

        // Replace with your actual repository method, e.g., findByName, findById, etc.
        Iterable<Project> projects = projectRepository.findAll();
        assertTrue(projects.iterator().hasNext());
    }
}