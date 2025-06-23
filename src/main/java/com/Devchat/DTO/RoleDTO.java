package com.Devchat.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object for Role entity.
 * Used for transferring role data between layers.
 */
public class RoleDTO {

    /**
     * Role name with validation constraints:
     * - Cannot be blank
     * - Must be between 2 and 50 characters
     */
    @NotBlank(message = "Role name is required")
    @Size(min = 2, max = 50, message = "Role name must be between 2 and 50 characters")
    private String name;

    /**
     * Role description with validation constraint:
     * - Optional but cannot exceed 200 characters
     */
    @Size(max = 200, message = "Description cannot exceed 200 characters")
    private String description;

    /**
     * ID field for updates and responses.
     * Not included in validation as it's managed by the system.
     */
    private Long id;

    /**
     * Default constructor required for JSON deserialization.
     */
    public RoleDTO() {
    }

    /**
     * Constructor with name and description.
     *
     * @param name The name of the role
     * @param description The description of the role
     */
    public RoleDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
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
}