
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
    // For development, create dummy data if no alerts exist
    const { count } = await supabase
      .from('scan_results')
      .select('*', { count: 'exact', head: true })
      .eq('source_type', 'influencer');
    
    if (count === 0 || count === null) {
      await createDummyInfluencerAlerts();
    }
    
    // Query alerts from scan_results table
    let query = supabase
      .from('scan_results')
      .select('*')
      .eq('source_type', 'influencer')
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

    // Convert scan_results to InfluencerAlert format
    return data.map(item => ({
      id: item.id,
      influencer_name: item.detected_entities?.[0] || "Unknown Influencer",
      platform: item.platform,
      controversy_type: item.threat_type || "Unknown Issue",
      source: item.source_type || "Social Media",
      source_url: item.url,
      content: item.content,
      severity: item.severity as 'high' | 'medium' | 'low',
      status: item.status as 'new' | 'contacted' | 'responded' | 'converted' | 'ignored',
      sentiment_score: item.sentiment,
      opportunity_score: item.confidence_score,
      created_at: item.created_at,
      detected_at: item.created_at
    }));
  } catch (error) {
    console.error("Error in getInfluencerAlerts:", error);
    return [];
  }
};

/**
 * Create dummy influencer alerts for development/demo purposes
 */
const createDummyInfluencerAlerts = async (): Promise<void> => {
  try {
    const dummyAlerts = [
      {
        detected_entities: ["JamieStylez"],
        platform: "Instagram",
        content: "ASA has ruled against influencer JamieStylez for undisclosed sponsored content related to beauty products.",
        url: "https://www.asa.org.uk/rulings/example-ruling-123.html",
        severity: "high",
        status: "new",
        threat_type: "Regulatory Warning",
        source_type: "influencer",
        confidence_score: 85,
        sentiment: -75,
        potential_reach: 450000
      },
      {
        detected_entities: ["FitnessFred"],
        platform: "YouTube",
        content: "FitnessFred's supplement line pulled from stores after investigation into ingredient claims.",
        url: "https://www.bbc.co.uk/news/example-article",
        severity: "high",
        status: "new",
        threat_type: "Product Safety Concern",
        source_type: "influencer",
        confidence_score: 92,
        sentiment: -80,
        potential_reach: 1200000
      },
      {
        detected_entities: ["TravelWithMia"],
        platform: "TikTok",
        content: "Fans criticizing TravelWithMia after controversial statements about local customs during international trip.",
        url: "https://www.socialmediatrends.com/example-article",
        severity: "medium",
        status: "new",
        threat_type: "Public Backlash",
        source_type: "influencer",
        confidence_score: 78,
        sentiment: -60,
        potential_reach: 890000
      },
      {
        detected_entities: ["GamingGuru"],
        platform: "Twitch",
        content: "GamingGuru loses major sponsor after inappropriate comments during livestream.",
        url: "https://www.esportsnews.com/example-article",
        severity: "medium",
        status: "new",
        threat_type: "Brand Partnership Issue",
        source_type: "influencer",
        confidence_score: 88,
        sentiment: -65,
        potential_reach: 750000
      },
      {
        detected_entities: ["StyleIcon"],
        platform: "Twitter",
        content: "Fashion brand cuts ties with StyleIcon over allegations of copied designs.",
        url: "https://www.fashionindustry.com/example-article",
        severity: "high",
        status: "new",
        threat_type: "Intellectual Property Dispute",
        source_type: "influencer",
        confidence_score: 86,
        sentiment: -70,
        potential_reach: 520000
      }
    ];

    for (const alert of dummyAlerts) {
      await supabase.from('scan_results').insert([alert]);
    }
  } catch (error) {
    console.error("Error creating dummy alerts:", error);
  }
};

/**
 * Get outreach templates
 */
export const getOutreachTemplates = async (type?: OutreachType): Promise<OutreachTemplate[]> => {
  // For development, return hardcoded templates
  const emailTemplates: OutreachTemplate[] = [
    {
      id: '1',
      name: 'Standard Outreach Email',
      subject: 'A.R.I.A. Reputation Intelligence: Regarding Recent Coverage',
      content: `Dear {{influencer_name}},

Our A.R.I.A. monitoring system recently detected coverage about you regarding "{{controversy_type}}" on {{source}}.

At our agency, we specialize in helping public figures and influencers effectively manage their online reputation and navigate challenging media situations.

We noticed this before most people did, and our proactive approach can help you:
• Assess the potential impact on your online presence
• Develop a strategic response plan
• Mitigate negative sentiment and audience response
• Protect your brand partnerships and revenue streams

Would you be interested in a confidential, no-obligation consultation to discuss how we might help?

Best regards,
A.R.I.A. Reputation Intelligence Team`,
      type: 'email',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Urgent Intervention Email',
      subject: 'Urgent: Reputation Management Support Available',
      content: `Dear {{influencer_name}},

Our A.R.I.A. monitoring system has flagged a high-priority situation regarding "{{controversy_type}}" that could significantly impact your online reputation.

Immediate action may help contain this situation before it escalates further. Our team has extensive experience helping influencers navigate similar challenges.

Would you be available for an urgent consultation to discuss response strategies?

Regards,
A.R.I.A. Crisis Response Team`,
      type: 'email',
      created_at: new Date().toISOString()
    }
  ];
  
  const dmTemplates: OutreachTemplate[] = [
    {
      id: '3',
      name: 'Brief Platform DM',
      content: `Hi {{influencer_name}}, I'm reaching out from A.R.I.A. Reputation Intelligence. We've detected some concerning coverage about you regarding "{{controversy_type}}". We help influencers navigate these situations and protect their brand. Would you be interested in hearing how we can help? (This is discreet and confidential)`,
      type: 'dm',
      created_at: new Date().toISOString()
    }
  ];
  
  return type === 'email' ? emailTemplates : 
         type === 'dm' ? dmTemplates : 
         [...emailTemplates, ...dmTemplates];
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

    // Update the influencer status in scan_results table
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
      .from('scan_results')
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
