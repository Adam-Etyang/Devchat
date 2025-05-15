package com.Devchat.model;

import lombok.Data;
import jakarta.persistence.*;

import com.Devchat.entity.*;

@Entity
@Table(name = "project-members")
@Data
public class ProjectMember {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // project
  @ManyToOne
  @JoinColumn(nullable = false, name = "project_id")
  private Project project;
  // users
  @ManyToOne
  @JoinColumn(nullable = false, name = "user_id")
  private User user;
  // role
  @Enumerated
  @Column(nullable = false)
  private Role role;
}
