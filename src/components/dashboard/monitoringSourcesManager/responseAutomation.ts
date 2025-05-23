
import { ScanResult } from './types';

export interface SuggestedActions {
  tone: 'proactive' | 'passive' | 'defensive' | 'legal';
  actions: string[];
  urgency: 'immediate' | 'within_24h' | 'within_week';
  stakeholders: string[];
}

export interface EmailDraft {
  to: string;
  subject: string;
  body: string;
  tone: string;
  urgency: 'high' | 'medium' | 'low';
}

export function generateSuggestedActions(scanResult: ScanResult): SuggestedActions {
  const { platform, threat_severity, threat_summary, risk_entity_type } = scanResult;
  
  const actions = [];
  const stakeholders = [];

  if (threat_severity === 'HIGH') {
    actions.push("Alert legal and PR teams immediately.");
    actions.push("Consider issuing a public statement or social media clarification.");
    stakeholders.push('Legal Team', 'PR Director', 'CEO');
    
    if (platform === 'Reddit' || platform === 'Twitter') {
      actions.push("Monitor community reactions and respond to misinformation.");
    }
    
    if (platform === 'news' || platform === 'media') {
      actions.push("Contact journalist/publication for right of reply.");
      actions.push("Prepare detailed fact sheet for media inquiries.");
    }
  } else if (threat_severity === 'MEDIUM') {
    actions.push("Monitor engagement and sentiment.");
    actions.push("Prepare talking points or a passive response if asked.");
    stakeholders.push('PR Team', 'Communications Lead');
    
    if (platform === 'social') {
      actions.push("Consider direct engagement with the content creator.");
    }
  } else {
    actions.push("Log for reference. No public action recommended unless escalated.");
    actions.push("Continue monitoring for similar content patterns.");
    stakeholders.push('Monitoring Team');
  }

  // Add general actions
  actions.push("Document all response activities for legal compliance.");
  actions.push("Set up monitoring alerts for related mentions.");

  return {
    tone: threat_severity === 'HIGH' ? 'proactive' : 'passive',
    actions,
    urgency: threat_severity === 'HIGH' ? 'immediate' : threat_severity === 'MEDIUM' ? 'within_24h' : 'within_week',
    stakeholders: [...new Set(stakeholders)] // Remove duplicates
  };
}

export function generateEmailDraft(scanResult: ScanResult, recipientType: 'internal' | 'external' = 'internal'): EmailDraft {
  const suggestedActions = generateSuggestedActions(scanResult);
  const entityName = scanResult.risk_entity_name || 'our organization';
  const isHighSeverity = scanResult.threat_severity === 'HIGH';

  if (recipientType === 'internal') {
    return {
      to: 'leadership@company.com',
      subject: `${isHighSeverity ? 'URGENT: ' : ''}UK Celebrity/Sports Threat Detected - ${scanResult.platform}`,
      body: `Subject: UK Celebrity/Sports Reputational Concern on ${scanResult.platform} – Action Recommended

Hi team,

We've detected a ${scanResult.threat_severity}-severity mention of ${entityName} on ${scanResult.platform} that requires attention:

**Threat Summary:**
"${scanResult.threat_summary || scanResult.content?.substring(0, 200) || 'No summary available'}"

**Platform:** ${scanResult.platform}
**Risk Level:** ${scanResult.threat_severity}
**Entity Type:** ${scanResult.risk_entity_type || 'Unknown'}
**Detected:** ${new Date().toLocaleString()}

**Recommended Actions:**
${suggestedActions.actions.map(action => `• ${action}`).join('\n')}

**Stakeholders to Involve:**
${suggestedActions.stakeholders.join(', ')}

**Response Urgency:** ${suggestedActions.urgency.replace('_', ' ').toUpperCase()}

This appears to be related to UK celebrity/sports monitoring. Please review and confirm next steps.

Best regards,
ARIA UK Celebrity/Sports Monitoring Team`,
      tone: suggestedActions.tone,
      urgency: isHighSeverity ? 'high' : 'medium'
    };
  } else {
    // External outreach email
    return {
      to: 'contact@platform.com',
      subject: `Clarification Request Regarding UK Celebrity/Sports Content`,
      body: `Dear Team,

We recently became aware of content on your platform regarding ${entityName}. We would appreciate the opportunity to provide clarification on any factual inaccuracies that may be present.

We believe in transparent communication and would be happy to provide additional context or documentation to ensure accurate information is available to your UK audience.

Could we schedule a brief call to discuss this matter?

Best regards,
UK Communications Team`,
      tone: 'diplomatic',
      urgency: 'medium'
    };
  }
}

export function analyzeUKCelebritySportsThreat(scanResult: ScanResult): {
  isUKFocused: boolean;
  celebrityType: 'sports' | 'entertainment' | 'business' | 'political' | 'other';
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
} {
  const content = (scanResult.content || '').toLowerCase();
  const platform = (scanResult.platform || '').toLowerCase();
  
  // Check if UK-focused
  const ukKeywords = ['uk', 'britain', 'british', 'england', 'scotland', 'wales', 'london', 'premier league', 'bbc', 'itv'];
  const isUKFocused = ukKeywords.some(keyword => content.includes(keyword));
  
  // Determine celebrity type
  let celebrityType: 'sports' | 'entertainment' | 'business' | 'political' | 'other' = 'other';
  
  if (content.includes('football') || content.includes('premier league') || content.includes('cricket') || content.includes('rugby')) {
    celebrityType = 'sports';
  } else if (content.includes('actor') || content.includes('singer') || content.includes('tv') || content.includes('film')) {
    celebrityType = 'entertainment';
  } else if (content.includes('ceo') || content.includes('business') || content.includes('company')) {
    celebrityType = 'business';
  } else if (content.includes('mp') || content.includes('minister') || content.includes('politics')) {
    celebrityType = 'political';
  }
  
  // Assess risk level
  const highRiskKeywords = ['scandal', 'allegation', 'lawsuit', 'arrest', 'controversy'];
  const mediumRiskKeywords = ['criticism', 'dispute', 'rumour', 'speculation'];
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (highRiskKeywords.some(keyword => content.includes(keyword))) {
    riskLevel = 'high';
  } else if (mediumRiskKeywords.some(keyword => content.includes(keyword))) {
    riskLevel = 'medium';
  }
  
  // Generate recommendations
  const recommendations = [];
  
  if (isUKFocused) {
    recommendations.push('Focus on UK media outlets and audience');
  }
  
  if (celebrityType === 'sports') {
    recommendations.push('Coordinate with sports PR team and relevant sporting bodies');
  } else if (celebrityType === 'entertainment') {
    recommendations.push('Consider impact on upcoming projects and media appearances');
  }
  
  if (platform.includes('reddit')) {
    recommendations.push('Monitor UK-specific subreddits for further discussion');
  } else if (platform.includes('twitter')) {
    recommendations.push('Track UK trending topics and hashtags');
  }
  
  return {
    isUKFocused,
    celebrityType,
    riskLevel,
    recommendations
  };
}
