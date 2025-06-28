package com.Devchat.repository;

import com.Devchat.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

    /**
     * Find all issues by project ID
     */
    List<Issue> findByProjectId(Long projectId);

    /**
     * Find all issues assigned to a specific user
     */
    List<Issue> findByAssignedToId(Long userId);

    /**
     * Find all issues created by a specific user
     */
    List<Issue> findByCreatedById(Long userId);

    /**
     * Find all issues by status
     */
    List<Issue> findByStatus(String status);

    /**
     * Find all issues by priority
     */
    List<Issue> findByPriority(String priority);

    /**
     * Find all issues by type
     */
    List<Issue> findByType(String type);
}