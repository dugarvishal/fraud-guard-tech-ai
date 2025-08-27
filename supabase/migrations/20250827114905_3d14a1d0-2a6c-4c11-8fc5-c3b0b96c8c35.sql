-- Remove processing batch submissions that are stuck
UPDATE batch_submissions 
SET status = 'failed' 
WHERE status = 'processing' 
AND created_at < (NOW() - INTERVAL '1 hour');