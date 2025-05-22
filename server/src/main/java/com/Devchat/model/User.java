package com.Devchat.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity //mapping the user class to a database table
@Table(name = "app_users")//sets the actual name of the table 

@Data
@Getter
@Setter
public class User {
    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//autogenerates the id   
    private long id;

    @Column(nullable = false)//maps the username field to a column in the table
    private String username;

    @Column(nullable  = false)
    private String fullName;

    @Column(nullable = false, unique = true)//maps the password field to a column in the table
    private String email;
    
    @Column(nullable = false)//maps the profilePicture field to a column in the table
    private String profilePicture;//url to the profile picture  

    @Column(nullable = false)
    private String password;//hashed password

    @Column(nullable = false, name = "created_at")//maps the createdAt field to a column in the table
    private LocalDateTime createdAt = LocalDateTime.now();//date and time of user creation

    @Column(name = "updated_at")//maps the updatedAt field to a column in the table
    private LocalDateTime updatedAt = LocalDateTime.now();//date and time of user update

    
    

}
