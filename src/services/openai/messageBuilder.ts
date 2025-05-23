
import { OpenAIMessage, ResponseGenerationProps } from "./types";
import { getSystemPrompt, getClassificationPrompt } from "./prompts";

// Create context-aware messages for response generation
export const createContextMessages = (props: ResponseGenerationProps): OpenAIMessage[] => {
  const { responseType, toneStyle, content, platform, severity, threatType, language } = props;
  
  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: getSystemPrompt(responseType, toneStyle, language)
    }
  ];
  
  // Add context if available
  let userMessageContent = content;
  if (platform || severity || threatType) {
    userMessageContent = `Context: This ${severity || ""} criticism was posted on ${platform || "social media"}${threatType ? `, and has been identified as potentially ${threatType.replace(/([A-Z])/g, ' $1').toLowerCase()}` : ""}.\n\nMessage: ${content}`;
  }
  
  messages.push({
    role: 'user',
    content: userMessageContent
  });
  
  return messages;
};

// Create classification messages for the API
export const createClassificationMessages = (content: string): OpenAIMessage[] => {
  return [
    {
      role: 'system',
      content: getClassificationPrompt()
    },
    {
      role: 'user',
      content: content
    }
  ];
};
