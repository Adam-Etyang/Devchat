package com.Devchat.projectmodule.constants;

/**
 * Constants class for project-related values and configurations.
 * This class contains all the constant values used throughout the project module.
 */
public final class ProjectConstants {
    // Private constructor to prevent instantiation
    private ProjectConstants() {
        throw new AssertionError("Utility class - do not instantiate");
    }

    /**
     * Constants related to project names
     */
    public static final class Name {
        // Private constructor to prevent instantiation
        private Name() {
            throw new AssertionError("Utility class - do not instantiate");
        }

        // Minimum length for project names
        public static final int MIN_LENGTH = 3;

        // Maximum length for project names
        public static final int MAX_LENGTH = 100;

        // Regular expression for valid project names
        public static final String VALID_PATTERN = "^[a-zA-Z0-9\\s-_]+$";
    }

    /**
     * Constants related to project descriptions
     */
    public static final class Description {
        // Private constructor to prevent instantiation
        private Description() {
            throw new AssertionError("Utility class - do not instantiate");
        }

        // Maximum length for project descriptions
        public static final int MAX_LENGTH = 1000;
    }

    /**
     * Constants related to project dates
     */
    public static final class Date {
        // Private constructor to prevent instantiation
        private Date() {
            throw new AssertionError("Utility class - do not instantiate");
        }

        // Date format for project dates
        public static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

        // Time zone for project dates
        public static final String TIME_ZONE = "UTC";
    }

    /**
     * Constants related to project pagination
     */
    public static final class Pagination {
        // Private constructor to prevent instantiation
        private Pagination() {
            throw new AssertionError("Utility class - do not instantiate");
        }

        // Default page size for project listings
        public static final int DEFAULT_PAGE_SIZE = 10;

        // Maximum page size for project listings
        public static final int MAX_PAGE_SIZE = 100;

        // Default page number
        public static final int DEFAULT_PAGE_NUMBER = 0;
    }

    /**
     * Constants related to project validation messages
     */
    public static final class Validation {
        // Private constructor to prevent instantiation
        private Validation() {
            throw new AssertionError("Utility class - do not instantiate");
        }

        // Error message for invalid project name length
        public static final String INVALID_NAME_LENGTH =
                "Project name must be between " + Name.MIN_LENGTH +
                        " and " + Name.MAX_LENGTH + " characters";

        // Error message for invalid project name pattern
        public static final String INVALID_NAME_PATTERN =
                "Project name can only contain letters, numbers, spaces, hyphens, and underscores";

        // Error message for invalid description length
        public static final String INVALID_DESCRIPTION_LENGTH =
                "Project description cannot exceed " + Description.MAX_LENGTH + " characters";

        // Error message for invalid date range
        public static final String INVALID_DATE_RANGE =
                "Project end date must be after start date";
    }
}