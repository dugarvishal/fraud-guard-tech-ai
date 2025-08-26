-- Create educational content categories
CREATE TABLE public.educational_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create educational content table
CREATE TABLE public.educational_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL,
  category_id UUID REFERENCES public.educational_categories(id),
  content_type TEXT NOT NULL DEFAULT 'article', -- article, tutorial, checklist, quiz
  difficulty_level TEXT NOT NULL DEFAULT 'beginner', -- beginner, intermediate, advanced
  estimated_reading_time INTEGER, -- in minutes
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user progress tracking table
CREATE TABLE public.user_educational_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content_id UUID REFERENCES public.educational_content(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started', -- not_started, in_progress, completed
  progress_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Create chatbot knowledge base table
CREATE TABLE public.chatbot_knowledge (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  intent TEXT NOT NULL,
  category TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  confidence_threshold DECIMAL DEFAULT 0.7,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.educational_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_educational_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chatbot_knowledge ENABLE ROW LEVEL SECURITY;

-- RLS Policies for educational content (public read access)
CREATE POLICY "Educational categories are viewable by everyone" 
ON public.educational_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Educational content is viewable by everyone" 
ON public.educational_content 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Chatbot knowledge is viewable by everyone" 
ON public.chatbot_knowledge 
FOR SELECT 
USING (true);

-- RLS Policies for user progress (user-specific)
CREATE POLICY "Users can view their own progress" 
ON public.user_educational_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
ON public.user_educational_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.user_educational_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Insert educational categories
INSERT INTO public.educational_categories (name, description, icon, color) VALUES
('Phishing Detection', 'Learn to identify and avoid phishing attacks', 'Shield', 'hsl(0, 84%, 60%)'),
('Fake Apps', 'Recognize malicious apps and protect your devices', 'Smartphone', 'hsl(25, 95%, 53%)'),
('Social Engineering', 'Understand psychological manipulation tactics', 'Users', 'hsl(48, 96%, 53%)'),
('Financial Fraud', 'Protect your money from online scams', 'CreditCard', 'hsl(142, 71%, 45%)'),
('Privacy & Security', 'Essential security practices for everyone', 'Lock', 'hsl(221, 83%, 53%)'),
('Data Protection', 'Keep your personal information safe', 'Database', 'hsl(262, 83%, 58%)');

-- Insert sample educational content
INSERT INTO public.educational_content (title, slug, content, category_id, content_type, difficulty_level, estimated_reading_time, tags) 
SELECT 
  'How to Spot Phishing Emails',
  'spot-phishing-emails',
  '{"sections": [{"title": "Introduction", "content": "Phishing emails are one of the most common cyber threats. Learn the warning signs."}, {"title": "Red Flags", "content": "Look for urgent language, suspicious links, and requests for personal information."}, {"title": "Best Practices", "content": "Always verify sender identity and hover over links before clicking."}], "checklist": ["Check sender email address", "Look for spelling errors", "Verify with sender through different channel", "Never click suspicious links"], "quiz": [{"question": "What should you do if you receive a suspicious email?", "options": ["Click the link to verify", "Delete immediately", "Report as spam", "Forward to friends"], "correct": 2}]}',
  id,
  'article',
  'beginner',
  5,
  ARRAY['email', 'phishing', 'security']
FROM public.educational_categories WHERE name = 'Phishing Detection';

-- Insert chatbot knowledge base
INSERT INTO public.chatbot_knowledge (question, answer, intent, category, keywords) VALUES
('How do I use this fraud detection tool?', 'To use our fraud detection tool, simply paste a URL or upload a file on the Submit page. Our AI will analyze it for potential threats and provide a detailed security report.', 'how_to_use', 'site_help', ARRAY['how', 'use', 'tool', 'submit']),
('What does a risk score mean?', 'Risk scores range from 0-100: 0-30 (Low Risk/Legit), 31-70 (Medium Risk/Suspicious), 71-100 (High Risk/Fraudulent). Higher scores indicate more potential threats detected.', 'risk_score', 'analysis_help', ARRAY['risk', 'score', 'meaning']),
('How can I protect myself from phishing?', 'Key protection steps: 1) Always verify sender identity, 2) Check URLs carefully before clicking, 3) Look for spelling/grammar errors, 4) Never share personal info via email, 5) Use two-factor authentication.', 'phishing_protection', 'education', ARRAY['phishing', 'protection', 'email', 'safety']),
('What should I do if I find a fraudulent website?', 'If you discover a fraudulent website: 1) Do not enter personal information, 2) Report it to authorities, 3) Warn others, 4) Run our analysis tool to get detailed threat information.', 'found_fraud', 'fraud_response', ARRAY['fraudulent', 'website', 'found', 'report']),
('How accurate is your AI analysis?', 'Our AI analysis combines multiple detection methods with high accuracy. However, always use your judgment and verify suspicious sites through multiple sources. No automated tool is 100% perfect.', 'accuracy', 'analysis_help', ARRAY['accuracy', 'ai', 'analysis', 'reliable']);

-- Create trigger for updating timestamps
CREATE TRIGGER update_educational_content_updated_at
BEFORE UPDATE ON public.educational_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON public.user_educational_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();