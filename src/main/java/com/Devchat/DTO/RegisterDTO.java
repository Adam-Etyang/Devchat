package com.Devchat.DTO;

import lombok.Data;

@Data
public class RegisterDTO {
    private String username;
    private String email;
    private String fullName;
    private String password;
    private String profilePicture;
    private String createdAt;
    private String updatedAt;

}
