package com.Devchat;

import com.Devchat.Controller.ProjectController; // Change to your controller
import com.Devchat.Service.ProjectService; // Change to your service
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProjectController.class) // Change to your controller
public class ControllerTemplateTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService; // Change to your service

    @Test
    void testCreateProject_ReturnsOk() throws Exception {
        // Mockito.when(projectService.createProject(Mockito.any())).thenReturn(...);
        mockMvc.perform(post("/api/projects/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test Project\"}"))
                .andExpect(status().isOk());
    }
}