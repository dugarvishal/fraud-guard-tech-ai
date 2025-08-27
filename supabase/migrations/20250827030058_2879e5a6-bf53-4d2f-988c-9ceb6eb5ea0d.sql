-- Enhanced database schema for comprehensive fraud detection

-- Add WHOIS data table
CREATE TABLE public.whois_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL UNIQUE,
  registrar TEXT,
  creation_date TIMESTAMP WITH TIME ZONE,
  expiration_date TIMESTAMP WITH TIME ZONE,
  updated_date TIMESTAMP WITH TIME ZONE,
  name_servers TEXT[],
  registrant_name TEXT,
  registrant_org TEXT,
  registrant_country TEXT,
  admin_contact TEXT,
  tech_contact TEXT,
  status TEXT[],
  privacy_protection BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add DNS records table
CREATE TABLE public.dns_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL,
  record_type TEXT NOT NULL,
  record_value TEXT NOT NULL,
  ttl INTEGER,
  ip_reputation_score INTEGER,
  mx_records TEXT[],
  txt_records TEXT[],
  subdomain_count INTEGER DEFAULT 0,
  suspicious_subdomains TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add screenshots table for computer vision analysis
CREATE TABLE public.screenshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID,
  url TEXT NOT NULL,
  screenshot_url TEXT,
  screenshot_hash TEXT,
  ui_elements JSONB,
  brand_similarities JSONB,
  visual_risk_score INTEGER,
  similar_brands TEXT[],
  layout_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add app metadata table
CREATE TABLE public.app_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID,
  app_id TEXT NOT NULL,
  platform TEXT NOT NULL, -- 'android' or 'ios'
  developer_name TEXT,
  developer_id TEXT,
  app_name TEXT,
  version TEXT,
  permissions TEXT[],
  install_count TEXT,
  rating DECIMAL(2,1),
  review_count INTEGER,
  last_updated TIMESTAMP WITH TIME ZONE,
  app_size INTEGER,
  content_rating TEXT,
  privacy_policy_url TEXT,
  suspicious_permissions TEXT[],
  permission_risk_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add threat intelligence table
CREATE TABLE public.threat_intelligence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  indicator_type TEXT NOT NULL, -- 'domain', 'ip', 'hash', 'url'
  indicator_value TEXT NOT NULL,
  threat_type TEXT NOT NULL, -- 'phishing', 'malware', 'scam', 'suspicious'
  confidence_score INTEGER NOT NULL,
  source TEXT NOT NULL,
  first_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add real-time alerts table
CREATE TABLE public.real_time_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT,
  alert_type TEXT NOT NULL, -- 'warning', 'danger', 'info'
  threat_category TEXT NOT NULL,
  url TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  triggered_features TEXT[],
  explanation TEXT,
  is_acknowledged BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_whois_domain ON public.whois_data(domain);
CREATE INDEX idx_dns_domain ON public.dns_records(domain);
CREATE INDEX idx_screenshots_submission ON public.screenshots(submission_id);
CREATE INDEX idx_screenshots_hash ON public.screenshots(screenshot_hash);
CREATE INDEX idx_app_metadata_submission ON public.app_metadata(submission_id);
CREATE INDEX idx_threat_intel_indicator ON public.threat_intelligence(indicator_value);
CREATE INDEX idx_threat_intel_type ON public.threat_intelligence(threat_type);
CREATE INDEX idx_alerts_user ON public.real_time_alerts(user_id);
CREATE INDEX idx_alerts_session ON public.real_time_alerts(session_id);

-- Enable RLS on all tables
ALTER TABLE public.whois_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dns_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for whois_data (public readable, system writable)
CREATE POLICY "WHOIS data is viewable by everyone" 
ON public.whois_data 
FOR SELECT 
USING (true);

-- Create RLS policies for dns_records (public readable, system writable)
CREATE POLICY "DNS records are viewable by everyone" 
ON public.dns_records 
FOR SELECT 
USING (true);

-- Create RLS policies for screenshots (users can view their submissions)
CREATE POLICY "Users can view screenshots of their submissions" 
ON public.screenshots 
FOR SELECT 
USING (
  submission_id IN (
    SELECT id FROM public.url_submissions 
    WHERE auth.uid() = user_id OR session_id IS NOT NULL
  )
);

-- Create RLS policies for app_metadata (users can view their submissions)
CREATE POLICY "Users can view app metadata of their submissions" 
ON public.app_metadata 
FOR SELECT 
USING (
  submission_id IN (
    SELECT id FROM public.url_submissions 
    WHERE auth.uid() = user_id OR session_id IS NOT NULL
  )
);

-- Create RLS policies for threat_intelligence (public readable for active threats)
CREATE POLICY "Active threat intelligence is viewable by everyone" 
ON public.threat_intelligence 
FOR SELECT 
USING (is_active = true);

-- Create RLS policies for real_time_alerts (users can view their own alerts)
CREATE POLICY "Users can view their own alerts" 
ON public.real_time_alerts 
FOR SELECT 
USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can create alerts" 
ON public.real_time_alerts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Users can update their own alerts" 
ON public.real_time_alerts 
FOR UPDATE 
USING (auth.uid() = user_id OR session_id IS NOT NULL);

-- Create triggers for updated_at columns
CREATE TRIGGER update_whois_data_updated_at
BEFORE UPDATE ON public.whois_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dns_records_updated_at
BEFORE UPDATE ON public.dns_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();