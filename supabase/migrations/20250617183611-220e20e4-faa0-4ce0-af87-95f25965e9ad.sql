
-- Fix missing tables and columns causing console errors

-- Create missing anubis_creeper_log table
CREATE TABLE IF NOT EXISTS public.anubis_creeper_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name TEXT NOT NULL,
  source_platform TEXT NOT NULL,
  content_discovered TEXT,
  threat_level INTEGER DEFAULT 0,
  confidence_score NUMERIC DEFAULT 0,
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create missing aria_event_dispatch table
CREATE TABLE IF NOT EXISTS public.aria_event_dispatch (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  target_entity TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add missing threat_score column to synthetic_threats table if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'synthetic_threats') THEN
    -- Add threat_score column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'synthetic_threats' AND column_name = 'threat_score') THEN
      ALTER TABLE public.synthetic_threats ADD COLUMN threat_score NUMERIC DEFAULT 0;
    END IF;
  ELSE
    -- Create synthetic_threats table if it doesn't exist
    CREATE TABLE public.synthetic_threats (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      entity_name TEXT NOT NULL,
      threat_content TEXT NOT NULL,
      threat_score NUMERIC DEFAULT 0,
      confidence_score NUMERIC DEFAULT 0,
      source_platform TEXT,
      detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      is_verified BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
    );
  END IF;
END $$;

-- Add RLS policies for the new tables
ALTER TABLE public.anubis_creeper_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aria_event_dispatch ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for anubis_creeper_log
CREATE POLICY "Admin users can manage anubis creeper log" ON public.anubis_creeper_log
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for aria_event_dispatch
CREATE POLICY "Admin users can manage aria event dispatch" ON public.aria_event_dispatch
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Add RLS policies for synthetic_threats if not already present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'synthetic_threats') THEN
    -- Enable RLS if not already enabled
    EXECUTE 'ALTER TABLE public.synthetic_threats ENABLE ROW LEVEL SECURITY';
    
    -- Create policy if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'synthetic_threats' 
      AND policyname = 'Admin users can manage synthetic threats'
    ) THEN
      CREATE POLICY "Admin users can manage synthetic threats" ON public.synthetic_threats
        FOR ALL USING (
          EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
          )
        );
    END IF;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_anubis_creeper_log_entity ON public.anubis_creeper_log(entity_name);
CREATE INDEX IF NOT EXISTS idx_anubis_creeper_log_discovered ON public.anubis_creeper_log(discovered_at);
CREATE INDEX IF NOT EXISTS idx_aria_event_dispatch_type ON public.aria_event_dispatch(event_type);
CREATE INDEX IF NOT EXISTS idx_aria_event_dispatch_status ON public.aria_event_dispatch(status);
