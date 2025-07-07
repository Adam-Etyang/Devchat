package com.Devchat.util;

import com.Devchat.entity.User;
import org.springframework.stereotype.Component;

/**
 * Utility class to manage the current authenticated user context.
 * Uses ThreadLocal to ensure thread safety in a multi-threaded environment.
 */
@Component
public class UserContext {

    private static final ThreadLocal<User> currentUser = new ThreadLocal<>();

    /**
     * Set the current authenticated user for this thread.
     * 
     * @param user The authenticated user
     */
    public static void setCurrentUser(User user) {
        currentUser.set(user);
    }

    /**
     * Get the current authenticated user for this thread.
     * 
     * @return The current user, or null if not set
     */
    public static User getCurrentUser() {
        return currentUser.get();
    }

    /**
     * Get the current user's ID.
     * 
     * @return The current user's ID, or null if no user is set
     */
    public static Long getCurrentUserId() {
        User user = getCurrentUser();
        return user != null ? user.getId() : null;
    }

    /**
     * Check if a user is currently authenticated.
     * 
     * @return true if a user is set, false otherwise
     */
    public static boolean isAuthenticated() {
        return getCurrentUser() != null;
    }

    /**
     * Clear the current user context for this thread.
     * Should be called when the thread is done processing the request.
     */
    public static void clear() {
        currentUser.remove();
    }

    /**
     * Require authentication and return the current user.
     * 
     * @return The current authenticated user
     * @throws IllegalStateException if no user is authenticated
     */
    public static User requireCurrentUser() {
        User user = getCurrentUser();
        if (user == null) {
            throw new IllegalStateException("No authenticated user found");
        }
        return user;
    }

    /**
     * Require authentication and return the current user's ID.
     * 
     * @return The current authenticated user's ID
     * @throws IllegalStateException if no user is authenticated
     */
    public static Long requireCurrentUserId() {
        User user = requireCurrentUser();
        return user.getId();
    }
}