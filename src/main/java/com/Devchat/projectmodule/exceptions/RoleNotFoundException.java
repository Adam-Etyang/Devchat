package com.Devchat.projectmodule.exceptions;

/**
 * Exception thrown when a requested role cannot be found.
 */
public class RoleNotFoundException extends RuntimeException {

    /**
     * Constructor with role ID.
     *
     * @param id The ID of the role that was not found
     */
    public RoleNotFoundException(Long id) {
        super("Role with ID " + id + " not found");
    }

    /**
     * Constructor with custom message.
     *
     * @param message The error message
     */
    public RoleNotFoundException(String message) {
        super(message);
    }
}