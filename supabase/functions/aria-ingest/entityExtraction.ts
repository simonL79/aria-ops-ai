
// Extract entities from text using OpenAI
export async function extractEntities(text: string, apiKey: string) {
  const prompt = `
Extract all people, organizations, and social handles from the following text.

Return in JSON format like:
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
          { role: 'system', content: 'You are an entity extraction assistant.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('OpenAI API error:', errorData);
      return [];
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content ?? '[]';
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('Error parsing OpenAI response:', e, 'Response was:', content);
      return [];
    }
  } catch (error) {
    console.error('Error in entity extraction:', error);
    return [];
  }
}
