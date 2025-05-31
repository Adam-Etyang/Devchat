package com.Devchat.DTO;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class LoginDTO {
    @NotBlank(message = "Email or Username is required")
    private String emailOrUsername;

    @NotBlank(message = "Password is required")
    private String password;

    private boolean rememberMe = false; // Optional field for "Remember Me" functionality
}
