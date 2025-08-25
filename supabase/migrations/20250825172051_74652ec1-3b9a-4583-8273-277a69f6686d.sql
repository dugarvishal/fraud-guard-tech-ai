-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create URL submissions table for all submissions (anonymous + authenticated)
CREATE TABLE public.url_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT,
  url TEXT NOT NULL,
  submission_type TEXT NOT NULL DEFAULT 'url',
  app_store_link TEXT,
  file_name TEXT,
  file_size INTEGER,
  analysis_status TEXT NOT NULL DEFAULT 'pending',
  risk_score INTEGER,
  risk_level TEXT,
  analysis_results JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on submissions
ALTER TABLE public.url_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for submissions
CREATE POLICY "Users can view their own submissions" 
ON public.url_submissions 
FOR SELECT 
USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Anyone can create submissions" 
ON public.url_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own submissions" 
ON public.url_submissions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create batch submissions table
CREATE TABLE public.batch_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT,
  file_name TEXT NOT NULL,
  total_urls INTEGER NOT NULL DEFAULT 0,
  processed_urls INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on batch submissions
ALTER TABLE public.batch_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for batch submissions
CREATE POLICY "Users can view their own batch submissions" 
ON public.batch_submissions 
FOR SELECT 
USING (auth.uid() = user_id OR session_id IS NOT NULL);

CREATE POLICY "Anyone can create batch submissions" 
ON public.batch_submissions 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_url_submissions_updated_at
BEFORE UPDATE ON public.url_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_batch_submissions_updated_at
BEFORE UPDATE ON public.batch_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();