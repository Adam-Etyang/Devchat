package com.Devchat.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity to track system updates for real-time notifications
 */
@Entity
@Table(name = "system_updates")
public class Update {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // "projects", "issues", "users", etc.

    @Column(nullable = false)
    private String action; // "created", "updated", "deleted"

    @Column(nullable = false)
    private Long entityId; // ID of the entity that was changed

    @Column
    private String entityName; // Human-readable name of the entity

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private String additionalData; // JSON string with additional data

    // Default constructor
    public Update() {
        this.createdAt = LocalDateTime.now();
    }

    // Constructor with required fields
    public Update(String type, String action, Long entityId, String entityName) {
        this();
        this.type = type;
        this.action = action;
        this.entityId = entityId;
        this.entityName = entityName;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getAdditionalData() {
        return additionalData;
    }

    public void setAdditionalData(String additionalData) {
        this.additionalData = additionalData;
    }
}