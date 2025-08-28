-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Add role to profiles table
ALTER TABLE public.profiles ADD COLUMN role public.app_role DEFAULT 'user';

-- Create feedback table
CREATE TABLE public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('analysis_accuracy', 'chatbot_usefulness', 'feature_request', 'bug_report', 'general')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  submission_id UUID REFERENCES public.url_submissions(id) ON DELETE SET NULL,
  page_url TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on feedback table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create feedback policies
CREATE POLICY "Users can create feedback" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can view their own feedback" ON public.feedback
  FOR SELECT USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Admins can view all feedback" ON public.feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update feedback" ON public.feedback
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create data deletion requests table
CREATE TABLE public.data_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  request_reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  admin_notes TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on data deletion requests
ALTER TABLE public.data_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Create data deletion policies
CREATE POLICY "Users can create their own deletion requests" ON public.data_deletion_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own deletion requests" ON public.data_deletion_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all deletion requests" ON public.data_deletion_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create audit logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create audit log policies
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create AI metrics table for tracking AI performance
CREATE TABLE public.ai_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on AI metrics
ALTER TABLE public.ai_metrics ENABLE ROW LEVEL SECURITY;

-- Create AI metrics policy
CREATE POLICY "AI metrics are viewable by everyone" ON public.ai_metrics
  FOR SELECT USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample AI metrics data
INSERT INTO public.ai_metrics (metric_type, metric_name, metric_value, metadata) VALUES
('detection_accuracy', 'phishing_detection', 94.7, '{"model": "enhanced_nlp_v2", "dataset": "phishing_sites_2024"}'),
('detection_accuracy', 'malware_classification', 91.2, '{"model": "malware_detector_v3", "dataset": "malware_samples_2024"}'),
('detection_accuracy', 'brand_impersonation', 88.9, '{"model": "computer_vision_v1", "dataset": "brand_logos_2024"}'),
('detection_accuracy', 'app_store_fraud', 92.4, '{"model": "app_analyzer_v2", "dataset": "mobile_apps_2024"}'),
('performance_metric', 'urls_analyzed_today', 1247, '{"date": "2025-01-15"}'),
('performance_metric', 'threats_detected_today', 89, '{"date": "2025-01-15"}'),
('performance_metric', 'processing_time_avg_ms', 850, '{"date": "2025-01-15"}'),
('detection_rate', 'realtime_monitoring', 97.3, '{"active_monitors": 15, "alerts_generated": 45}');

-- Set admin role for the admin user (will be created via auth)
-- Note: This will be executed after admin user is created