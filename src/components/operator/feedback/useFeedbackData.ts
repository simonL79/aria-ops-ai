
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeedbackItem {
  id: string;
  command: string;
  status: string;
  message: string;
  timestamp: string;
}

interface SuggestionItem {
  id: string;
  type: string;
  suggestion: string;
  priority: string;
  timestamp: string;
}

export const useFeedbackData = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);

  useEffect(() => {
    loadFeedbackData();
    loadSuggestions();
  }, []);

  const loadFeedbackData = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const feedbackItems: FeedbackItem[] = (data || []).map(item => ({
        id: item.id,
        command: item.action || 'Unknown Command',
        status: 'executed',
        message: item.details || 'Command executed successfully',
        timestamp: item.created_at
      }));

      setFeedback(feedbackItems);
    } catch (error) {
      console.error('Error loading feedback data:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('aria_notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const suggestionItems: SuggestionItem[] = (data || []).map(item => ({
        id: item.id,
        type: item.event_type || 'system',
        suggestion: item.summary || 'AI suggestion available',
        priority: item.priority || 'medium',
        timestamp: item.created_at
      }));

      setSuggestions(suggestionItems);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  return { feedback, suggestions };
};
