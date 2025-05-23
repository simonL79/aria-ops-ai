
import { callOpenAI } from '@/services/api/openaiClient';

export async function analyzeMediaForAI(imageUrl: string) {
  try {
    const prompt = 'Analyze this image and determine if it appears to be AI-generated or digitally manipulated. Provide a confidence score as a percentage and explain your reasoning.';

    const response = await callOpenAI({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are a visual forensics expert specializing in detecting AI-generated and manipulated media. Analyze images for signs of artificial generation or digital manipulation.' 
        },
        { 
          role: 'user', 
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } }
          ] as any
        }
      ],
      temperature: 0.3
    });

    const resultText = response.choices[0].message.content || '';
    
    // Extract confidence percentage from the response
    const confidenceMatch = /(\d{1,3})%/.exec(resultText);
    const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 50;

    return {
      media_is_ai_generated: confidence > 70,
      ai_detection_confidence: confidence / 100,
      analysis_text: resultText
    };
  } catch (error) {
    console.error('Error analyzing media for AI generation:', error);
    
    // Return default values if analysis fails
    return {
      media_is_ai_generated: false,
      ai_detection_confidence: 0.5,
      analysis_text: 'Unable to analyze media due to technical error.'
    };
  }
}

export async function checkSourceCredibility({
  platform,
  url,
  content
}: {
  platform: string;
  url: string;
  content: string;
}) {
  const knownBadActors = [
    'troll_brigade_101',
    'news-fakery.com',
    'deeptruthzz.net'
  ];

  const lowerContent = content.toLowerCase();
  const isKnownBot = knownBadActors.some(actor =>
    lowerContent.includes(actor) || url.includes(actor)
  );

  const score = isKnownBot ? 0.2 : 0.9;

  return {
    source_credibility_score: score,
    credibility_flagged: isKnownBot
  };
}
