
import { toast } from "sonner";
import { ContentAlert } from "@/types/dashboard";
import { ThreatClassificationResult } from "@/types/intelligence/threats";
import { classifyThreat } from "@/services";
import { sendSlackNotification, shouldNotify } from "@/services/notifications/slackNotificationService";

// Simulate API endpoint for content classification
export const classifyContent = async (
  content: string,
  platform: string,
  brand: string
): Promise<ThreatClassificationResult | null> => {
  try {
    const result = await classifyThreat({
      content,
      platform,
      brand
    });
    
    return result;
  } catch (error) {
    console.error("Error classifying content:", error);
    toast.error("Failed to classify content");
    return null;
  }
};

// Simulate API endpoint for storing a new mention
export const storeMention = async (
  mention: Omit<ContentAlert, "id" | "status">
): Promise<ContentAlert> => {
  try {
    // In a real implementation, this would be an API call
    // Simulating API behavior with local logic
    const newMention: ContentAlert = {
      ...mention,
      id: `mention-${Date.now()}`,
      status: "new"
    };
    
    console.log("Mention stored:", newMention);
    
    // Send notification for high severity mentions
    if (
      shouldNotify(mention.severity) && 
      process.env.SLACK_WEBHOOK_URL
    ) {
      const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
      
      await sendSlackNotification(
        slackWebhookUrl,
        {
          clientName: "YourBrand", // This would come from context in a real app
          platform: mention.platform,
          severity: mention.severity,
          category: mention.category || "Uncategorized",
          content: mention.content,
          recommendation: mention.recommendation || "Review immediately",
          dashboardUrl: `${window.location.origin}/dashboard/mentions`
        }
      );
    }
    
    return newMention;
  } catch (error) {
    console.error("Error storing mention:", error);
    toast.error("Failed to store mention");
    throw error;
  }
};

// Simulate API endpoint for getting mentions with filters
export const getMentions = async (filters?: {
  source?: string;
  severityMin?: number;
  severityMax?: number;
  category?: string;
  fromDate?: Date;
  toDate?: Date;
}): Promise<ContentAlert[]> => {
  try {
    // In a real implementation, this would be an API call with filter parameters
    // For now, return mock data from local storage or simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data (in a real app, this would come from the API)
    return [];
  } catch (error) {
    console.error("Error getting mentions:", error);
    toast.error("Failed to load mentions");
    return [];
  }
};
