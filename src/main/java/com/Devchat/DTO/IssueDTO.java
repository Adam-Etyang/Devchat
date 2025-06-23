package com.Devchat.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IssueDTO {
    private Long id;
    private Long projectId;
    private String title;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private Long assignedToId;
}