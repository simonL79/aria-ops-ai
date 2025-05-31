
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SigmaResult {
  id: string;
  entity_name: string;
  platform: string;
  content: string;
  url?: string;
  sentiment: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  confidence_score: number;
  detected_entities: string[];
  source_type: string;
  created_at: string;
}

export interface ThreatProfile {
  id: string;
  entity_name: string;
  threat_level: 'low' | 'moderate' | 'high' | 'critical';
  risk_score: number;
  signature_match?: string;
  match_confidence?: number;
  primary_platforms: string[];
  total_mentions: number;
  negative_sentiment_score: number;
  related_entities: string[];
  fix_plan?: string;
  created_at: string;
}

export interface FixPath {
  id: string;
  entity_name: string;
  threat_level: string;
  steps: any;
  created_at: string;
}

export const useSigmaData = () => {
  const [sigmaResults, setSigmaResults] = useState<SigmaResult[]>([]);
  const [threatProfiles, setThreatProfiles] = useState<ThreatProfile[]>([]);
  const [fixPaths, setFixPaths] = useState<FixPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSigmaResults = async () => {
    try {
      const { data, error } = await supabase
        .from('sigma_scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSigmaResults(data || []);
    } catch (err) {
      console.error('Error fetching SIGMA results:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch SIGMA results');
    }
  };

  const fetchThreatProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('threat_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setThreatProfiles(data || []);
    } catch (err) {
      console.error('Error fetching threat profiles:', err);
    }
  };

  const fetchFixPaths = async () => {
    try {
      const { data, error } = await supabase
        .from('fix_paths')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setFixPaths(data || []);
    } catch (err) {
      console.error('Error fetching fix paths:', err);
    }
  };

  const runSigmaScan = async (entityName?: string) => {
    try {
      setLoading(true);
      toast.info("Starting A.R.I.A™ SIGMA live scan...");

      const { data, error } = await supabase.functions.invoke('sigmalive-core', {
        body: { entity_name: entityName || 'general', scan_depth: 'standard' }
      });

      if (error) throw error;

      await fetchSigmaResults();
      toast.success(`SIGMA scan complete: ${data.results?.length || 0} intelligence items`);
      
      return data;
    } catch (err) {
      console.error('SIGMA scan error:', err);
      toast.error('SIGMA scan failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateFixPath = async (entityName: string, threatLevel: string) => {
    try {
      toast.info("Generating AI fix path...");

      const { data, error } = await supabase.functions.invoke('fixpath-ai-core', {
        body: { entity_name: entityName, threat_level: threatLevel }
      });

      if (error) throw error;

      await fetchFixPaths();
      toast.success(`Fix path generated for ${entityName}`);
      
      return data;
    } catch (err) {
      console.error('Fix path generation error:', err);
      toast.error('Fix path generation failed');
      throw err;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchSigmaResults(),
        fetchThreatProfiles(),
        fetchFixPaths()
      ]);
    } catch (err) {
      console.error('Error fetching SIGMA data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    sigmaResults,
    threatProfiles,
    fixPaths,
    loading,
    error,
    fetchData,
    runSigmaScan,
    generateFixPath
  };
};
