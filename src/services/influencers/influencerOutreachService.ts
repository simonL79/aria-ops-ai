
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logActivity } from "@/services/activityLogService";

/**
 * Influencer data structure
 */
export interface InfluencerAlert {
  id: string;
  influencer_name: string;
  platform: string;
  controversy_type: string;
  source: string;
  source_url?: string;
  content: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'contacted' | 'responded' | 'converted' | 'ignored';
  sentiment_score?: number;
  opportunity_score?: number;
  created_at: string;
  detected_at: string;
}

/**
 * Outreach type
 */
export type OutreachType = 'email' | 'dm' | 'both';

/**
 * Outreach template data
 */
export interface OutreachTemplate {
  id?: string;
  name: string;
  subject?: string;
  content: string;
  platform?: string;
  type: OutreachType;
  created_at?: string;
}

/**
 * Get all influencer alerts
 */
export const getInfluencerAlerts = async (
  limit: number = 100,
  filter?: { status?: string; platform?: string; severity?: string }
): Promise<InfluencerAlert[]> => {
  try {
    let query = supabase
      .from('influencer_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (filter?.status) {
      query = query.eq('status', filter.status);
    }
    if (filter?.platform) {
      query = query.eq('platform', filter.platform);
    }
    if (filter?.severity) {
      query = query.eq('severity', filter.severity);
    }

    // Limit the results
    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching influencer alerts:", error);
      return [];
    }

    return data as InfluencerAlert[];
  } catch (error) {
    console.error("Error in getInfluencerAlerts:", error);
    return [];
  }
};

/**
 * Get outreach templates
 */
export const getOutreachTemplates = async (type?: OutreachType): Promise<OutreachTemplate[]> => {
  try {
    let query = supabase
      .from('outreach_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching outreach templates:", error);
      return [];
    }

    return data as OutreachTemplate[];
  } catch (error) {
    console.error("Error in getOutreachTemplates:", error);
    return [];
  }
};

/**
 * Generate personalized outreach message
 */
export const generateOutreachMessage = async (
  influencer: InfluencerAlert,
  type: OutreachType = 'email'
): Promise<string> => {
  try {
    // Call the Supabase Edge Function to generate the message
    const { data, error } = await supabase.functions.invoke('generate-outreach', {
      body: { 
        influencer_name: influencer.influencer_name,
        platform: influencer.platform, 
        controversy_type: influencer.controversy_type,
        content: influencer.content,
        outreach_type: type
      }
    });

    if (error) {
      console.error("Error generating outreach message:", error);
      throw error;
    }

    return data?.message || getDefaultOutreachMessage(influencer, type);
  } catch (error) {
    console.error("Error in generateOutreachMessage:", error);
    return getDefaultOutreachMessage(influencer, type);
  }
};

/**
 * Default outreach message as a fallback
 */
const getDefaultOutreachMessage = (influencer: InfluencerAlert, type: OutreachType): string => {
  const messageParts = [
    `Dear ${influencer.influencer_name},`,
    `\nOur A.R.I.A. monitoring system recently detected coverage about you regarding "${influencer.controversy_type}" on ${influencer.source}.`,
    `\nAt our agency, we specialize in helping public figures and influencers effectively manage their online reputation and navigate challenging media situations.`,
    `\nWe noticed this before most people did, and our proactive approach can help you:`,
    `\n• Assess the potential impact on your online presence`,
    `\n• Develop a strategic response plan`,
    `\n• Mitigate negative sentiment and audience response`,
    `\n• Protect your brand partnerships and revenue streams`,
    `\nWould you be interested in a confidential, no-obligation consultation to discuss how we might help?`,
    `\nBest regards,`,
    `\nA.R.I.A. Reputation Intelligence Team`
  ];
  
  return messageParts.join('\n');
};

/**
 * Send email outreach
 */
export const sendEmailOutreach = async (
  influencer: InfluencerAlert, 
  messageContent?: string
): Promise<boolean> => {
  try {
    const content = messageContent || await generateOutreachMessage(influencer, 'email');
    
    // Call the send-email edge function
    const { data, error } = await supabase.functions.invoke('send-influencer-email', {
      body: {
        recipient: `contact@${influencer.platform}.example.com`, // This would be replaced by actual contact info in production
        subject: `A.R.I.A. Reputation Intelligence: Regarding Recent Coverage`,
        content: content,
        influencer_id: influencer.id,
        influencer_name: influencer.influencer_name
      }
    });

    if (error) {
      console.error("Error sending email outreach:", error);
      toast.error("Failed to send email outreach");
      return false;
    }

    // Update the influencer status
    await updateInfluencerStatus(influencer.id, 'contacted');
    
    // Log the activity
    await logActivity(
      'outreach_email',
      `Sent email outreach to ${influencer.influencer_name} regarding ${influencer.controversy_type}`,
      'influencer',
      influencer.id
    );

    toast.success("Email outreach sent successfully", {
      description: `Email sent to ${influencer.influencer_name}`
    });
    
    return true;
  } catch (error) {
    console.error("Error in sendEmailOutreach:", error);
    toast.error("Failed to send email outreach");
    return false;
  }
};

/**
 * Send DM outreach
 */
export const sendDMOutreach = async (
  influencer: InfluencerAlert, 
  messageContent?: string
): Promise<boolean> => {
  try {
    const content = messageContent || await generateOutreachMessage(influencer, 'dm');
    
    // Call the send-dm edge function (this would connect to the platform's API in production)
    const { data, error } = await supabase.functions.invoke('send-influencer-dm', {
      body: {
        platform: influencer.platform,
        username: influencer.influencer_name,
        content: content,
        influencer_id: influencer.id
      }
    });

    if (error) {
      console.error("Error sending DM outreach:", error);
      toast.error("Failed to send DM outreach");
      return false;
    }

    // Update the influencer status
    await updateInfluencerStatus(influencer.id, 'contacted');
    
    // Log the activity
    await logActivity(
      'outreach_dm',
      `Sent DM outreach to ${influencer.influencer_name} on ${influencer.platform}`,
      'influencer',
      influencer.id
    );

    toast.success("DM outreach sent successfully", {
      description: `Message sent to ${influencer.influencer_name} on ${influencer.platform}`
    });
    
    return true;
  } catch (error) {
    console.error("Error in sendDMOutreach:", error);
    toast.error("Failed to send DM outreach");
    return false;
  }
};

/**
 * Update influencer status
 */
export const updateInfluencerStatus = async (
  id: string,
  status: InfluencerAlert['status']
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('influencer_alerts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error("Error updating influencer status:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in updateInfluencerStatus:", error);
    return false;
  }
};
