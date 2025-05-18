
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

// New: Multi-agent collaborative threat analysis
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

// New: Predictive threat analysis
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
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY || localStorage.getItem("openai_api_key")}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.3
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
