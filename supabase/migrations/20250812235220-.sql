-- Update join_requests status enum to replace 'vouched' with 'approved'
ALTER TABLE join_requests 
DROP CONSTRAINT IF EXISTS join_requests_status_check;

ALTER TABLE join_requests 
ADD CONSTRAINT join_requests_status_check 
CHECK (status IN ('pending', 'approved', 'rejected'));