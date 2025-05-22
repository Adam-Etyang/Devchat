package com.Devchat.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Devchat.entity.ProjectMember;

@Repository
public interface ProjectmemberRepository extends JpaRepository<ProjectMember, Long> {
  Optional<ProjectMember> findProjectIdAndUserID(Long projectId, Long userID);

  boolean existsByProjectIdAndUserId(Long projectId, Long userID);
}
