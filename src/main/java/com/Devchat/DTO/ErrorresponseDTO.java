package com.Devchat.DTO;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorresponseDTO {
    private String message;
    private String errorCode;
    private List<String> details;
    private String path;
    private LocalDate timestamp;
}
