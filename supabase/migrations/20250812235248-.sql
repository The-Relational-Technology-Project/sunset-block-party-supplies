-- First, update existing 'vouched' status records to 'approved'
UPDATE join_requests SET status = 'approved' WHERE status = 'vouched';

-- Add the new 'approved' value to the enum
ALTER TYPE join_request_status ADD VALUE 'approved';

-- Update the table to temporarily allow both values
-- (the old enum values will remain until we clean them up)

-- Remove the old 'vouched' value by creating a new enum and switching to it
CREATE TYPE join_request_status_new AS ENUM ('pending', 'approved', 'rejected');

-- Update the table to use the new enum
ALTER TABLE join_requests 
ALTER COLUMN status TYPE join_request_status_new USING status::text::join_request_status_new;

-- Drop the old enum and rename the new one
DROP TYPE join_request_status;
ALTER TYPE join_request_status_new RENAME TO join_request_status;