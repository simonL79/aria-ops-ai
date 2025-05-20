
-- This file contains the database schema for A.R.I.A. application

-- Profiles table to store user profile information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user', 'analyst')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  action TEXT NOT NULL,
  details TEXT,
  entity_type TEXT,
  entity_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitoring status table
CREATE TABLE IF NOT EXISTS public.monitoring_status (
  id TEXT PRIMARY KEY DEFAULT '1',
  is_active BOOLEAN DEFAULT false,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  sources_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitoring sources table
CREATE TABLE IF NOT EXISTS public.monitoring_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scan results table
CREATE TABLE IF NOT EXISTS public.scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  platform TEXT NOT NULL,
  url TEXT,
  sentiment NUMERIC,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  status TEXT NOT NULL CHECK (status IN ('new', 'read', 'actioned', 'resolved')),
  threat_type TEXT,
  client_id UUID REFERENCES public.clients(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated responses table
CREATE TABLE IF NOT EXISTS public.generated_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_text TEXT NOT NULL,
  original_content_id UUID REFERENCES public.scan_results(id),
  client_id UUID REFERENCES public.clients(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report templates table
CREATE TABLE IF NOT EXISTS public.report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated reports table
CREATE TABLE IF NOT EXISTS public.generated_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client_id UUID REFERENCES public.clients(id),
  template_id UUID REFERENCES public.report_templates(id),
  report_data JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dark web monitoring alerts table
CREATE TABLE IF NOT EXISTS public.dark_web_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id),
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  details TEXT NOT NULL,
  source TEXT,
  status TEXT NOT NULL CHECK (status IN ('new', 'investigating', 'resolved', 'false_positive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Activity logs RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view all activity logs" ON public.activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view their own activity logs" ON public.activity_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Monitoring status RLS
ALTER TABLE public.monitoring_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view monitoring status" ON public.monitoring_status
  FOR SELECT USING (true);

CREATE POLICY "Only admin users can update monitoring status" ON public.monitoring_status
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Monitoring sources RLS
ALTER TABLE public.monitoring_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view monitoring sources" ON public.monitoring_sources
  FOR SELECT USING (true);

CREATE POLICY "Only admin users can manage monitoring sources" ON public.monitoring_sources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Scan results RLS
ALTER TABLE public.scan_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view scan results" ON public.scan_results
  FOR SELECT USING (true);

CREATE POLICY "Only admin users can manage scan results" ON public.scan_results
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Generated responses RLS
ALTER TABLE public.generated_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view generated responses" ON public.generated_responses
  FOR SELECT USING (true);

CREATE POLICY "All users can create generated responses" ON public.generated_responses
  FOR INSERT WITH CHECK (true);

-- Report templates RLS
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view report templates" ON public.report_templates
  FOR SELECT USING (true);

CREATE POLICY "Only admin users can manage report templates" ON public.report_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Generated reports RLS
ALTER TABLE public.generated_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view reports they created" ON public.generated_reports
  FOR SELECT USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "All users can create reports" ON public.generated_reports
  FOR INSERT WITH CHECK (true);

-- Dark web alerts RLS
ALTER TABLE public.dark_web_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All users can view dark web alerts" ON public.dark_web_alerts
  FOR SELECT USING (true);

CREATE POLICY "Only admin users can manage dark web alerts" ON public.dark_web_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Add the trigger for creating user profiles when users are created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'firstName', 
    new.raw_user_meta_data->>'lastName'
  );
  
  -- Special case for admin user
  IF new.email = 'simonlindsay7988@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Initialize default monitoring status if not exists
INSERT INTO public.monitoring_status (id, is_active, sources_count) 
VALUES ('1', false, 0)
ON CONFLICT (id) DO NOTHING;

-- Initialize default monitoring sources
INSERT INTO public.monitoring_sources (name, type, enabled)
VALUES 
  ('Twitter', 'social_media', true),
  ('Facebook', 'social_media', true),
  ('Reddit', 'social_media', true),
  ('LinkedIn', 'social_media', true),
  ('Google News', 'news', true),
  ('Blogs', 'blog', true),
  ('Review Sites', 'review', true),
  ('Forums', 'forum', true)
ON CONFLICT DO NOTHING;

-- Initialize default report templates
INSERT INTO public.report_templates (name, description, template_data)
VALUES 
  ('Monthly Reputation Report', 'Standard monthly report of all reputation metrics', 
   '{"sections": ["overview", "metrics", "threats", "recommendations"], "timeframe": "month"}'::jsonb),
  ('Weekly Brief', 'Short weekly summary of key reputation indicators', 
   '{"sections": ["highlights", "threats"], "timeframe": "week"}'::jsonb),
  ('Crisis Report', 'Comprehensive analysis of reputation during crisis events', 
   '{"sections": ["crisis_overview", "impact_analysis", "response_strategy", "recommendations"], "timeframe": "custom"}'::jsonb)
ON CONFLICT DO NOTHING;
