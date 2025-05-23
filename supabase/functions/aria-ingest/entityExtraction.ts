
// Extract entities from text using OpenAI
export async function extractEntities(text: string, apiKey: string) {
  const prompt = `
Extract all people, organizations, and social handles from the following text.

Return ONLY a JSON array with no additional formatting or markdown. Use this exact format:
[
  { "name": "Jane Doe", "type": "PERSON" },
  { "name": "ACME Corp", "type": "ORG" },
  { "name": "@janedoe", "type": "SOCIAL" }
]

Text:
"""${text}"""
`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using the more efficient mini model
        messages: [
          { role: 'system', content: 'You are an entity extraction assistant. Return only valid JSON arrays with no markdown formatting.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('OpenAI API error:', errorData);
      return [];
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? '[]';
    
    // Clean the response - remove markdown code blocks if present
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```json')) {
      cleanedContent = cleanedContent.replace(/^```json\s*/, '');
    }
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```\s*/, '');
    }
    if (cleanedContent.endsWith('```')) {
      cleanedContent = cleanedContent.replace(/\s*```$/, '');
    }
    
    try {
      const entities = JSON.parse(cleanedContent);
      console.log('Successfully parsed entities:', entities);
      return Array.isArray(entities) ? entities : [];
    } catch (e) {
      console.error('Error parsing cleaned OpenAI response:', e, 'Cleaned content was:', cleanedContent);
      return [];
    }
  } catch (error) {
    console.error('Error in entity extraction:', error);
    return [];
  }
}
