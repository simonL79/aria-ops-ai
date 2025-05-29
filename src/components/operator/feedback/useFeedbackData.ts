
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CommandFeedback {
  id: string;
  command_id: string;
  execution_status: string;
  summary: string;
  error_message?: string;
  evaluated_at: string;
  created_by: string;
}

interface RemediationSuggestion {
  id: string;
  command_id: string;
  suggestion: string;
  rationale: string;
  proposed_by: string;
  created_at: string;
}

export const useFeedbackData = () => {
  const [feedback, setFeedback] = useState<CommandFeedback[]>([]);
  const [suggestions, setSuggestions] = useState<RemediationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFeedbackData();
    subscribeToUpdates();
  }, []);

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('feedback-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'command_response_feedback' },
        () => loadFeedbackData()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'command_remediation_suggestions' },
        () => loadRemediationSuggestions()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadFeedbackData = async () => {
    try {
      const { data, error } = await supabase
        .from('command_response_feedback')
        .select('*')
        .order('evaluated_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      console.error('Error loading feedback:', error);
    }
  };

  const loadRemediationSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('command_remediation_suggestions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  return {
    feedback,
    suggestions,
    isLoading,
    setIsLoading,
    loadFeedbackData,
    loadRemediationSuggestions
  };
};
