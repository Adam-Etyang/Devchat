package com.Devchat.Service;

import com.Devchat.exceptions.ProjectNotFoundException;
import com.Devchat.entity.*;
import com.Devchat.DTO.ProjectDTO; // NEW: Import ProjectDTO
import com.Devchat.mapper.ProjectMapper; // NEW: Import ProjectMapper
import com.Devchat.repository.*;

//Spring annotations for dependency injection and transactions
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

//for timestamps
import java.time.LocalDateTime;

//for collections
import java.util.List;
import java.util.stream.Collectors; // NEW: For converting lists

@Service //marks this as a Spring service component
@Transactional //ensures all methods run in a database transaction
public class ProjectServiceImpl implements ProjectService {

    //Inject the ProjectRepository(Field injection)
    //Declares a private final field for the repository
    private final ProjectRepository projectRepository; //final ensures the repository can't be changed after initialization

    // NEW: Inject the ProjectMapper for DTO conversion
    private final ProjectMapper projectMapper;

    // Constructor-based dependency injection
    public ProjectServiceImpl(ProjectRepository projectRepository, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
    }

    @Override
    public ProjectDTO createProject(ProjectDTO projectDTO, Long creatorId) { //Initialization
        // Convert DTO to entity for database operations
        Project project = projectMapper.toEntity(projectDTO);
        // Set creation timestamp
        project.setCreatedAt(LocalDateTime.now());
        // Save and return the project as DTO
        Project savedProject = projectRepository.save(project);
        return projectMapper.toDTO(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectDTO getProjectById(Long projectId) {
        // Find project by ID, throw exception if not found
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + projectId));
        // Convert to DTO before returning
        return projectMapper.toDTO(project);
    }

    @Override
    public ProjectDTO updateProject(Long projectId, ProjectDTO projectDTO) {
        // Get existing project - we need to get the entity directly from repository
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project not found with id: " + projectId));

        // Update fields from DTO
        project.setName(projectDTO.getName());
        project.setDescription(projectDTO.getDescription());

        // Save and return updated project as DTO
        Project updatedProject = projectRepository.save(project);
        return projectMapper.toDTO(updatedProject);
    }

    @Override
    public void deleteProject(Long projectId) {
        // Check if project exists
        if (!projectRepository.existsById(projectId)) {
            throw new ProjectNotFoundException("Project not found with id: " + projectId);
        }
        // Delete the project
        projectRepository.deleteById(projectId);
    }

    @Override
    @Transactional(readOnly = true)// for optimization
    public List<ProjectDTO> getAllProjects() {
        // Get all projects and convert to DTOs
        return projectRepository.findAll().stream()
                .map(projectMapper::toDTO)
                .collect(Collectors.toList());
    }

    //Uses custom repository method we created earlier
    @Override
    @Transactional(readOnly = true)
    //Returns list of projects created by specific user
    public List<ProjectDTO> getProjectsByCreator(Long userId) {
        // Get projects and convert to DTOs
        return projectRepository.findByCreatedBy_Id(userId).stream()
                .map(projectMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectDTO> searchProjectsByName(String name) {
        //Returns list of matching projects as DTOs
        return projectRepository.findByNameContainingIgnoreCase(name).stream()
                .map(projectMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    //Uses repository method to check membership
    //Returns true if user is a member, false otherwise
    public boolean isUserProjectMember(Long projectId, Long userId) {
        return projectRepository.existsByIdAndMembers_User_Id(projectId, userId);
    }

    @Override
    @Transactional(readOnly = true)
    //Uses repository method to find projects where user is a member
    public List<ProjectDTO> getProjectsByMember(Long userId) {
        //Returns list of projects as DTOs
        return projectRepository.findByMembers_User_Id(userId).stream()
                .map(projectMapper::toDTO)
                .collect(Collectors.toList());
    }
}