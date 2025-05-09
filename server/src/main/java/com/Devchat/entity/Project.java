package com.Devchat.entity;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.Devchat.model.User;

@Entity
@Table(name = "projects")
@Data

public class Project {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private long id;

@Column(nullable = false)
private String name;

@Column(nullable = false)
private String description;

@ManyToOne
@JoinColumn(name = "owner_id", nullable = false)
private User owner;

@Column(nullable = false, name = "created_at")
private LocalDateTime createdAt = LocalDateTime.now();

@Column(name = "updated_at")
private LocalDateTime updatedAt = LocalDateTime.now();
    
}
