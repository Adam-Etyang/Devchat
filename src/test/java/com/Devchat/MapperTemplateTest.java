package com.Devchat;

import com.Devchat.entity.Project; // Change to your entity
import com.Devchat.DTO.ProjectDTO; // Change to your DTO
import com.Devchat.mapper.ProjectMapper; // Change to your mapper
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class MapperTemplateTest {

    @Test
    void testToDTO() {
        Project project = new Project();
        project.setName("Test");
        // If your mapper uses instance methods, instantiate it:
        ProjectMapper mapper = new ProjectMapper(); // Or use dependency injection if needed
        ProjectDTO dto = mapper.toDTO(project); // Change to your mapping method
        assertEquals("Test", dto.getName());
    }
}