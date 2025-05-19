
import { callOpenAI, OpenAIMessage } from "../api/openaiClient";

export interface ResponseGenerationProps {
  responseType: string;
  toneStyle: string;
  content: string;
  platform?: string;
  severity?: string;
  threatType?: string;
  language?: string;
  autoRespond?: boolean;
}

/**
 * Generates an AI-powered response for reputation management
 */
export const generateAIResponse = async (props: ResponseGenerationProps): Promise<string> => {
  const {
    responseType,
    toneStyle,
    content,
    platform,
    severity,
    threatType,
    language,
    autoRespond
  } = props;

  // Create the system message that gives context to the AI
  const systemPrompt = `You are a professional reputation management and PR expert. 
Generate a ${responseType} response to the following content, maintaining a ${toneStyle} tone.
${platform ? `This content appears on ${platform}.` : ''}
${severity ? `The severity level is: ${severity}.` : ''}
${threatType ? `The threat type identified is: ${threatType}.` : ''}
${autoRespond ? 'This is for an automated response system.' : ''}

Guidelines:
- Be concise and professional
- Address specific concerns mentioned
- Avoid generic platitudes
- Sound authentic and human
- Follow brand voice guidelines
- Keep responses under 150 words

${language && language !== 'en' ? `Respond in ${language} language.` : ''}`;

  try {
    // Define the messages for the AI
    const messages: OpenAIMessage[] = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: content
      }
    ];

    // Call the OpenAI API
    const response = await callOpenAI({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7
    });

    // Extract and return the response text
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate response");
  }
};
