package com.Devchat.Controller;

import com.Devchat.DTO.IssueDTO;
import com.Devchat.Service.IssueService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for handling Issue-related HTTP requests.
 */
@RestController
@RequestMapping("/api/issues")
public class IssueController {

    private final IssueService issueService;

    public IssueController(IssueService issueService) {
        this.issueService = issueService;
    }

    /**
     * Creates a new issue.
     */
    @PostMapping
    public ResponseEntity<IssueDTO> createIssue(@RequestBody IssueDTO issueDTO) {
        // Get user ID from the DTO, which should be set by the frontend
        Long creatorId = issueDTO.getReporterId();

        // Ensure creatorId is not null
        if (creatorId == null) {
            // Handle cases where the creator ID is not provided
            // You might want to return a BAD_REQUEST response
            // For now, we'll fallback to a default, but this should be improved
            creatorId = 2L; // TODO: Replace with proper JWT authentication and error handling
        }

        IssueDTO createdIssue = issueService.createIssue(issueDTO, creatorId);
        return new ResponseEntity<>(createdIssue, HttpStatus.CREATED);
    }

    /**
     * Retrieves an issue by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<IssueDTO> getIssueById(@PathVariable Long id) {
        IssueDTO issue = issueService.getIssueById(id);
        return ResponseEntity.ok(issue);
    }

    /**
     * Retrieves all issues.
     */
    @GetMapping
    public ResponseEntity<List<IssueDTO>> getAllIssues() {
        List<IssueDTO> issues = issueService.getAllIssues();
        return ResponseEntity.ok(issues);
    }

    /**
     * Get issues by project ID
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<IssueDTO>> getIssuesByProject(@PathVariable Long projectId) {
        List<IssueDTO> issues = issueService.getIssuesByProject(projectId);
        return ResponseEntity.ok(issues);
    }

    /**
     * Updates an existing issue.
     */
    @PutMapping("/{id}")
    public ResponseEntity<IssueDTO> updateIssue(@PathVariable Long id, @RequestBody IssueDTO issueDTO) {
        IssueDTO updatedIssue = issueService.updateIssue(id, issueDTO);
        return ResponseEntity.ok(updatedIssue);
    }

    /**
     * Deletes an issue.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        issueService.deleteIssue(id);
        return ResponseEntity.noContent().build();
    }
}