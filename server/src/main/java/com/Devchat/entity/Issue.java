package com.Devchat.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.Devchat.model.User;


@Entity
@Table(name = "Issues")
@Data


public class Issue {    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String status;

    @Column
    private LocalDateTime dueDate;

    @Column(nullable = false, name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "priority")
    private String priority;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private User createdby;

    @ManyToOne
    @JoinColumn(name = "assignee_id", nullable = false)
    private User assigned_to;






}
