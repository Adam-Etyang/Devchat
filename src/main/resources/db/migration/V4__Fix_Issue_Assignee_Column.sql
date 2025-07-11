-- Make assignee_id nullable
--ALTER TABLE ISSUES ALTER COLUMN ASSIGNEE_ID DROP NOT NULL;

-- Add foreign key constraint (will fail if already exists, which is fine for idempotency)
--DO $$
--BEGIN
--    ALTER TABLE ISSUES
--        --ADD CONSTRAINT FK_ISSUES_ASSIGNEE FOREIGN KEY (ASSIGNEE_ID) REFERENCES APP_USERS(ID);
--EXCEPTION
--    WHEN duplicate_object THEN
--        -- do nothing, constraint already exists
--END
--$$;
