package com.Devchat.projectmodule.exceptions;

/**
 * Custom exception class for handling cases where project data is invalid or doesn't meet requirements.
 * This exception is thrown when attempting to create or update a project with invalid data.
 */
public class InvalidProjectDataException extends RuntimeException {

    /**
     * Constructor that takes a specific error message about what data is invalid.
     *
     * @param message The specific error message describing the invalid data
     */
    public InvalidProjectDataException(String message) {
        // Calls the parent class constructor with the provided message
        super(message);
    }

    /**
     * Constructor that takes both a message and the original cause of the exception.
     *
     * @param message The specific error message describing the invalid data
     * @param cause The original exception that caused this exception
     */
    public InvalidProjectDataException(String message, Throwable cause) {
        // Calls the parent class constructor with both message and cause
        super(message, cause);
    }

    /**
     * Constructor that takes a field name and a reason for its invalidity.
     *
     * @param fieldName The name of the field that contains invalid data
     * @param reason The reason why the data is invalid
     */
    public InvalidProjectDataException(String fieldName, String reason) {
        // Calls the parent class constructor with a formatted error message
        super(String.format("Invalid data for field '%s': %s", fieldName, reason));
    }
}