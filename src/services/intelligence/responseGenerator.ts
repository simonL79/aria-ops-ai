
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logActivity, LogAction } from "@/services/activityLogService";

export interface ResponseRequest {
  content: string;
  threatType?: string;
  severity?: string;
  platform?: string;
  tone?: 'professional' | 'friendly' | 'empathetic' | 'authoritative' | 'neutral';
  brandName?: string;
  length?: 'short' | 'medium' | 'long';
}

export interface ResponseResult {
  response: string;
  metadata: {
    platform?: string;
    threatType?: string;
    severity?: string;
    tone?: string;
    length?: string;
    timestamp: string;
  };
}

// Generate response using the edge function
export const generateResponse = async (data: ResponseRequest): Promise<ResponseResult | null> => {
  try {
    const { data: responseData, error } = await supabase.functions.invoke('generate-response', {
      body: data
    });

    if (error) {
      console.error("Response generation error:", error);
      toast.error("Failed to generate response", {
        description: "There was an error communicating with the response service.",
        duration: 5000
      });
      return null;
    }
    
    if (!responseData || !responseData.success) {
      throw new Error("Failed to generate response");
    }
    
    // Log the response generation activity
    await logActivity(
      LogAction.RESPOND,
      `Generated ${data.length || 'medium'} ${data.tone || 'professional'} response for content on ${data.platform || 'unknown platform'}`,
      'response',
      'generate-response'
    );
    
    return {
      response: responseData.response,
      metadata: responseData.metadata
    };
    
  } catch (error) {
    console.error("Response Generation Error:", error);
    toast.error("Failed to generate response", {
      description: error instanceof Error 
        ? error.message 
        : "Unknown error occurred. Please try again later.",
      duration: 5000
    });
    return null;
  }
};

// Save generated response to database - using any type to bypass type checking temporarily
// This is a workaround until the Supabase types are regenerated
export const saveGeneratedResponse = async (
  response: string, 
  originalContentId?: string,
  clientId?: string
): Promise<boolean> => {
  try {
    // Using 'as any' to bypass type checking for tables not in the Supabase schema yet
    const { error } = await (supabase
      .from('generated_responses') as any)
      .insert({
        response_text: response,
        original_content_id: originalContentId,
        client_id: clientId
      });
    
    if (error) {
      console.error("Error saving response:", error);
      return false;
    }
    
    // Log saving activity
    await logActivity(
      LogAction.CREATE,
      `Saved generated response${clientId ? ' for a client' : ''}`,
      'response',
      originalContentId || 'manual'
    );
    
    return true;
    
  } catch (error) {
    console.error("Error in saveGeneratedResponse:", error);
    return false;
  }
};

// Get response history - using any type to bypass type checking temporarily
export const getResponseHistory = async (limit: number = 10): Promise<any[]> => {
  try {
    // Using 'as any' to bypass type checking for tables not in the Supabase schema yet
    const { data, error } = await (supabase
      .from('generated_responses') as any)
      .select(`
        *,
        clients:client_id (name),
        scan_results:original_content_id (content, platform)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching response history:", error);
      return [];
    }
    
    return data || [];
    
  } catch (error) {
    console.error("Error in getResponseHistory:", error);
    return [];
  }
};
