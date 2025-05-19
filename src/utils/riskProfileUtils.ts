import { toast } from "sonner";

// Define risk profile types
export type TonePreference = 'bold' | 'cautious' | 'empathetic' | 'formal' | 'casual' | 'technical';
export type ResponseTiming = 'immediate' | 'measured' | 'delayed';
export type ThreatSensitivity = 'low' | 'moderate' | 'high' | 'custom';

// Calculate the ideal response tone based on client preferences and threat type
export const calculateIdealResponseTone = (
  tonalPreferences: Record<string, number>,
  threatType: string,
  severity: number
): TonePreference[] => {
  const { boldness, empathy, formality } = tonalPreferences;
  const tones: TonePreference[] = [];
  
  // Add primary tone based on boldness
  if (boldness >= 7) {
    tones.push('bold');
  } else if (boldness <= 3) {
    tones.push('cautious');
  }
  
  // Add secondary tone based on empathy
  if (empathy >= 7) {
    tones.push('empathetic');
  }
  
  // Add tertiary tone based on formality
  if (formality >= 7) {
    tones.push('formal');
  } else if (formality <= 3) {
    tones.push('casual');
  }
  
  // Special case for technical issues
  if (threatType.includes('technical') || threatType.includes('product')) {
    tones.push('technical');
  }
  
  // If high severity, prioritize being cautious regardless of boldness setting
  if (severity >= 8 && !tones.includes('cautious')) {
    tones.unshift('cautious');
  }
  
  return tones;
};

// Calculate recommended response time based on client preferences and severity
export const calculateResponseTime = (
  clientTiming: ResponseTiming,
  severity: number
): { timing: ResponseTiming, maxHours: number } => {
  // Start with client preference
  let timing = clientTiming;
  let maxHours = 24;
  
  // For high severity, always respond faster
  if (severity >= 8) {
    timing = 'immediate';
    maxHours = 1;
  } else if (severity >= 6) {
    // Medium-high severity
    if (timing === 'delayed') {
      timing = 'measured';
    }
    maxHours = timing === 'immediate' ? 2 : 6;
  } else if (severity >= 4) {
    // Medium severity
    maxHours = timing === 'immediate' ? 4 : timing === 'measured' ? 12 : 24;
  } else {
    // Low severity
    maxHours = timing === 'immediate' ? 6 : timing === 'measured' ? 24 : 48;
  }
  
  return { timing, maxHours };
};

// Export a function to recalibrate risk score based on recent events
export const recalibrateRiskScore = (
  currentScore: number,
  recentEvents: Array<{ severity: number, platform: string }>,
  sensitivityLevel: number
): { newScore: number, reason: string } => {
  if (!recentEvents || recentEvents.length === 0) {
    return { newScore: currentScore, reason: 'No recent events' };
  }
  
  // Weight recent high severity events more heavily
  const highSeverityEvents = recentEvents.filter(e => e.severity >= 7);
  const averageSeverity = recentEvents.reduce((acc, e) => acc + e.severity, 0) / recentEvents.length;
  
  // Adjust score based on events and sensitivity
  let adjustment = 0;
  
  if (highSeverityEvents.length > 0) {
    // More impact from high severity events
    adjustment += highSeverityEvents.length * 3 * (sensitivityLevel / 5);
  }
  
  // General trend impact
  adjustment += (averageSeverity - 5) * 0.8 * (sensitivityLevel / 5);
  
  // Ensure the adjustment is reasonable
  adjustment = Math.min(Math.max(adjustment, -10), 10);
  
  // Calculate new score and keep within bounds
  let newScore = currentScore + adjustment;
  newScore = Math.min(Math.max(newScore, 0), 100);
  
  // Generate reason
  let reason = '';
  if (adjustment > 0) {
    reason = `Increased due to ${highSeverityEvents.length} high severity events`;
  } else if (adjustment < 0) {
    reason = 'Decreased due to positive trend in sentiment';
  } else {
    reason = 'Score remains stable';
  }
  
  return { newScore, reason };
};

// Helper to run quick risk assessment on a string of content
export const quickRiskAssessment = (content: string, sensitiveKeywords: string[]): {
  riskLevel: 'low' | 'medium' | 'high';
  matchedKeywords: string[];
  recommendation: string;
} => {
  content = content.toLowerCase();
  const matchedKeywords = sensitiveKeywords.filter(keyword => 
    content.includes(keyword.toLowerCase())
  );
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  let recommendation = 'Monitor only';
  
  if (matchedKeywords.length > 3) {
    riskLevel = 'high';
    recommendation = 'Immediate response recommended';
  } else if (matchedKeywords.length > 0) {
    riskLevel = 'medium';
    recommendation = 'Prepare response, monitor closely';
  }
  
  // Look for urgent language patterns
  const urgentPatterns = ['urgent', 'immediately', 'emergency', 'crisis', 'danger'];
  const viralPatterns = ['viral', 'trending', 'spreading', 'thousands', 'blowing up'];
  
  const hasUrgentPattern = urgentPatterns.some(pattern => content.includes(pattern));
  const hasViralPattern = viralPatterns.some(pattern => content.includes(pattern));
  
  if (hasUrgentPattern || hasViralPattern) {
    riskLevel = 'high';
    recommendation = 'Urgent: Potential viral content detected';
  }
  
  return { riskLevel, matchedKeywords, recommendation };
};

// Run simulated AI-based risk assessment (would connect to LLM in production)
export const runAIRiskAssessment = async (
  content: string,
  clientName: string
): Promise<void> => {
  // In production, this would call an AI endpoint
  toast.info("AI Risk Assessment Running", {
    description: `Analyzing content for ${clientName}...`
  });
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate result
  const severity = Math.floor(Math.random() * 10) + 1;
  const isRisky = severity > 6;
  
  if (isRisky) {
    toast.warning(`Risk Detected: ${severity}/10 Severity`, {
      description: "AI analysis found potential reputation threats in this content"
    });
  } else {
    toast.success("Low Risk Assessment", {
      description: `AI analysis determined this content is ${severity}/10 severity`
    });
  }
};
