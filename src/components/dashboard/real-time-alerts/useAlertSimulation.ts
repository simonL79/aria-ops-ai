import { useState, useEffect } from 'react';
import { ContentAlert } from '@/types/dashboard';

const generateMockAlert = (): ContentAlert => {
  const platforms = ['Twitter', 'Facebook', 'Reddit', 'LinkedIn'];
  const severities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
  const sentiments: ('positive' | 'negative' | 'neutral' | 'threatening')[] = ['positive', 'negative', 'neutral', 'threatening'];
  
  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    content: `Real-time alert detected at ${new Date().toLocaleTimeString()}`,
    date: new Date().toISOString(),
    severity: severities[Math.floor(Math.random() * severities.length)],
    status: 'new',
    url: `https://example.com/alert/${Math.random().toString(36).substring(2, 9)}`,
    sourceType: 'social',
    confidenceScore: Math.floor(Math.random() * 40) + 60,
    sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
    detectedEntities: ['entity1', 'entity2'],
    category: 'Real-time Detection'
  };
};

const useAlertSimulation = (interval: number = 60000) => {
  const [alert, setAlert] = useState<ContentAlert | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setAlert(generateMockAlert());
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return alert;
};

export default useAlertSimulation;
