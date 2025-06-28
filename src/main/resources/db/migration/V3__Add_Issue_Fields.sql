-- Add missing fields to issues table
ALTER TABLE issues 
ADD COLUMN type VARCHAR(20) NOT NULL DEFAULT 'TASK',
ADD COLUMN created_by_id BIGINT NOT NULL DEFAULT 1;

-- Add foreign key constraint for created_by_id
ALTER TABLE issues 
ADD CONSTRAINT fk_issues_created_by 
FOREIGN KEY (created_by_id) REFERENCES app_users(id);

-- Update existing records to have proper values
UPDATE issues SET 
    type = 'TASK',
    created_by_id = 1
WHERE type IS NULL OR created_by_id IS NULL;