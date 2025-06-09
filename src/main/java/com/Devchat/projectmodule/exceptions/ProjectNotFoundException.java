package com.Devchat.projectmodule.exceptions;

/**
 * Custom exception class for handling cases where a requested project cannot be found.
 * This exception is thrown when attempting to access or manipulate a project that doesn't exist in the system.
 */
public class ProjectNotFoundException extends RuntimeException {

    /**
     * Constructor that takes a project ID and creates a descriptive error message.
     *
     * @param projectId The ID of the project that was not found
     */
    public ProjectNotFoundException(Long projectId) {
        // Calls the parent class constructor with a formatted error message
        super(String.format("Project with ID %d not found", projectId));
    }

    /**
     * Constructor that takes a custom error message.
     *
     * @param message The specific error message to be displayed
     */
    public ProjectNotFoundException(String message) {
        // Calls the parent class constructor with the provided message
        super(message);
    }

    /**
     * Constructor that takes both a message and the original cause of the exception.
     *
     * @param message The specific error message to be displayed
     * @param cause The original exception that caused this exception
     */
    public ProjectNotFoundException(String message, Throwable cause) {
        // Calls the parent class constructor with both message and cause
        super(message, cause);
    }
}