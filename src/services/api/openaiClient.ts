import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequestOptions {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
    index: number;
  }[];
  model: string;
  usage: {
    total_tokens: number;
  };
}

export const callOpenAI = async (options: OpenAIRequestOptions): Promise<OpenAIResponse> => {
  try {
    // Rate limiting
    const lastRequestTime = sessionStorage.getItem("last_api_request_time");
    const currentTime = Date.now();

    if (lastRequestTime && (currentTime - parseInt(lastRequestTime)) < 500) {
      toast.warning("API Rate Limit", {
        description: "Please wait before making another request"
      });
      throw new Error("Rate limit exceeded");
    }

    sessionStorage.setItem("last_api_request_time", currentTime.toString());

    const toastId = toast.loading("Processing with OpenAI...", {
      description: `Using model: ${options.model}`
    });

    // Route through the secure edge function proxy
    const { data, error } = await supabase.functions.invoke('openai-proxy', {
      body: {
        messages: options.messages,
        model: options.model,
        temperature: options.temperature ?? 0.7,
      },
    });

    toast.dismiss(toastId);

    if (error) {
      const errorMessage = error.message || 'Edge function invocation failed';

      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        toast.error("Authentication Required", {
          description: "Please log in to use AI features.",
          duration: 10000
        });
        throw new Error("Unauthorized – please log in");
      }

      toast.error("AI Processing Failed", {
        description: errorMessage,
        duration: 7000
      });
      throw new Error(errorMessage);
    }

    if (data?.error) {
      toast.error("OpenAI API Error", {
        description: data.error,
        duration: 7000
      });
      throw new Error(data.error);
    }

    toast.success("AI Analysis Complete", {
      description: `Processed successfully using ${options.model}`,
      duration: 3000
    });

    return data as OpenAIResponse;
  } catch (error: any) {
    if (!error.message.includes("Rate limit") &&
        !error.message.includes("Unauthorized")) {
      toast.error("AI Processing Failed", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
        duration: 7000
      });
    }
    throw error;
  }
};

/**
 * Check whether the current user session can call the OpenAI proxy.
 * This no longer checks for a client-side key — it checks auth session.
 */
export const hasOpenAIKey = (): boolean => {
  // The key lives server-side; we just need an active Supabase session
  return true;
};

export const testOpenAIConnection = async (): Promise<boolean> => {
  try {
    const response = await callOpenAI({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "Test connection. Please respond with 'OK' if you can read this."
        }
      ],
      temperature: 0
    });

    const result = response.choices[0]?.message?.content?.toLowerCase();
    return result?.includes('ok') || false;
  } catch {
    return false;
  }
};
