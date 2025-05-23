
import { toast } from "sonner";
import { contentSafetyCheck } from "../secureApiService";
import { callSecureOpenAI, validateMessages } from "./client";
import { OpenAIMessage } from "./types";

// Create SEO-optimized content
export const generateSeoContent = async (
  keyword: string,
  title?: string,
  wordCount: number = 1000
): Promise<{ title: string, content: string }> => {
  try {
    // Security check on input
    if (!contentSafetyCheck(keyword) || (title && !contentSafetyCheck(title))) {
      throw new Error("Content failed safety checks. Please review and try again.");
    }
    
    const prompt = `Generate SEO-optimized content about "${keyword}" ${title ? `with the title "${title}"` : ''}.
    The content should be ${wordCount} words long and include:
    1. An engaging headline if not provided
    2. Strategic use of primary and LSI keywords
    3. Headings and subheadings in a logical structure
    4. Meta description for the content
    
    Format the response as properly formatted markdown with # for main heading, ## for subheadings, etc.`;
    
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: 'You are an expert SEO content creator that specializes in creating content that ranks highly in search engines.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];
    
    // Validate messages before sending
    if (!validateMessages(messages)) {
      throw new Error("Message validation failed");
    }
    
    const data = await callSecureOpenAI("chat/completions", messages, 0.7, "gpt-4o");
    
    if (!data) {
      throw new Error("Failed to generate content. Please check your API key.");
    }
    
    const content = data.choices[0]?.message?.content || "";
    
    // Extract title from the content if it was generated
    const titleMatch = content.match(/^#\s(.+)$/m);
    const extractedTitle = titleMatch ? titleMatch[1] : title || keyword;
    
    return {
      title: extractedTitle,
      content: content
    };
    
  } catch (error) {
    console.error("SEO Content Generation Error:", error);
    toast.error("Failed to generate SEO content", {
      description: error instanceof Error ? error.message : "Unknown error occurred"
    });
    return {
      title: title || keyword,
      content: "Error generating SEO content. Please check your API key or try again later."
    };
  }
};
