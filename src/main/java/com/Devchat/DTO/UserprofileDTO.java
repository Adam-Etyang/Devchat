package com.Devchat.DTO;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UserprofileDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String profilePicture;
    private LocalDate createdAt;
    private LocalDate LastloginAt;
}


