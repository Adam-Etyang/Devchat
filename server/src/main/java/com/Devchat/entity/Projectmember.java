package com.Devchat.entity;

import com.Devchat.model.User;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "project-members")
@Data
public class ProjectMember {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  // project
  @ManyToOne
  @JoinColumn(nullable = false, name = "project_id")
  public Project project;
  // users
  @ManyToOne
  @JoinColumn(nullable = false, name = "user_id")
  public User user;
  // role
  @Enumerated
  @Column(nullable = false)
  private Role role;
}
