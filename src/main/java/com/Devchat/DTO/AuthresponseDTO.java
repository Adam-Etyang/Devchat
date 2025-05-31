package com.Devchat.DTO;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthresponseDTO {
    private String token;
    private String tokenType = "Bearer";
    private UserprofileDTO userProfile;
    private long expiresIn; // Token expiration time in seconds
}
