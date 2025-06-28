package com.Devchat.Service;

import com.Devchat.DTO.*; // NEW: Import ProjectDTO
import java.util.List;

public interface ProjectService {

    // Create a new project
    // Takes project details and creator user, returns the created project
    ProjectDTO createProject(ProjectDTO projectDTO, Long creatorId); // CHANGED: Now accepts and returns DTO

    // Get a project by its ID
    // Throws ProjectNotFoundException if project doesn't exist
    ProjectDTO getProjectById(Long projectId); // CHANGED: Returns DTO

    // Update project details (name and description)
    // Throws ProjectNotFoundException if project doesn't exist
    ProjectDTO updateProject(Long projectId, ProjectDTO projectDTO); // CHANGED: Accepts DTO instead of individual
                                                                     // fields

    // Delete a project
    // Throws ProjectNotFoundException if project doesn't exist
    void deleteProject(Long projectId); // UNCHANGED

    // Get all projects
    List<ProjectDTO> getAllProjects(); // CHANGED: Returns list of DTOs

    // Get all projects created by a specific user
    List<ProjectDTO> getProjectsByCreator(Long userId); // CHANGED: Returns list of DTOs

    // Get all projects by user ID (either as creator or member)
    List<ProjectDTO> getProjectsByUserId(Long userId);

    // Search projects by name (case-insensitive)
    // Case-insensitive search (will find "Project" or "project")
    List<ProjectDTO> searchProjectsByName(String name); // CHANGED: Returns list of DTOs

    // Check if a user is a member of a project
    boolean isUserProjectMember(Long projectId, Long userId); // UNCHANGED

    // Get all projects where a user is a member
    List<ProjectDTO> getProjectsByMember(Long userId); // CHANGED: Returns list of DTOs
}