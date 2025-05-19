
import { toast } from "sonner";
import { ThreatClassifierRequest, ThreatClassificationResult } from "@/types/intelligence";
import { callOpenAI } from "../api/openaiClient";

// Safely extract JSON from potentially non-JSON text
const extractJSON = (text: string): string => {
  // Look for JSON-like pattern starting with { and ending with }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : text;
};

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

IMPORTANT: Reply ONLY with valid JSON. Do not include any other text, markdown formatting, or explanations outside of the JSON structure.
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
    
    try {
      const responseData = await callOpenAI({
        model: "gpt-4o",
        messages,
        temperature: 0.4
      });
      
      const content = responseData?.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error("Empty response from API");
      }
      
      try {
        // Extract JSON from potential text and parse it
        const jsonContent = extractJSON(content);
        const parsed = JSON.parse(jsonContent);
        
        // Validate the response has required fields
        if (!parsed.category || !parsed.severity || !parsed.recommendation) {
          console.error("Invalid classification response structure:", parsed);
          throw new Error("The API response is missing required fields");
        }
        
        return parsed as ThreatClassificationResult;
      } catch (parseError) {
        console.error("Failed to parse classification result:", parseError);
        console.error("Raw content:", content);
        throw new Error("Invalid classification response format");
      }
    } catch (apiError) {
      // Check for quota exceeded error
      if (apiError.message?.toLowerCase().includes("quota") || 
          apiError.message?.toLowerCase().includes("rate limit") || 
          apiError.message?.toLowerCase().includes("capacity")) {
        toast.error("OpenAI API Quota Exceeded", {
          description: "Your API key's quota has been exceeded. Please update your API key in settings.",
          action: {
            label: "Go to Settings",
            onClick: () => window.location.href = "/settings"
          },
          duration: 10000
        });
      }
      throw apiError;
    }
    
  } catch (error) {
    console.error("Classification API Error:", error);
    toast.error("Failed to classify threat", {
      description: error instanceof Error 
        ? error.message 
        : "Unknown error occurred. Please check your API key or try again later.",
      duration: 5000
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

IMPORTANT: Reply ONLY with valid JSON. Do not include any other text, markdown formatting, or explanations outside of the JSON structure.
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
    
    const responseData = await callOpenAI({
      model: "gpt-4o",
      messages,
      temperature: 0.4
    });
    
    const content = responseData.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("Empty response from API");
    }
    
    try {
      // Extract JSON from potential text and parse it
      const jsonContent = extractJSON(content);
      const parsed = JSON.parse(jsonContent);
      
      // Validate the response has required fields
      if (!parsed.category || !parsed.severity || !parsed.recommendation) {
        console.error("Invalid classification response structure:", parsed);
        throw new Error("The API response is missing required fields");
      }
      
      return parsed as ThreatClassificationResult;
    } catch (parseError) {
      console.error("Failed to parse classification result:", parseError);
      console.error("Raw content:", content);
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
