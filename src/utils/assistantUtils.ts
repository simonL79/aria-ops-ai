
import { classifyContentThreat, ThreatClassificationResult } from "@/services/intelligence/contentClassifier";
import { toast } from "sonner";

interface AnalyzeUpdateProps {
  clientName: string;
  changeType: string;
  description: string;
  platform?: string;
}

export const analyzeUpdate = async (props: AnalyzeUpdateProps): Promise<{
  severity: number;
  recommendation: string;
  analysis: string;
} | null> => {
  try {
    const result = await classifyContentThreat(
      `Client: ${props.clientName}\nChange type: ${props.changeType}\nPlatform: ${props.platform || 'unknown'}\nContent: ${props.description}`
    );
    
    if (!result) return null;
    
    return {
      severity: result.severity,
      recommendation: result.action,
      analysis: result.explanation || ''
    };
  } catch (error) {
    console.error("Error analyzing update:", error);
    return null;
  }
};

export const getSeverityLevel = (score: number): 'low' | 'medium' | 'high' => {
  if (score >= 7) return 'high';
  if (score >= 4) return 'medium';
  return 'low';
};

export const getRecommendedActions = (severity: 'low' | 'medium' | 'high'): string[] => {
  switch (severity) {
    case 'high':
      return [
        'Immediate response required',
        'Escalate to communications team',
        'Monitor for spread across platforms',
        'Draft crisis communications plan'
      ];
    case 'medium':
      return [
        'Prepare response within 24 hours',
        'Track engagement metrics',
        'Review prior similar incidents'
      ];
    case 'low':
      return [
        'Monitor for changes in engagement',
        'No immediate action required'
      ];
  }
};

export const notifyUser = (title: string, description: string, type: 'info' | 'warning' | 'error' = 'info', action?: { label: string, onClick: () => void }) => {
  toast[type](title, { description, action });
};
