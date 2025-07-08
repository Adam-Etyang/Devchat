package com.Devchat;

import com.Devchat.entity.Project; // Change to your entity
import com.Devchat.DTO.ProjectDTO; // Change to your DTO
import com.Devchat.mapper.ProjectMapper; // Change to your mapper
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class MapperTemplateTest {

    @Test
    void testToDTO() {
        // Arrange
        Project project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        project.setDescription("Test Description");
        project.setStatus("ACTIVE");

        ProjectMapper mapper = new ProjectMapper();

        // Act
        ProjectDTO dto = mapper.toDTO(project);

        // Assert
        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Test Project", dto.getName());
        assertEquals("Test Description", dto.getDescription());
        assertEquals("ACTIVE", dto.getStatus());
    }
}