
import { ThreatClassifierRequest, ThreatClassificationResult } from "@/types/intelligence";
import { toast } from "sonner";

// Simplified version of the FastAPI threat classifier
export const classifyThreat = async (data: ThreatClassifierRequest): Promise<ThreatClassificationResult | null> => {
  try {
    const prompt = `
You are a digital reputation analyst. Classify this post.

Platform: ${data.platform}
Brand: ${data.brand}
Content: "${data.content}"

Return JSON with:
- category: (one of 'Neutral', 'Positive', 'Complaint', 'Reputation Threat', 'Misinformation', 'Legal Risk')
- severity: 1-10
- recommendation: next step (e.g. auto-response, escalation)
- ai_reasoning: why you classified it this way
`;

    const messages = [
      {
        role: 'system' as const,
        content: 'You are a digital reputation analysis AI that helps analyze content for potential threats to brand reputation.'
      },
      {
        role: 'user' as const,
        content: prompt
      }
    ];
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY || localStorage.getItem("openai_api_key")}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.4
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error calling OpenAI API");
    }
    
    const responseData = await response.json();
    const content = responseData.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("Empty response from API");
    }
    
    try {
      const parsed = JSON.parse(content);
      return parsed as ThreatClassificationResult;
    } catch (parseError) {
      console.error("Failed to parse classification result:", parseError);
      throw new Error("Invalid classification response format");
    }
    
  } catch (error) {
    console.error("Classification API Error:", error);
    toast.error("Failed to classify threat", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return null;
  }
};

// Advanced threat classifier that takes additional context into account
export const classifyThreatAdvanced = async (
  data: ThreatClassifierRequest & {
    previousInteractions?: string[];
    reputationScore?: number;
    historicalContext?: string;
  }
): Promise<ThreatClassificationResult | null> => {
  try {
    const prompt = `
You are an advanced digital reputation analyst with access to historical context. Classify this post.

Platform: ${data.platform}
Brand: ${data.brand}
Content: "${data.content}"
${data.previousInteractions ? `Previous interactions: ${JSON.stringify(data.previousInteractions)}` : ''}
${data.reputationScore !== undefined ? `Current reputation score: ${data.reputationScore}/10` : ''}
${data.historicalContext ? `Historical context: ${data.historicalContext}` : ''}

Return JSON with:
- category: (one of 'Neutral', 'Positive', 'Complaint', 'Reputation Threat', 'Misinformation', 'Legal Risk')
- severity: 1-10
- recommendation: next step (e.g. auto-response, human review, escalation, legal team)
- ai_reasoning: why you classified it this way
`;

    const messages = [
      {
        role: 'system' as const,
        content: 'You are a digital reputation analysis AI that helps analyze content for potential threats to brand reputation with advanced context awareness.'
      },
      {
        role: 'user' as const,
        content: prompt
      }
    ];
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY || localStorage.getItem("openai_api_key")}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.4
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Error calling OpenAI API");
    }
    
    const responseData = await response.json();
    const content = responseData.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("Empty response from API");
    }
    
    try {
      const parsed = JSON.parse(content);
      return parsed as ThreatClassificationResult;
    } catch (parseError) {
      console.error("Failed to parse classification result:", parseError);
      throw new Error("Invalid classification response format");
    }
    
  } catch (error) {
    console.error("Advanced Classification API Error:", error);
    toast.error("Failed to classify threat", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return null;
  }
};
