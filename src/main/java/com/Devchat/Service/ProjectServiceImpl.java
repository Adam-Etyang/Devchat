package com.Devchat.Service;

import com.Devchat.exceptions.ProjectNotFoundException;
import com.Devchat.entity.*;
import com.Devchat.DTO.ProjectDTO; // NEW: Import ProjectDTO
import com.Devchat.mapper.ProjectMapper; // NEW: Import ProjectMapper
import com.Devchat.repository.*;
import com.Devchat.util.UserContext;

//Spring annotations for dependency injection and transactions
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//for timestamps
import java.time.LocalDateTime;

//for collections
import java.util.List;
import java.util.stream.Collectors; // NEW: For converting lists

@Service // marks this as a Spring service component
@Transactional // ensures all methods run in a database transaction
public class ProjectServiceImpl implements ProjectService {

    // Inject the ProjectRepository(Field injection)
    // Declares a private final field for the repository
    private final ProjectRepository projectRepository; // final ensures the repository can't be changed after
                                                       // initialization

    // NEW: Inject the ProjectMapper for DTO conversion
    private final ProjectMapper projectMapper;

    // NEW: Inject the UserRepository to fetch users
    private final UserRepository userRepository;

    // NEW: Inject the UpdateService to record updates
    private final UpdateService updateService;

    // Constructor-based dependency injection
    public ProjectServiceImpl(ProjectRepository projectRepository, ProjectMapper projectMapper,
            UserRepository userRepository, UpdateService updateService) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
        this.userRepository = userRepository;
        this.updateService = updateService;
    }

    @Override
    public ProjectDTO createProject(ProjectDTO projectDTO, Long creatorId) { // Initialization
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Ensure the creator is the current authenticated user
        if (!currentUser.getId().equals(creatorId)) {
            throw new SecurityException("Users can only create projects for themselves");
        }

        // Convert DTO to entity for database operations
        Project project = projectMapper.toEntity(projectDTO);

        // Set the createdBy field using the current user
        project.setCreatedBy(currentUser);

        // Set the owner field to the same user (for now, owner and creator are the
        // same)
        project.setOwner(currentUser);

        // Set creation timestamp
        project.setCreatedAt(LocalDateTime.now());
        // Save and return the project as DTO
        Project savedProject = projectRepository.save(project);

        // Record the update for real-time notifications
        updateService.recordUpdate("projects", "created", savedProject.getId(), savedProject.getName());

        return projectMapper.toDTO(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long projectId) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Find project by ID, throw exception if not found
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + projectId));

        // Check if user has access to this project (creator, owner, or member)
        if (!project.getCreatedBy().getId().equals(currentUser.getId()) &&
                !project.getOwner().getId().equals(currentUser.getId()) &&
                !isUserProjectMember(projectId, currentUser.getId())) {
            throw new SecurityException("Access denied: You don't have permission to view this project");
        }

        // Convert to DTO before returning
        return projectMapper.toDTO(project);
    }

    @Override
    public ProjectDTO updateProject(Long projectId, ProjectDTO projectDTO) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Get existing project - we need to get the entity directly from repository
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + projectId));

        // Check if user has permission to update this project (creator or owner only)
        if (!project.getCreatedBy().getId().equals(currentUser.getId()) &&
                !project.getOwner().getId().equals(currentUser.getId())) {
            throw new SecurityException("Access denied: Only project creators and owners can update projects");
        }

        // Update fields from DTO
        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());

        // Save and return updated project as DTO
        Project updatedProject = projectRepository.save(project);

        // Record the update for real-time notifications
        updateService.recordUpdate("projects", "updated", updatedProject.getId(), updatedProject.getName());

        return projectMapper.toDTO(updatedProject);
    }

    @Override
    public void deleteProject(Long projectId) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Get existing project to check permissions
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + projectId));

        // Check if user has permission to delete this project (creator or owner only)
        if (!project.getCreatedBy().getId().equals(currentUser.getId()) &&
                !project.getOwner().getId().equals(currentUser.getId())) {
            throw new SecurityException("Access denied: Only project creators and owners can delete projects");
        }

        // Delete the project
        projectRepository.deleteById(projectId);

        // Record the update for real-time notifications
        updateService.recordUpdate("projects", "deleted", projectId, project.getName());
    }

    @Override
    @Transactional(readOnly = true) // for optimization
    public List<ProjectDTO> getAllProjects() {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Get only projects that the current user has access to
        return getProjectsByUserId(currentUser.getId());
    }

    // Uses custom repository method we created earlier
    @Override
    @Transactional(readOnly = true)
    // Returns list of projects created by specific user
    public List<ProjectDTO> getProjectsByCreator(Long userId) {
        // Get projects and convert to DTOs
        return projectRepository.findByCreatedBy_Id(userId).stream()
                .map(projectMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    // Get all projects by user ID (either as creator or member)
    public List<ProjectDTO> getProjectsByUserId(Long userId) {
        // Get projects where user is creator
        List<ProjectDTO> createdProjects = getProjectsByCreator(userId);

        // Get projects where user is member
        List<ProjectDTO> memberProjects = getProjectsByMember(userId);

        // Combine and remove duplicates (in case user is both creator and member)
        List<ProjectDTO> allProjects = createdProjects.stream()
                .filter(project -> !memberProjects.stream()
                        .anyMatch(memberProject -> memberProject.getId().equals(project.getId())))
                .collect(Collectors.toList());

        allProjects.addAll(memberProjects);

        return allProjects;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> searchProjectsByName(String name) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Get all projects the user has access to
        List<ProjectDTO> userProjects = getProjectsByUserId(currentUser.getId());

        // Filter by name (case-insensitive)
        return userProjects.stream()
                .filter(project -> project.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    // Uses repository method to check membership
    // Returns true if user is a member, false otherwise
    public boolean isUserProjectMember(Long projectId, Long userId) {
        return projectRepository.existsByIdAndMembers_User_Id(projectId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    // Uses repository method to find projects where user is a member
    public List<ProjectDTO> getProjectsByMember(Long userId) {
        // Returns list of projects as DTOs
        return projectRepository.findByMembers_User_Id(userId).stream()
                .map(projectMapper::toDTO)
                .collect(Collectors.toList());
    }
}