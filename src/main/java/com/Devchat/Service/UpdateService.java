package com.Devchat.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface UpdateService {

    /**
     * Record a new update in the system
     */
    void recordUpdate(String type, String action, Long entityId, String entityName);

    /**
     * Record a new update with additional data
     */
    void recordUpdate(String type, String action, Long entityId, String entityName, String additionalData);

    /**
     * Record a new update with user ID
     */
    void recordUpdate(String type, String action, Long entityId, String entityName, Long userId);

    /**
     * Record a new update with additional data and user ID
     */
    void recordUpdate(String type, String action, Long entityId, String entityName, String additionalData, Long userId);

    /**
     * Get all updates since a specific timestamp for the current user
     */
    List<Map<String, Object>> getUpdatesSince(LocalDateTime since);

    /**
     * Get updates of a specific type since a timestamp for the current user
     */
    List<Map<String, Object>> getUpdatesByTypeSince(String type, LocalDateTime since);

    /**
     * Get recent updates for the current user (for debugging/testing)
     */
    List<Map<String, Object>> getRecentUpdates();
}