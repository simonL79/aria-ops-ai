
import { toast } from "sonner";
import { contentSafetyCheck } from "../secureApiService";
import { callSecureOpenAI, validateMessages } from "./client";
import { createContextMessages } from "./messageBuilder";
import { ResponseGenerationProps } from "./types";

// Generate a response using the OpenAI API
export const generateAIResponse = async (props: ResponseGenerationProps): Promise<string> => {
  try {
    // Security check on input content
    if (!contentSafetyCheck(props.content)) {
      throw new Error("Content failed safety checks. Please review and try again.");
    }
    
    const messages = createContextMessages(props);
    
    // Validate messages before sending
    if (!validateMessages(messages)) {
      throw new Error("Message validation failed");
    }
    
    const data = await callSecureOpenAI("chat/completions", messages, 0.7, "gpt-4o");
    
    if (!data) {
      return "Unable to generate a response. Please check your API key or try again later.";
    }
    
    return data.choices[0]?.message?.content || "Unable to generate a response";
    
  } catch (error) {
    console.error("Response Generation Error:", error);
    toast.error("Failed to generate AI response", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return "Error generating response. Please check your API key or try again later.";
  }
};
