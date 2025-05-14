package com.Devchat.dto;

import jakarta.validation.constraints.NotBlank;

import javax.validation.constraints.NotBlank;

public class LoginDTO {
    @NotBlank(message = "Username is required")
    public String username;

    @NotBlank(message = "Password is required")
    public String password;
}