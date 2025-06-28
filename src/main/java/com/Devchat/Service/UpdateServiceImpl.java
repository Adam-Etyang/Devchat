package com.Devchat.Service;

import com.Devchat.entity.Update;
import com.Devchat.repository.UpdateRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
@Transactional
public class UpdateServiceImpl implements UpdateService {

    private final UpdateRepository updateRepository;
    private final ObjectMapper objectMapper;

    public UpdateServiceImpl(UpdateRepository updateRepository, ObjectMapper objectMapper) {
        this.updateRepository = updateRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public void recordUpdate(String type, String action, Long entityId, String entityName) {
        recordUpdate(type, action, entityId, entityName, null);
    }

    @Override
    public void recordUpdate(String type, String action, Long entityId, String entityName, String additionalData) {
        try {
            Update update = new Update(type, action, entityId, entityName);
            if (additionalData != null) {
                update.setAdditionalData(additionalData);
            }
            updateRepository.save(update);
        } catch (Exception e) {
            // Log the error but don't throw it - this prevents breaking the main
            // application flow
            System.err.println("Error recording update: " + e.getMessage());
            // Don't rethrow the exception - just log it
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getUpdatesSince(LocalDateTime since) {
        try {
            List<Update> updates = updateRepository.findUpdatesSince(since);
            return convertToMapList(updates);
        } catch (Exception e) {
            // If the table doesn't exist yet, return empty list
            System.err.println("Error getting updates since " + since + ": " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getUpdatesByTypeSince(String type, LocalDateTime since) {
        try {
            List<Update> updates = updateRepository.findUpdatesByTypeSince(type, since);
            return convertToMapList(updates);
        } catch (Exception e) {
            // If the table doesn't exist yet, return empty list
            System.err.println("Error getting updates by type " + type + " since " + since + ": " + e.getMessage());
            return new ArrayList<>();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getRecentUpdates() {
        try {
            List<Update> updates = updateRepository.findTop10ByOrderByCreatedAtDesc();
            return convertToMapList(updates);
        } catch (Exception e) {
            // If the table doesn't exist yet, return empty list
            System.err.println("Error getting recent updates: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    private List<Map<String, Object>> convertToMapList(List<Update> updates) {
        return updates.stream()
                .map(this::convertToMap)
                .collect(Collectors.toList());
    }

    private Map<String, Object> convertToMap(Update update) {
        Map<String, Object> map = new HashMap<>();
        map.put("type", update.getType());
        map.put("action", update.getAction());
        map.put("entityId", update.getEntityId());
        map.put("entityName", update.getEntityName());
        map.put("timestamp", update.getCreatedAt().toEpochSecond(ZoneOffset.UTC) * 1000); // Convert to milliseconds
        map.put("createdAt", update.getCreatedAt().toString());

        if (update.getAdditionalData() != null) {
            try {
                // Try to parse additional data as JSON
                Object data = objectMapper.readValue(update.getAdditionalData(), Object.class);
                map.put("data", data);
            } catch (Exception e) {
                // If parsing fails, just include the raw string
                map.put("data", update.getAdditionalData());
            }
        }

        return map;
    }
}