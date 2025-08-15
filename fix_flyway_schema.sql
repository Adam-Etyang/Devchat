-- Fix Flyway schema history by removing the problematic migration record
-- This will allow the application to start with the new V7 migration

DELETE FROM FLYWAY_SCHEMA_HISTORY
WHERE
    VERSION = '6';