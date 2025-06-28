package com.Devchat.Service;

import com.Devchat.DTO.IssueDTO;
import java.util.List;

public interface IssueService {

    /**
     * Create a new issue
     */
    IssueDTO createIssue(IssueDTO issueDTO, Long creatorId);

    /**
     * Get an issue by ID
     */
    IssueDTO getIssueById(Long issueId);

    /**
     * Update an existing issue
     */
    IssueDTO updateIssue(Long issueId, IssueDTO issueDTO);

    /**
     * Delete an issue
     */
    void deleteIssue(Long issueId);

    /**
     * Get all issues
     */
    List<IssueDTO> getAllIssues();

    /**
     * Get issues by project ID
     */
    List<IssueDTO> getIssuesByProject(Long projectId);

    /**
     * Get issues assigned to a user
     */
    List<IssueDTO> getIssuesByAssignee(Long userId);
}