package com.Devchat.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Email;

public class UserDTO {
    @NotBlank(message = "Username is required")
    public String username;
    @NotBlank(message = "Password is required")
    public String password;
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    public String email;
    @NotBlank(message = "Full name is required")
    public String fullName;
}
