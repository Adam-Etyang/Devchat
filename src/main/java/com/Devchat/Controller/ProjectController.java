package com.Devchat.Controller;

//Our data transfer object for projects
import com.Devchat.DTO.*;
//The service interface we'll use for business logic
import com.Devchat.Service.*;
//For validating incoming data
import jakarta.validation.Valid;
import com.Devchat.util.UserContext;

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

            // Get the current authenticated user's ID
            Long creatorId = UserContext.requireCurrentUserId();
            System.out.println("Creator ID: " + creatorId);

            ProjectDTO createdProject = projectService.createProject(projectDTO, creatorId);
            System.out.println("Project created successfully with ID: " + createdProject.getId());

            return new ResponseEntity<>(createdProject, HttpStatus.CREATED);
        } catch (SecurityException e) {
            System.err.println("SecurityException: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
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
     * Retrieves all projects for the current authenticated user.
     *
     * @return ResponseEntity containing a list of all projects
     */
    @GetMapping // Handles GET requests without parameters
    // Returns list of all projects
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        try {
            // Get all projects for the current authenticated user
            List<ProjectDTO> projects = projectService.getAllProjects();
            return ResponseEntity.ok(projects);
        } catch (SecurityException e) {
            System.err.println("SecurityException: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            System.err.println("Exception in getAllProjects: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Searches projects by name (case-insensitive) for the current authenticated
     * user.
     *
     * @param name The name to search for
     * @return ResponseEntity containing a list of matching projects
     */
    @GetMapping("/search") // Handles GET requests for search
    public ResponseEntity<List<ProjectDTO>> searchProjectsByName(
            @RequestParam String name) {
        try {
            List<ProjectDTO> projects = projectService.searchProjectsByName(name);
            return ResponseEntity.ok(projects);
        } catch (SecurityException e) {
            System.err.println("SecurityException: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            System.err.println("Exception in searchProjectsByName: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
        try {
            ProjectDTO updatedProject = projectService.updateProject(id, projectDTO);
            return ResponseEntity.ok(updatedProject);
        } catch (SecurityException e) {
            System.err.println("SecurityException: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            System.err.println("Exception in updateProject: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
        try {
            projectService.deleteProject(id);
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            System.err.println("SecurityException: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            System.err.println("Exception in deleteProject: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}