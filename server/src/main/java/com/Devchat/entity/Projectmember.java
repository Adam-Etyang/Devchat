package com.Devchat.entity;


import jakarta.persistence.*;
import lombok.Data;
import com.Devchat.model.*;


@Entity
@Data
@Table(name = "project_members")

public class Projectmember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;


}
