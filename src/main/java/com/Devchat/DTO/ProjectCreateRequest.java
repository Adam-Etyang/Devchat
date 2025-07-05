package com.Devchat.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

/**
 * DTO for project creation requests that handles string dates from frontend
 */
public class ProjectCreateRequest {

    @NotBlank(message = "Project name is required")
    @Size(min = 3, max = 100, message = "Project name must be between 3 and 100 characters")
    private String name;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotBlank(message = "Project status is required")
    private String status;

    // String date from frontend datetime-local input
    private String startDate;

    // String date from frontend datetime-local input
    private String endDate;

    @NotBlank(message = "Project manager is required")
    private String managerId;

    // Default constructor
    public ProjectCreateRequest() {
    }

    // Convert to ProjectDTO
    public ProjectDTO toProjectDTO() {
        ProjectDTO dto = new ProjectDTO();
        dto.setName(this.name);
        dto.setDescription(this.description);
        dto.setStatus(this.status);
        dto.setManagerId(this.managerId);

        // Convert string dates to LocalDateTime
        if (this.startDate != null && !this.startDate.trim().isEmpty()) {
            try {
                // Handle "YYYY-MM-DD" format from frontend
                LocalDateTime startDateTime = LocalDateTime.parse(this.startDate + "T00:00:00");
                dto.setStartDate(startDateTime);
            } catch (Exception e) {
                // If parsing fails, use current time
                dto.setStartDate(LocalDateTime.now());
            }
        } else {
            dto.setStartDate(LocalDateTime.now());
        }

        if (this.endDate != null && !this.endDate.trim().isEmpty()) {
            try {
                // Handle "YYYY-MM-DD" format from frontend
                LocalDateTime endDateTime = LocalDateTime.parse(this.endDate + "T23:59:59");
                dto.setEndDate(endDateTime);
            } catch (Exception e) {
                // If parsing fails, leave as null
                dto.setEndDate(null);
            }
        }

        return dto;
    }

    // Getters and Setters
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

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getManagerId() {
        return managerId;
    }

    public void setManagerId(String managerId) {
        this.managerId = managerId;
    }
}