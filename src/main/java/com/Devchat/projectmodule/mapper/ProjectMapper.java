package com.Devchat.projectmodule.mapper;

import com.Devchat.projectmodule.Project;
import com.Devchat.projectmodule.dto.ProjectDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper class to convert between Project entity and ProjectDTO.
 * Handles the conversion of data between the persistence layer and the API layer.
 */
@Component //marks this as a Spring-managed bean that can be automatically injected where needed
           //This allows the mapper to be used throughout your application
public class ProjectMapper {

    /**
     * Converts a Project entity to a ProjectDTO.
     *
     * @param project The Project entity to convert
     * @return The converted ProjectDTO
     */

    //Converts a Project entity to a ProjectDTO
    //Handles null checks to prevent NullPointerExceptions
    //Maps all relevant fields from the entity to the DTO
    //Special handling for the creator relationship by only passing the ID
    public ProjectDTO toDTO(Project project) {
        if (project == null) {
            return null;
        }

        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());

        // Set creator ID if available
        if (project.getCreatedBy() != null) {
            dto.setCreatedById(project.getCreatedBy().getId());
        }

        return dto;
    }

    /**
     * Converts a ProjectDTO to a Project entity.
     *
     * @param dto The ProjectDTO to convert
     * @return The converted Project entity
     */
    //Converts a ProjectDTO back to a Project entity
    //Maps all fields from the DTO to the entity
    public Project toEntity(ProjectDTO dto) {
        if (dto == null) {
            return null;
        }

        Project project = new Project();
        project.setId(dto.getId());
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setCreatedAt(dto.getCreatedAt());

        return project;
    }

    /**
     * Converts a list of Project entities to a list of ProjectDTOs.
     *
     * @param projects The list of Project entities to convert
     * @return The converted list of ProjectDTOs
     */
    //Converts a list of Project entities to a list of ProjectDTOs
    //Uses Java streams for efficient conversion
    //Handles null checks
    public List<ProjectDTO> toDTOList(List<Project> projects) {
        if (projects == null) {
            return null;
        }

        return projects.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}