package com.Devchat.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

// Marks this class as a JPA entity that will be mapped to a database table
@Entity
// Specifies the name of the database table that will store Project records
@Table(name = "projects")
public class Project {

    // Marks this field as the primary key of the entity
    @Id
    // Configures how the primary key value is generated
    // IDENTITY means the database will automatically generate the value
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Marks this field as a database column that cannot be null
    @Column(nullable = false)
    private String name;

    // Marks this field as a database column that can be null
    @Column
    private String description;

    // Defines a many-to-one relationship with User entity
    // Many projects can be created by one user
    @ManyToOne
    // Specifies the foreign key column name and that it cannot be null
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    // Stores the date and time when the project was created
    private LocalDateTime createdAt;

    // Defines a one-to-many relationship with ProjectMember entity
    // One project can have many members
    @OneToMany(
            // Specifies that the ProjectMember entity has a field named 'project' that maps back to this entity
            mappedBy = "project",
            // Specifies that operations on Project should cascade to ProjectMember
            cascade = CascadeType.ALL,
            // If a ProjectMember is removed from this list, delete it from the database
            orphanRemoval = true
    )
    private List<ProjectMember> members;

    // Defines a one-to-many relationship with Issue entity
    // One project can have many issues
    @OneToMany(
            // Specifies that the Issue entity has a field named 'project' that maps back to this entity
            mappedBy = "project",
            // Specifies that operations on Project should cascade to Issue
            cascade = CascadeType.ALL,
            // If an Issue is removed from this list, delete it from the database
            orphanRemoval = true
    )
    private List<Issue> issues;

    // Default constructor required by JPA
    // JPA needs this to create instances of the entity
    public Project() {
    }

    // Parameterized constructor for convenience
    // Allows creating a Project with initial values
    public Project(String name, String description, User createdBy, LocalDateTime createdAt) {
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
    }

    // Getter for id
    // Returns the unique identifier of the project
    public Long getId() {
        return id;
    }

    // Setter for id
    // Sets the unique identifier of the project
    public void setId(Long id) {
        this.id = id;
    }

    // Getter for name
    // Returns the name of the project
    public String getName() {
        return name;
    }

    // Setter for name
    // Sets the name of the project
    public void setName(String name) {
        this.name = name;
    }

    // Getter for description
    // Returns the description of the project
    public String getDescription() {
        return description;
    }

    // Setter for description
    // Sets the description of the project
    public void setDescription(String description) {
        this.description = description;
    }

    // Getter for createdBy
    // Returns the user who created the project
    public User getCreatedBy() {
        return createdBy;
    }

    // Setter for createdBy
    // Sets the user who created the project
    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    // Getter for createdAt
    // Returns when the project was created
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Setter for createdAt
    // Sets when the project was created
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Getter for members
    // Returns the list of project members
    public List<ProjectMember> getMembers() {
        return members;
    }

    // Setter for members
    // Sets the list of project members
    public void setMembers(List<ProjectMember> members) {
        this.members = members;
    }

    // Getter for issues
    // Returns the list of project issues
    public List<Issue> getIssues() {
        return issues;
    }

    // Setter for issues
    // Sets the list of project issues
    public void setIssues(List<Issue> issues) {
        this.issues = issues;
    }

}