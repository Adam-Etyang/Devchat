package com.Devchat.Controller;

import com.Devchat.DTO.IssueDTO;
import com.Devchat.Service.IssueService;
import com.Devchat.util.UserContext;
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
        try {
            // Get the current authenticated user's ID
            Long creatorId = UserContext.requireCurrentUserId();

            IssueDTO createdIssue = issueService.createIssue(issueDTO, creatorId);
            return new ResponseEntity<>(createdIssue, HttpStatus.CREATED);
        } catch (SecurityException e) {
            System.err.println("SecurityException: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            System.err.println("Exception in createIssue: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Retrieves an issue by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<IssueDTO> getIssueById(@PathVariable Long id) {
        try {
            IssueDTO issue = issueService.getIssueById(id);
            return ResponseEntity.ok(issue);
        } catch (SecurityException e) {
            System.err.println("SecurityException: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            System.err.println("Exception in getIssueById: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Retrieves all issues for the current authenticated user.
     */
    @GetMapping
    public ResponseEntity<List<IssueDTO>> getAllIssues() {
        try {
            List<IssueDTO> issues = issueService.getAllIssues();
            return ResponseEntity.ok(issues);
        } catch (SecurityException e) {
            System.err.println("SecurityException: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            System.err.println("Exception in getAllIssues: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get issues by project ID for the current authenticated user.
     */
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<IssueDTO>> getIssuesByProject(@PathVariable Long projectId) {
        try {
            List<IssueDTO> issues = issueService.getIssuesByProject(projectId);
            return ResponseEntity.ok(issues);
        } catch (SecurityException e) {
            System.err.println("SecurityException: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            System.err.println("Exception in getIssuesByProject: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Updates an existing issue.
     */
    @PutMapping("/{id}")
    public ResponseEntity<IssueDTO> updateIssue(@PathVariable Long id, @RequestBody IssueDTO issueDTO) {
        try {
            IssueDTO updatedIssue = issueService.updateIssue(id, issueDTO);
            return ResponseEntity.ok(updatedIssue);
        } catch (SecurityException e) {
            System.err.println("SecurityException: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            System.err.println("Exception in updateIssue: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Deletes an issue.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        try {
            issueService.deleteIssue(id);
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            System.err.println("SecurityException: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            System.err.println("Exception in deleteIssue: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}