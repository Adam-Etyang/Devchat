package com.Devchat.Service;

import com.Devchat.DTO.IssueDTO;
import com.Devchat.entity.Issue;
import com.Devchat.entity.Project;
import com.Devchat.entity.User;
import com.Devchat.repository.IssueRepository;
import com.Devchat.repository.ProjectRepository;
import com.Devchat.repository.UserRepository;
import com.Devchat.util.UserContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class IssueServiceImpl implements IssueService {

    private final IssueRepository issueRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final UpdateService updateService;

    public IssueServiceImpl(IssueRepository issueRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository,
            UpdateService updateService) {
        this.issueRepository = issueRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.updateService = updateService;
    }

    @Override
    public IssueDTO createIssue(IssueDTO issueDTO, Long creatorId) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Ensure the creator is the current authenticated user
        if (!currentUser.getId().equals(creatorId)) {
            throw new SecurityException("Users can only create issues for themselves");
        }

        // Find the project
        Project project = projectRepository.findById(issueDTO.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Check if user has access to this project
        if (!project.getCreatedBy().getId().equals(currentUser.getId()) &&
                !project.getOwner().getId().equals(currentUser.getId()) &&
                !projectRepository.existsByIdAndMembers_User_Id(project.getId(), currentUser.getId())) {
            throw new SecurityException("Access denied: You don't have permission to create issues in this project");
        }

        // Find the assignee if specified
        User assignee = null;
        if (issueDTO.getAssignedToId() != null) {
            assignee = userRepository.findById(issueDTO.getAssignedToId())
                    .orElse(null); // Don't throw if assignee not found
        }

        // Create the issue entity
        Issue issue = new Issue();
        issue.setProject(project);
        issue.setTitle(issueDTO.getTitle());
        issue.setDescription(issueDTO.getDescription());
        issue.setType(issueDTO.getType() != null ? issueDTO.getType() : "TASK");
        issue.setPriority(issueDTO.getPriority() != null ? issueDTO.getPriority() : "MEDIUM");
        issue.setStatus(issueDTO.getStatus() != null ? issueDTO.getStatus() : "OPEN");
        issue.setAssignedTo(assignee);
        issue.setCreatedBy(currentUser);
        issue.setCreatedAt(LocalDateTime.now());
        issue.setUpdatedAt(LocalDateTime.now());

        // Save the issue
        Issue savedIssue = issueRepository.save(issue);

        // Convert to DTO
        IssueDTO newIssue = convertToDTO(savedIssue);

        // Record the update for real-time notifications
        updateService.recordUpdate("issues", "created", newIssue.getId(), newIssue.getTitle());

        return newIssue;
    }

    @Override
    @Transactional(readOnly = true)
    public IssueDTO getIssueById(Long issueId) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        // Check if user has access to this issue's project
        Project project = issue.getProject();
        if (!project.getCreatedBy().getId().equals(currentUser.getId()) &&
                !project.getOwner().getId().equals(currentUser.getId()) &&
                !projectRepository.existsByIdAndMembers_User_Id(project.getId(), currentUser.getId())) {
            throw new SecurityException("Access denied: You don't have permission to view this issue");
        }

        return convertToDTO(issue);
    }

    @Override
    public IssueDTO updateIssue(Long issueId, IssueDTO issueDTO) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        // Check if user has access to this issue's project
        Project project = issue.getProject();
        if (!project.getCreatedBy().getId().equals(currentUser.getId()) &&
                !project.getOwner().getId().equals(currentUser.getId()) &&
                !projectRepository.existsByIdAndMembers_User_Id(project.getId(), currentUser.getId())) {
            throw new SecurityException("Access denied: You don't have permission to update this issue");
        }

        // Update fields
        if (issueDTO.getTitle() != null) {
            issue.setTitle(issueDTO.getTitle());
        }
        if (issueDTO.getDescription() != null) {
            issue.setDescription(issueDTO.getDescription());
        }
        if (issueDTO.getType() != null) {
            issue.setType(issueDTO.getType());
        }
        if (issueDTO.getPriority() != null) {
            issue.setPriority(issueDTO.getPriority());
        }
        if (issueDTO.getStatus() != null) {
            issue.setStatus(issueDTO.getStatus());
        }
        if (issueDTO.getAssignedToId() != null) {
            User assignee = userRepository.findById(issueDTO.getAssignedToId()).orElse(null);
            issue.setAssignedTo(assignee);
        } else {
            issue.setAssignedTo(null);
        }

        // Update timestamp
        issue.setUpdatedAt(LocalDateTime.now());

        // Save the updated issue
        Issue savedIssue = issueRepository.save(issue);

        // Convert to DTO
        IssueDTO updatedIssue = convertToDTO(savedIssue);

        // Record the update for real-time notifications
        updateService.recordUpdate("issues", "updated", updatedIssue.getId(), updatedIssue.getTitle());

        return updatedIssue;
    }

    @Override
    public void deleteIssue(Long issueId) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        // Check if user has access to this issue's project
        Project project = issue.getProject();
        if (!project.getCreatedBy().getId().equals(currentUser.getId()) &&
                !project.getOwner().getId().equals(currentUser.getId()) &&
                !projectRepository.existsByIdAndMembers_User_Id(project.getId(), currentUser.getId())) {
            throw new SecurityException("Access denied: You don't have permission to delete this issue");
        }

        // Record the update for real-time notifications before deleting
        updateService.recordUpdate("issues", "deleted", issueId, issue.getTitle());

        // Delete the issue
        issueRepository.delete(issue);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueDTO> getAllIssues() {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Get all projects the user has access to
        List<Project> userProjects = projectRepository.findByCreatedBy_Id(currentUser.getId());
        userProjects.addAll(projectRepository.findByMembers_User_Id(currentUser.getId()));

        // Get all issues from these projects
        return userProjects.stream()
                .flatMap(project -> issueRepository.findByProjectId(project.getId()).stream())
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueDTO> getIssuesByProject(Long projectId) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Check if user has access to this project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (!project.getCreatedBy().getId().equals(currentUser.getId()) &&
                !project.getOwner().getId().equals(currentUser.getId()) &&
                !projectRepository.existsByIdAndMembers_User_Id(projectId, currentUser.getId())) {
            throw new SecurityException("Access denied: You don't have permission to view issues in this project");
        }

        List<Issue> issues = issueRepository.findByProjectId(projectId);
        return issues.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueDTO> getIssuesByAssignee(Long userId) {
        // Get current authenticated user
        User currentUser = UserContext.requireCurrentUser();

        // Users can only see issues assigned to themselves
        if (!currentUser.getId().equals(userId)) {
            throw new SecurityException("Users can only view issues assigned to themselves");
        }

        List<Issue> issues = issueRepository.findByAssignedToId(userId);
        return issues.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Helper method to convert entity to DTO
    private IssueDTO convertToDTO(Issue issue) {
        IssueDTO dto = new IssueDTO();
        dto.setId(issue.getId());
        dto.setProjectId(issue.getProject().getId());
        dto.setProjectName(issue.getProject().getName());
        dto.setTitle(issue.getTitle());
        dto.setDescription(issue.getDescription());
        dto.setType(issue.getType());
        dto.setPriority(issue.getPriority());
        dto.setStatus(issue.getStatus());
        dto.setReporterId(issue.getCreatedBy().getId());
        dto.setReporterName(issue.getCreatedBy().getUsername());
        dto.setCreatedAt(issue.getCreatedAt());
        dto.setUpdatedAt(issue.getUpdatedAt());

        if (issue.getAssignedTo() != null) {
            dto.setAssignedToId(issue.getAssignedTo().getId());
            dto.setAssignedToName(issue.getAssignedTo().getUsername());
        }

        return dto;
    }
}