-- Add threat category classification and explainability fields to url_submissions table
ALTER TABLE public.url_submissions 
ADD COLUMN threat_category TEXT,
ADD COLUMN primary_detection_reason TEXT,
ADD COLUMN supporting_evidence JSONB DEFAULT '{}',
ADD COLUMN classification_confidence DECIMAL(3,2) DEFAULT 0.0,
ADD COLUMN threat_subcategory TEXT;

-- Create index for threat category queries
CREATE INDEX idx_url_submissions_threat_category ON public.url_submissions(threat_category);
CREATE INDEX idx_url_submissions_classification_confidence ON public.url_submissions(classification_confidence);

-- Add threat categories for real_time_alerts table
ALTER TABLE public.real_time_alerts 
ADD COLUMN threat_subcategory TEXT,
ADD COLUMN detection_method TEXT,
ADD COLUMN evidence_details JSONB DEFAULT '{}';

-- Create threat categories lookup for consistency
CREATE TABLE public.threat_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT NOT NULL UNIQUE,
  description TEXT,
  severity_level TEXT NOT NULL DEFAULT 'medium',
  icon_name TEXT,
  color_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on threat_categories
ALTER TABLE public.threat_categories ENABLE ROW LEVEL SECURITY;

-- Create policy for threat categories (public read)
CREATE POLICY "Threat categories are viewable by everyone" 
ON public.threat_categories 
FOR SELECT 
USING (true);

-- Insert default threat categories
INSERT INTO public.threat_categories (category_name, description, severity_level, icon_name, color_code) VALUES
('Fake Website', 'Fraudulent sites impersonating legitimate businesses', 'high', 'Globe', '#EF4444'),
('Scam Mobile App', 'Malicious apps with hidden agendas or deceptive practices', 'high', 'Smartphone', '#EF4444'),
('Phishing Domain', 'Sites designed to steal credentials or personal information', 'critical', 'Fish', '#DC2626'),
('Malware-laden', 'Content or sites distributing malicious software', 'critical', 'Bug', '#DC2626'),
('App/Website Clone', 'Impersonations of popular brands or services', 'high', 'Copy', '#EF4444'),
('UI Similarity', 'Visual mimicry of trusted interfaces to deceive users', 'medium', 'Eye', '#F59E0B'),
('Suspicious Language', 'Content using social engineering tactics', 'medium', 'MessageSquare', '#F59E0B'),
('Safe Content', 'No significant threats detected', 'low', 'Shield', '#10B981');

-- Add function to update classification timestamp
CREATE OR REPLACE FUNCTION public.update_classification_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates on classification changes
CREATE TRIGGER update_url_submissions_classification
BEFORE UPDATE OF threat_category, classification_confidence ON public.url_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_classification_timestamp();