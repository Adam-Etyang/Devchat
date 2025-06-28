package com.Devchat.Controller;

import com.Devchat.Service.UpdateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;

/**
 * Controller for handling real-time updates
 * Provides endpoints for the frontend to check for updates
 */
@RestController
@RequestMapping("/api/updates")
public class UpdateController {

    private final UpdateService updateService;

    public UpdateController(UpdateService updateService) {
        this.updateService = updateService;
    }

    /**
     * Get updates since a specific timestamp
     * The timestamp should be in milliseconds since epoch
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getUpdates(@RequestParam(required = false) Long since) {
        try {
            LocalDateTime sinceDateTime;

            if (since != null) {
                // Convert milliseconds to LocalDateTime
                sinceDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(since), java.time.ZoneOffset.UTC);
            } else {
                // Default to 1 hour ago if no timestamp provided
                sinceDateTime = LocalDateTime.now().minusHours(1);
            }

            List<Map<String, Object>> updates = updateService.getUpdatesSince(sinceDateTime);
            return ResponseEntity.ok(updates);
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error getting updates: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get updates of a specific type since a timestamp
     */
    @GetMapping("/{type}")
    public ResponseEntity<List<Map<String, Object>>> getUpdatesByType(
            @PathVariable String type,
            @RequestParam(required = false) Long since) {

        LocalDateTime sinceDateTime;

        if (since != null) {
            sinceDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(since), java.time.ZoneOffset.UTC);
        } else {
            sinceDateTime = LocalDateTime.now().minusHours(1);
        }

        List<Map<String, Object>> updates = updateService.getUpdatesByTypeSince(type, sinceDateTime);
        return ResponseEntity.ok(updates);
    }

    /**
     * Get the current server timestamp
     * Useful for the frontend to synchronize with the server
     */
    @GetMapping("/timestamp")
    public ResponseEntity<Map<String, Long>> getTimestamp() {
        Map<String, Long> response = Map.of("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    /**
     * Get recent updates (for debugging/testing)
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentUpdates() {
        try {
            List<Map<String, Object>> updates = updateService.getRecentUpdates();
            return ResponseEntity.ok(updates);
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error getting recent updates: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}