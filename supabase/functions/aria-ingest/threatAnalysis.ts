
interface ThreatAnalysis {
  threat_summary: string | null;
  threat_severity: 'LOW' | 'MEDIUM' | 'HIGH' | null;
}

export async function analyzeThreatWithOpenAI(content: string): Promise<ThreatAnalysis> {
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    console.log('[ARIA-INGEST] OpenAI API key not found, skipping threat analysis');
    return { threat_summary: null, threat_severity: null };
  }

  try {
    console.log('[ARIA-INGEST] Starting OpenAI threat analysis...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a reputation analyst. Analyze the text for reputational threats and respond in this exact format:

[THREAT_SUMMARY]: Provide a concise summary of any reputational threat in the text. Focus on negative sentiment, public allegations, damaging claims, or social backlash. If no significant threat exists, write "No significant reputational threat detected."

::SEVERITY::[SEVERITY_LEVEL]

Where SEVERITY_LEVEL must be exactly one of: LOW, MEDIUM, HIGH

- LOW: Minor negative mentions or criticism with limited impact
- MEDIUM: Moderate criticism or allegations that could affect reputation
- HIGH: Serious allegations, major scandals, or viral negative content with significant damage potential

Example response:
This post contains damaging fraud allegations against the CEO that could cause serious brand damage and requires immediate attention. ::SEVERITY::HIGH`,
          },
          {
            role: 'user',
            content: `Text: "${content}"`,
          },
        ],
        temperature: 0.4,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      console.error('[ARIA-INGEST] OpenAI API error:', response.status, response.statusText);
      return { threat_summary: null, threat_severity: null };
    }

    const data = await response.json();
    const summaryOutput = data.choices[0].message.content;
    
    console.log('[ARIA-INGEST] OpenAI response:', summaryOutput);

    // Parse the response
    const parts = summaryOutput.split('::SEVERITY::');
    
    if (parts.length !== 2) {
      console.error('[ARIA-INGEST] Invalid OpenAI response format');
      return { threat_summary: null, threat_severity: null };
    }

    const threat_summary = parts[0].trim();
    const severityPart = parts[1].trim();
    
    // Validate severity level
    const validSeverities = ['LOW', 'MEDIUM', 'HIGH'] as const;
    const threat_severity = validSeverities.includes(severityPart as any) 
      ? severityPart as 'LOW' | 'MEDIUM' | 'HIGH'
      : null;

    if (!threat_severity) {
      console.error('[ARIA-INGEST] Invalid severity level:', severityPart);
      return { threat_summary, threat_severity: null };
    }

    console.log('[ARIA-INGEST] Threat analysis complete:', { threat_summary, threat_severity });
    
    return { threat_summary, threat_severity };
    
  } catch (error) {
    console.error('[ARIA-INGEST] Error in OpenAI threat analysis:', error);
    return { threat_summary: null, threat_severity: null };
  }
}
