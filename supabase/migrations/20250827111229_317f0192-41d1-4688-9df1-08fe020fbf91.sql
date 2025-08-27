-- Add batch_id to url_submissions to link individual submissions to their batch
ALTER TABLE public.url_submissions 
ADD COLUMN batch_id uuid REFERENCES public.batch_submissions(id);

-- Update RLS policies to handle batch-related queries
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.url_submissions;

CREATE POLICY "Users can view their own submissions" 
ON public.url_submissions 
FOR SELECT 
USING (
  (auth.uid() = user_id) OR 
  (session_id IS NOT NULL) OR 
  (batch_id IN (
    SELECT id FROM public.batch_submissions 
    WHERE (auth.uid() = user_id) OR (session_id IS NOT NULL)
  ))
);

-- Update batch_submissions policies to allow updates for progress tracking
DROP POLICY IF EXISTS "Users can view their own batch submissions" ON public.batch_submissions;

CREATE POLICY "Users can view their own batch submissions" 
ON public.batch_submissions 
FOR SELECT 
USING ((auth.uid() = user_id) OR (session_id IS NOT NULL));

CREATE POLICY "Users can update their own batch submissions" 
ON public.batch_submissions 
FOR UPDATE 
USING ((auth.uid() = user_id) OR (session_id IS NOT NULL));