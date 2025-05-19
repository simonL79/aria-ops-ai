
import { toast } from "sonner";
import { callOpenAI } from "../api/openaiClient";

// Create SEO-optimized content
export const generateSeoContent = async (
  keyword: string,
  title?: string,
  wordCount: number = 1000
): Promise<{ title: string, content: string }> => {
  try {
    const prompt = `Generate SEO-optimized content about "${keyword}" ${title ? `with the title "${title}"` : ''}.
    The content should be ${wordCount} words long and include:
    1. An engaging headline if not provided
    2. Strategic use of primary and LSI keywords
    3. Headings and subheadings in a logical structure
    4. Meta description for the content
    
    Format the response as properly formatted markdown with # for main heading, ## for subheadings, etc.`;
    
    const messages = [
      {
        role: 'system' as const,
        content: 'You are an expert SEO content creator that specializes in creating content that ranks highly in search engines.'
      },
      {
        role: 'user' as const,
        content: prompt
      }
    ];
    
    const data = await callOpenAI({
      model: "gpt-4o",
      messages,
      temperature: 0.7
    });
    
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
