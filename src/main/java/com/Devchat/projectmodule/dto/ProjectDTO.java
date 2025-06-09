package com.Devchat.projectmodule.dto;

// Import validation annotations
//Validation annotations are used to ensure data is valid
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;


//for timestamp handling
import java.time.LocalDateTime;

import java.util.List;

/**
 * Data Transfer Object (DTO) for Project entity.
 * Used to transfer project data between layers without exposing internal implementation details.
 */
public class ProjectDTO {

    // Project name cannot be blank and must be between 3 and 100 characters
    @NotBlank(message = "Project name is required")
    @Size(min = 3, max = 100, message = "Project name must be between 3 and 100 characters")
    private String name;

    // Description is optional but can't be too long
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    //id field since we'll need it for updates and responses:
    private Long id;

    // Project status cannot be blank
    @NotBlank(message = "Project status is required")
    private String status;

    // Start date must be in the past or present
    @NotNull(message = "Start date is required")
    @PastOrPresent(message = "Start date must be in the past or present")
    private LocalDateTime startDate;

    // End date is optional but must be after start date if provided
    private LocalDateTime endDate;

    // Project manager ID cannot be blank
    @NotBlank(message = "Project manager is required")
    private String managerId;

    // List of project members
    private List<ProjectMemberDTO> members;


    //To track who created the project:
    private Long createdById;

    //to track when the project was created:
    private LocalDateTime createdAt;

    //to track when the project was last updated:
    private LocalDateTime updatedAt;


    //default constructor (required for JSON deserialization):
    public ProjectDTO() {
    }

    //Default constructor is required for JSON deserialization
    //Constructor with required fields
    public ProjectDTO(String name, String description, String status, LocalDateTime startDate, String managerId) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.startDate = startDate;
        this.managerId = managerId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getManagerId() {
        return managerId;
    }

    public void setManagerId(String managerId) {
        this.managerId = managerId;
    }

    public List<ProjectMemberDTO> getMembers() {
        return members;
    }

    public void setMembers(List<ProjectMemberDTO> members) {
        this.members = members;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

}
