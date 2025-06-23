package com.Devchat.entity;

import jakarta.persistence.*;
import java.util.List;

/**
 * Entity class representing a role in the system.
 * This class maps to the 'roles' table in the database.
 */
@Entity
@Table(name = "roles")
public class Role {

    /**
     * Primary key of the role.
     * Automatically generated using identity strategy.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Name of the role.
     * Cannot be null and must be unique across all roles.
     */
    @Column(nullable = false, unique = true)
    private String name;

    /**
     * Description of the role.
     * Optional field that can be null.
     */
    @Column
    private String description;

    /**
     * One-to-many relationship with ProjectMember.
     * One role can be assigned to many project members.
     * This is the inverse side of the relationship.
     */
    @OneToMany(mappedBy = "role")
    private List<ProjectMember> projectMembers;

    /**
     * Default constructor required by JPA.
     */
    public Role() {
    }

    /**
     * Constructor with name and description.
     *
     * @param name The name of the role
     * @param description The description of the role
     */
    public Role(String name, String description) {
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

    public List<ProjectMember> getProjectMembers() {
        return projectMembers;
    }

    public void setProjectMembers(List<ProjectMember> projectMembers) {
        this.projectMembers = projectMembers;
    }
}