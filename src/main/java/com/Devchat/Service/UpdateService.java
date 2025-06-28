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
     * Get all updates since a specific timestamp
     */
    List<Map<String, Object>> getUpdatesSince(LocalDateTime since);

    /**
     * Get updates of a specific type since a timestamp
     */
    List<Map<String, Object>> getUpdatesByTypeSince(String type, LocalDateTime since);

    /**
     * Get recent updates (for debugging/testing)
     */
    List<Map<String, Object>> getRecentUpdates();
}