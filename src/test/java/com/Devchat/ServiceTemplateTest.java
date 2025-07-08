package com.Devchat;

import com.Devchat.Service.*; // Change to your service implementation
import com.Devchat.repository.*; // Change to your repository
import com.Devchat.entity.*; // Change to your entity
import com.Devchat.DTO.*; // Change to your dto
import com.Devchat.util.UserContext; // Add import for UserContext
import com.Devchat.mapper.ProjectMapper; // Add import for ProjectMapper

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach; // Add import for BeforeEach
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ServiceTemplateTest {

    @Mock
    private ProjectRepository projectRepository; // Change to your repository

    @Mock
    private ProjectMapper projectMapper; // Add mock for ProjectMapper

    @Mock
    private UpdateService updateService;

    @InjectMocks
    private ProjectServiceImpl projectService; // Change to your service implementation

    @BeforeEach
    void setUp() {
        // Set up user context for authentication
        User testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        UserContext.setCurrentUser(testUser);
    }

    @Test
    void testCreateProject_Success() {
        // Arrange
        Project project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        project.setStatus("ACTIVE");

        when(projectRepository.save(any(Project.class))).thenReturn(project);
        when(projectMapper.toEntity(any(ProjectDTO.class))).thenReturn(project);
        when(projectMapper.toDTO(any(Project.class))).thenReturn(new ProjectDTO());

        // Act
        ProjectDTO dto = new ProjectDTO();
        dto.setName("Test Project");
        dto.setStatus("ACTIVE");
        Long userId = 1L;

        ProjectDTO result = projectService.createProject(dto, userId);

        // Assert
        assertNotNull(result);
        verify(projectRepository, times(1)).save(any(Project.class));
    }
}