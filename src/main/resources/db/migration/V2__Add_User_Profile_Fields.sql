-- Add profile fields to app_users table
ALTER TABLE APP_USERS
    ADD COLUMN PHONE VARCHAR(
        20
    ), ADD COLUMN BIO TEXT, ADD COLUMN LOCATION VARCHAR(
        100
    );