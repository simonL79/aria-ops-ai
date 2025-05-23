
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ThreatResponse {
  id: string;
  content: string;
  platform: string;
  url: string;
  severity: 'low' | 'medium' | 'high';
  threat_type?: string;
  risk_entity_name?: string;
  response_status: 'unaddressed' | 'pending' | 'in_progress' | 'resolved';
  response_notes?: string;
  assigned_to?: string;
  created_at: string;
  priority_level?: 'critical' | 'high' | 'moderate';
}

export interface SuggestedActions {
  tone: 'defensive' | 'proactive' | 'legal' | 'diplomatic';
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

/**
 * Get high-priority threats that need attention
 */
export const getHighPriorityThreats = async (): Promise<ThreatResponse[]> => {
  try {
    const { data, error } = await supabase
      .from('high_priority_threats')
      .select('*')
      .limit(20);

    if (error) {
      console.error('Error fetching high priority threats:', error);
      return [];
    }

    // Type the data properly to ensure severity is correctly mapped
    const typedData: ThreatResponse[] = (data || []).map((item: any) => ({
      id: item.id,
      content: item.content,
      platform: item.platform,
      url: item.url || '',
      severity: (item.severity === 'high' || item.severity === 'medium' || item.severity === 'low') 
        ? item.severity as 'low' | 'medium' | 'high'
        : 'low',
      threat_type: item.threat_type,
      risk_entity_name: item.risk_entity_name,
      response_status: item.response_status || 'unaddressed',
      response_notes: item.response_notes,
      assigned_to: item.assigned_to,
      created_at: item.created_at,
      priority_level: item.priority_level
    }));

    return typedData;
  } catch (error) {
    console.error('Error in getHighPriorityThreats:', error);
    return [];
  }
};

/**
 * Generate suggested actions based on threat analysis
 */
export const generateSuggestedActions = (scanResult: ThreatResponse): SuggestedActions => {
  const isHighSeverity = scanResult.severity === 'high' || scanResult.priority_level === 'critical';
  const platform = scanResult.platform.toLowerCase();
  const threatType = scanResult.threat_type?.toLowerCase() || '';
  
  // Determine tone based on threat characteristics
  let tone: SuggestedActions['tone'] = 'proactive';
  if (threatType.includes('legal') || threatType.includes('lawsuit')) {
    tone = 'legal';
  } else if (threatType.includes('allegation') || threatType.includes('scandal')) {
    tone = 'defensive';
  } else if (platform.includes('news') || platform.includes('media')) {
    tone = 'diplomatic';
  }

  // Generate actions based on platform and severity
  const actions: string[] = [];
  const stakeholders: string[] = [];

  if (isHighSeverity) {
    actions.push('Immediately notify senior leadership and legal team');
    actions.push('Prepare a formal response statement within 2 hours');
    stakeholders.push('CEO', 'Legal Team', 'PR Director');
  }

  if (platform.includes('reddit') || platform.includes('forum')) {
    actions.push('Consider engaging directly with the community post');
    actions.push('Monitor thread for additional developments');
    actions.push('Prepare factual clarification if misinformation is present');
  } else if (platform.includes('twitter') || platform.includes('social')) {
    actions.push('Prepare social media response strategy');
    actions.push('Monitor for viral spread and engagement metrics');
    actions.push('Consider direct outreach to influential commenters');
  } else if (platform.includes('news') || platform.includes('media')) {
    actions.push('Contact journalist/publication for right of reply');
    actions.push('Prepare detailed fact sheet for media inquiries');
    actions.push('Consider issuing a press statement');
  }

  // Add general actions
  actions.push('Document all response activities for legal compliance');
  actions.push('Set up monitoring alerts for related mentions');
  
  if (!stakeholders.includes('PR Team')) {
    stakeholders.push('PR Team');
  }
  stakeholders.push('Monitoring Team');

  return {
    tone,
    actions,
    urgency: isHighSeverity ? 'immediate' : scanResult.severity === 'medium' ? 'within_24h' : 'within_week',
    stakeholders
  };
};

/**
 * Generate email draft for threat response
 */
export const generateEmailScript = (scanResult: ThreatResponse, recipientType: 'internal' | 'external' = 'internal'): EmailDraft => {
  const suggestedActions = generateSuggestedActions(scanResult);
  const entityName = scanResult.risk_entity_name || 'our organization';
  const isHighSeverity = scanResult.severity === 'high' || scanResult.priority_level === 'critical';

  if (recipientType === 'internal') {
    return {
      to: 'leadership@company.com',
      subject: `${isHighSeverity ? 'URGENT: ' : ''}Reputational Threat Detected - ${scanResult.platform}`,
      body: `Subject: Reputational Concern on ${scanResult.platform} – Action Recommended

Hi team,

We've detected a ${scanResult.severity}-severity mention of ${entityName} on ${scanResult.platform} that requires attention:

**Threat Summary:**
"${scanResult.content.substring(0, 200)}${scanResult.content.length > 200 ? '...' : ''}"

**Platform:** ${scanResult.platform}
**URL:** ${scanResult.url}
**Risk Level:** ${scanResult.priority_level?.toUpperCase() || scanResult.severity.toUpperCase()}
**Detected:** ${new Date(scanResult.created_at).toLocaleString()}

**Recommended Actions:**
${suggestedActions.actions.map(action => `• ${action}`).join('\n')}

**Stakeholders to Involve:**
${suggestedActions.stakeholders.join(', ')}

**Response Urgency:** ${suggestedActions.urgency.replace('_', ' ').toUpperCase()}

Please review and confirm next steps. All activities will be tracked in our monitoring system.

Best regards,
ARIA Threat Monitoring Team`,
      tone: suggestedActions.tone,
      urgency: isHighSeverity ? 'high' : 'medium'
    };
  } else {
    // External outreach email (to the platform/poster)
    return {
      to: 'contact@platform.com',
      subject: `Clarification Request Regarding Recent Post`,
      body: `Dear Team,

We recently became aware of a post on your platform regarding ${entityName}. We would appreciate the opportunity to provide clarification on any factual inaccuracies that may be present.

We believe in transparent communication and would be happy to provide additional context or documentation to ensure accurate information is available to your community.

Could we schedule a brief call to discuss this matter?

Best regards,
Communications Team`,
      tone: 'diplomatic',
      urgency: 'medium'
    };
  }
};

/**
 * Update threat response status
 */
export const updateThreatResponseStatus = async (
  threatId: string, 
  status: 'unaddressed' | 'pending' | 'in_progress' | 'resolved',
  notes?: string,
  assignedTo?: string
): Promise<boolean> => {
  try {
    const updateData: any = {
      response_status: status,
      updated_at: new Date().toISOString()
    };

    if (notes) {
      updateData.response_notes = notes;
    }

    if (assignedTo) {
      updateData.assigned_to = assignedTo;
    }

    const { error } = await supabase
      .from('scan_results')
      .update(updateData)
      .eq('id', threatId);

    if (error) {
      console.error('Error updating threat response status:', error);
      toast.error('Failed to update response status');
      return false;
    }

    toast.success('Response status updated successfully');
    return true;
  } catch (error) {
    console.error('Error in updateThreatResponseStatus:', error);
    return false;
  }
};

/**
 * Assign threat to team member
 */
export const assignThreat = async (threatId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('scan_results')
      .update({
        assigned_to: userId,
        response_status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', threatId);

    if (error) {
      console.error('Error assigning threat:', error);
      toast.error('Failed to assign threat');
      return false;
    }

    toast.success('Threat assigned successfully');
    return true;
  } catch (error) {
    console.error('Error in assignThreat:', error);
    return false;
  }
};
