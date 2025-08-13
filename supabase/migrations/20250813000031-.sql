-- Simplify the enum to just have the essential statuses
-- Drop the old enum and create a simple one
DROP TYPE join_request_status;
CREATE TYPE join_request_status AS ENUM ('pending', 'rejected');

-- Update the table to use the new enum, converting vouched to pending
-- since the user wants these people to just sign up again
ALTER TABLE join_requests 
ALTER COLUMN status DROP DEFAULT,
ALTER COLUMN status TYPE join_request_status USING 
  CASE 
    WHEN status::text = 'vouched' THEN 'pending'::join_request_status
    WHEN status::text = 'rejected' THEN 'rejected'::join_request_status
    ELSE 'pending'::join_request_status
  END,
ALTER COLUMN status SET DEFAULT 'pending'::join_request_status;