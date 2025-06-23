package com.Devchat.Controller;

//Our data transfer object for projects
import com.Devchat.DTO.*;
//The service interface we'll use for business logic
import com.Devchat.Service.*;
//For validating incoming data
import jakarta.validation.Valid;

//Spring annotations for REST controller functionality
import org.springframework.http.HttpStatus;
//For building HTTP responses
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// For handling collections of projects
import java.util.List;

/**
 * REST Controller for handling Project-related HTTP requests.
 * Provides endpoints for CRUD operations on projects.
 */
@RestController//Tells Spring this is a REST controller
@RequestMapping("/api/projects")//Sets the base URL for all endpoints in this controller
public class ProjectController {

    //Declares our service dependency
    private final ProjectService projectService;//

    //Uses constructor injection (best practice)
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * Creates a new project.
     *
     * @param projectDTO The project data to create
     * @return ResponseEntity containing the created project
     */
    @PostMapping// Handles HTTP POST requests
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectDTO projectDTO) {
        // Get the current user's ID from security context or pass it as a parameter
        // For now, we'll use a default value or get it from the security context
        Long creatorId = getCurrentUserId(); // You need to implement this method

        ProjectDTO createdProject = projectService.createProject(projectDTO, creatorId);
        return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
    }

    // Helper method to get current user ID
    private Long getCurrentUserId() {
        // Implement this based on your security setup
        // For example, if using Spring Security:
        // return SecurityContextHolder.getContext().getAuthentication().getPrincipal().getId();
        // For now, you might want to return a default value or throw an exception
        throw new UnsupportedOperationException("User ID must be provided");
    }

    /**
     * Retrieves a project by its ID.
     *
     * @param id The ID of the project to retrieve
     * @return ResponseEntity containing the project if found
     */
    @GetMapping("/{id}")// Handles GET requests with ID parameter
    //@PathVariable: Gets ID from URL
    //Returns 200 (OK) with the project
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        ProjectDTO project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    /**
     * Retrieves all projects.
     *
     * @return ResponseEntity containing a list of all projects
     */
    @GetMapping//Handles GET requests without parameters
    //Returns list of all projects
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        List<ProjectDTO> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }

    /**
     * Updates an existing project.
     *
     * @param id The ID of the project to update
     * @param projectDTO The updated project data
     * @return ResponseEntity containing the updated project
     */
    @PutMapping("/{id}")// Handles PUT requests
    //Takes both ID and updated data
    //Returns updated project
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectDTO projectDTO) {
        ProjectDTO updatedProject = projectService.updateProject(id, projectDTO);
        return ResponseEntity.ok(updatedProject);
    }

    /**
     * Deletes a project.
     *
     * @param id The ID of the project to delete
     * @return ResponseEntity with no content
     */
    @DeleteMapping("/{id}")//Handles DELETE requests
    //Returns 204 (NO CONTENT) on success
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}