package com.Devchat.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.Devchat.entity.*;

@Entity
@Table(name = "projects")
@Data
public class Project {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // project name
  @Column(nullable = false)
  private String name;

  // description

  private String description;
  // creator
  @Column(name = "creator_id", nullable = false)
  private User creator;
  @Column(name = "created_at", nullable = false)
  private LocalDateTime created_at = LocalDateTime.now();
  // members List/array
  @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ProjectMember> members = new ArrayList<>();
  // issues related to the project
  @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Issue> issues = new ArrayList<>();

}
