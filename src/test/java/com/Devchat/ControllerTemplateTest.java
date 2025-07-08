package com.Devchat;

import com.Devchat.Controller.ProjectController; // Change to your controller
import com.Devchat.Service.ProjectService; // Change to your service
import com.Devchat.Service.UserService; // Add this to fix UserContextInterceptor dependency
import com.Devchat.DTO.ProjectDTO; // Add DTO import
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.Devchat.entity.User;
import com.Devchat.util.UserContext;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.any;

@WebMvcTest(ProjectController.class) // Change to your controller
public class ControllerTemplateTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService; // Change to your service

    @MockBean
    private UserService userService; // Add this to fix UserContextInterceptor dependency

    @BeforeEach
    void setUp() {
        User testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        UserContext.setCurrentUser(testUser);
    }

    private RequestPostProcessor userContext() {
        return request -> {
            User testUser = new User();
            testUser.setId(1L);
            testUser.setUsername("testuser");
            UserContext.setCurrentUser(testUser);
            return request;
        };
    }

    @Test
    @WithMockUser
    void testCreateProject_ReturnsOk() throws Exception {
        // Arrange
        ProjectDTO mockResponse = new ProjectDTO();
        mockResponse.setId(1L);
        mockResponse.setName("Test Project");
        mockResponse.setStatus("ACTIVE");

        // Mock the service response
        when(projectService.createProject(any(ProjectDTO.class), any(Long.class))).thenReturn(mockResponse);

        // Mock UserService to return a user when getUserById is called
        User testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        when(userService.getUserById(1L)).thenReturn(testUser);

        // Act & Assert
        mockMvc.perform(post("/api/projects/create")
                .contentType(MediaType.APPLICATION_JSON)
                .header("X-User-ID", "1") // Add this header to trigger UserContextInterceptor
                .content("{\"name\":\"Test Project\",\"status\":\"ACTIVE\",\"managerId\":\"1\"}")
                .with(csrf()))
                .andExpect(status().isCreated());
    }
}