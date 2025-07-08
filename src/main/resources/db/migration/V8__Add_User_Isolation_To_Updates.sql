-- Add user isolation to system_updates table
-- Add userId column to track which user owns each update

-- Add userId column (nullable initially to handle existing data)
-- ALTER TABLE SYSTEM_UPDATES
    --ADD COLUMN USER_ID BIGINT;

-- Get the first user ID and update existing records
--UPDATE SYSTEM_UPDATES
--SET
    --USER_ID = (
        --SELECT
            --ID
        --FROM
            --APP_USERS LIMIT 1
    --)
--WHERE
    --USER_ID IS NULL;

-- Delete any records that couldn't be updated (no users exist)
--DELETE FROM SYSTEM_UPDATES
--WHERE
    --USER_ID IS NULL;

-- Make userId column non-nullable
--ALTER TABLE SYSTEM_UPDATES ALTER COLUMN USER_ID SET NOT NULL;

-- Add foreign key constraint to users table
--ALTER TABLE SYSTEM_UPDATES
    --ADD CONSTRAINT FK_SYSTEM_UPDATES_USER_ID FOREIGN KEY (
        --USER_ID
    --)
        --REFERENCES APP_USERS(
            --ID
        --) ON DELETE CASCADE;

-- Add indexes for better performance on user-based queries
--CREATE INDEX IDX_SYSTEM_UPDATES_USER_ID ON SYSTEM_UPDATES(USER_ID);

--CREATE INDEX IDX_SYSTEM_UPDATES_USER_CREATED ON SYSTEM_UPDATES(USER_ID, CREATED_AT);