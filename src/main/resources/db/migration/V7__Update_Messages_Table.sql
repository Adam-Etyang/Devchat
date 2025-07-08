-- Update messages table to use user IDs instead of string sender/receiver
-- First, add the new columns
--ALTER TABLE MESSAGES
    --ADD COLUMN SENDER_ID BIGINT;

--ALTER TABLE MESSAGES
    --ADD COLUMN RECEIVER_ID BIGINT;

-- Add foreign key constraints
--ALTER TABLE MESSAGES
    --ADD CONSTRAINT FK_MESSAGES_SENDER FOREIGN KEY (
        --SENDER_ID
    --)
        --REFERENCES APP_USERS(
            --ID
        --);

--ALTER TABLE MESSAGES
    --ADD CONSTRAINT FK_MESSAGES_RECEIVER FOREIGN KEY (
        --RECEIVER_ID
    --)
        --REFERENCES APP_USERS(
            --  ID
        --);

-- Handle existing data by setting default values or cleaning up
-- For now, we'll delete any existing messages since they won't have proper user associations
--DELETE FROM MESSAGES
--WHERE
    --SENDER_ID IS NULL
    --OR RECEIVER_ID IS NULL;

-- Make the new columns NOT NULL after data migration
--ALTER TABLE MESSAGES ALTER COLUMN SENDER_ID SET NOT NULL;

--ALTER TABLE MESSAGES ALTER COLUMN RECEIVER_ID SET NOT NULL;

-- Drop the old string columns
--ALTER TABLE MESSAGES DROP COLUMN SENDER;

--ALTER TABLE MESSAGES DROP COLUMN RECEIVER;