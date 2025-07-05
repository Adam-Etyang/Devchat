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
@RestController // Tells Spring this is a REST controller
@RequestMapping("/api/projects") // Sets the base URL for all endpoints in this controller
public class ProjectController {

    // Declares our service dependency
    private final ProjectService projectService;//

    // Uses constructor injection (best practice)
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    /**
     * Creates a new project.
     *
     * @param createRequest The project creation request
     * @return ResponseEntity containing the created project
     */
    @PostMapping("/create") // Handles HTTP POST requests
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody ProjectCreateRequest createRequest) {
        try {
            System.out.println("Received project creation request: " + createRequest.getName());

            // Convert the request to ProjectDTO
            ProjectDTO projectDTO = createRequest.toProjectDTO();
            System.out.println("Converted to ProjectDTO: " + projectDTO.getName());

            // Use the managerId from the request body as the creator ID
            Long creatorId = Long.parseLong(projectDTO.getManagerId());
            System.out.println("Creator ID: " + creatorId);

            ProjectDTO createdProject = projectService.createProject(projectDTO, creatorId);
            System.out.println("Project created successfully with ID: " + createdProject.getId());

            return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
        } catch (NumberFormatException e) {
            System.err.println("NumberFormatException: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            System.err.println("Exception in createProject: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Retrieves a project by its ID.
     *
     * @param id The ID of the project to retrieve
     * @return ResponseEntity containing the project if found
     */
    @GetMapping("/{id}") // Handles GET requests with ID parameter
    // @PathVariable: Gets ID from URL
    // Returns 200 (OK) with the project
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        ProjectDTO project = projectService.getProjectById(id);
        return ResponseEntity.ok(project);
    }

    /**
     * Retrieves all projects.
     *
     * @return ResponseEntity containing a list of all projects
     */
    @GetMapping // Handles GET requests without parameters
    // Returns list of all projects
    public ResponseEntity<List<ProjectDTO>> getAllProjects(
            @RequestParam(required = false) Long userId) {

        if (userId != null) {
            // Get projects by user ID
            List<ProjectDTO> userProjects = projectService.getProjectsByUserId(userId);
            return ResponseEntity.ok(userProjects);
        } else {
            // Get all projects
            List<ProjectDTO> projects = projectService.getAllProjects();
            return ResponseEntity.ok(projects);
        }
    }

    /**
     * Searches projects by name (case-insensitive).
     *
     * @param name The name to search for
     * @return ResponseEntity containing a list of matching projects
     */
    @GetMapping("/search") // Handles GET requests for search
    public ResponseEntity<List<ProjectDTO>> searchProjectsByName(
            @RequestParam String name) {
        List<ProjectDTO> projects = projectService.searchProjectsByName(name);
        return ResponseEntity.ok(projects);
    }

    /**
     * Updates an existing project.
     *
     * @param id         The ID of the project to update
     * @param projectDTO The updated project data
     * @return ResponseEntity containing the updated project
     */
    @PutMapping("/{id}") // Handles PUT requests
    // Takes both ID and updated data
    // Returns updated project
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
    @DeleteMapping("/{id}") // Handles DELETE requests
    // Returns 204 (NO CONTENT) on success
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}