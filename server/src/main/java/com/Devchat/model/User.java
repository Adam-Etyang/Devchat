package com.example.Devchat.model;
import jakarta.persistence.*;

@Entity //mapping the user class to a database table
@Table(name = "app-users")//sets the actual name of the table 
public class User {
    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//autogenerates the id
    private long id;

    private String username;
    private String email;
    
    //getter and setter methods
}
