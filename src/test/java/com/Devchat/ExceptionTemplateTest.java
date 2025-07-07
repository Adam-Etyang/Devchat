package com.Devchat;

import com.Devchat.exceptions.ProjectNotFoundException; // Change to your exception
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ExceptionTemplateTest {

    @Test
    void testExceptionMessage() {
        ProjectNotFoundException ex = new ProjectNotFoundException("Project not found");
        assertEquals("Project not found", ex.getMessage());
    }
}