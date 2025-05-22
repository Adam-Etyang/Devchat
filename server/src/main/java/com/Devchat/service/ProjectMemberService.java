// src/main/java/com/example/collabplatform/service/ProjectMemberService.java
package com.Devchat.service;

import com.Devchat.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.Devchat.model.*;
import com.Devchat.entity.Project;
import com.Devchat.entity.ProjectMember;
import com.Devchat.entity.Role;

@Service
public class ProjectMemberService {
  @Autowired
  private ProjectmemberRepository projectMemberRepository;
  @Autowired
  private ProjectRepository projectRepository;
  @Autowired
  private UserRepository userRepository;

  @Transactional
  public ProjectMember addMember(Long projectId, Long userId, Role role) {
    Project project = projectRepository.findById(projectId)
        .orElseThrow(() -> new RuntimeException("Project not found"));
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (projectMemberRepository.existsByProjectIdAndUserId(projectId, userId)) {
      throw new RuntimeException("User is already a member of the project");
    }

    ProjectMember member = new ProjectMember();
    member.setProject(project);
    member.setUser(user);
    member.setRole(role);
    return projectMemberRepository.save(member);
  }

  @Transactional
  public void updateMemberRole(Long projectId, Long userId, Role newRole) {
    ProjectMember member = projectMemberRepository.findProjectIdAndUserID(projectId, userId)
        .orElseThrow(() -> new RuntimeException("Member not found"));
    member.setRole(newRole);
    projectMemberRepository.save(member);
  }

  @Transactional
  public void removeMember(Long projectId, Long userId) {
    ProjectMember member = projectMemberRepository.findProjectIdAndUserID(projectId, userId)
        .orElseThrow(() -> new RuntimeException("Member not found"));
    projectMemberRepository.delete(member);
  }
}
