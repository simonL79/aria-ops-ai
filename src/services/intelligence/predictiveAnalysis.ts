
import { toast } from "sonner";
import { callOpenAI } from "../api/openaiClient";

// Predictive threat analysis
export const runPredictiveAnalysis = async (
  data: {
    content: string;
    platform: string;
    brand: string;
    historicalData?: any;
  }
): Promise<{
  viralityProbability: number;
  timeframe: string;
  potentialReach: number;
  riskFactors: string[];
  preventativeActions: string[];
} | null> => {
  try {
    const predictivePrompt = `
You are a predictive reputation intelligence system focused on early detection and forecasting of potential viral threats.

Analyze this content and predict its potential to become a reputation threat:

Platform: ${data.platform}
Brand: ${data.brand}
Content: "${data.content}"

Return a JSON object with:
- viralityProbability: number between 0-100
- timeframe: string (e.g., "24-48 hours")
- potentialReach: estimated number of people
- riskFactors: [array of specific factors that could increase virality]
- preventativeActions: [array of recommended actions to take preemptively]
`;

    const messages = [
      {
        role: 'system' as const,
        content: 'You are an advanced predictive AI system for reputation intelligence that can forecast threats before they materialize.'
      },
      {
        role: 'user' as const,
        content: predictivePrompt
      }
    ];
    
    const responseData = await callOpenAI({
      model: "gpt-4o",
      messages,
      temperature: 0.3
    });
    
    const content = responseData.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("Empty response from API");
    }
    
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (parseError) {
      console.error("Failed to parse predictive analysis result:", parseError);
      throw new Error("Invalid predictive analysis response format");
    }
    
  } catch (error) {
    console.error("Predictive Analysis Error:", error);
    toast.error("Failed to run predictive analysis", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return null;
  }
};
