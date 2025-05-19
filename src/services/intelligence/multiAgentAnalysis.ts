
import { toast } from "sonner";
import { ThreatClassifierRequest, ThreatClassificationResult } from "@/types/intelligence";
import { callOpenAI } from "../api/openaiClient";

// Multi-agent collaborative threat analysis
export const runMultiAgentAnalysis = async (
  data: ThreatClassifierRequest & {
    agents?: string[];
    depth?: 'basic' | 'standard' | 'deep';
  }
): Promise<{
  classification: ThreatClassificationResult;
  insights: string[];
  recommendations: string[];
} | null> => {
  try {
    // In a real implementation, this would orchestrate multiple specialized agents
    // For demo purposes, we simulate the collaborative analysis
    
    const agentsPrompt = `
You are a multi-agent reputation intelligence system with the following specialized agents collaborating:
- Sentinel Agent: Detects patterns and emerging threats
- Legal Watchdog Agent: Assesses legal and compliance risks
- Liaison Agent: Crafts response strategies
- Researcher Agent: Provides context and background

Analyze this content in depth, with each agent contributing their specialized analysis:

Platform: ${data.platform}
Brand: ${data.brand}
Content: "${data.content}"
Analysis depth: ${data.depth || 'standard'}

Return a JSON object with:
- classification: { category, severity, recommendation, ai_reasoning }
- insights: [array of key insights from different agent perspectives]
- recommendations: [array of specific actionable recommendations]
`;

    const messages = [
      {
        role: 'system' as const,
        content: 'You are an advanced multi-agent AI system for reputation intelligence and brand protection.'
      },
      {
        role: 'user' as const,
        content: agentsPrompt
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
      const parsed = JSON.parse(content);
      return parsed;
    } catch (parseError) {
      console.error("Failed to parse multi-agent analysis result:", parseError);
      throw new Error("Invalid multi-agent analysis response format");
    }
    
  } catch (error) {
    console.error("Multi-Agent Analysis Error:", error);
    toast.error("Failed to run multi-agent analysis", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return null;
  }
};
