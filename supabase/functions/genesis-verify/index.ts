
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerificationRequest {
  entity_name: string;
  verification_type: string;
  known_details?: string;
}

interface VerificationResult {
  entity_name: string;
  verification_type: string;
  risk_score: number;
  status: 'clean' | 'flagged' | 'pending';
  flags: string[];
  recommendation: string;
  evidence_urls: string[];
  confidence_score: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { entity_name, verification_type, known_details }: VerificationRequest = await req.json();

    console.log(`Starting Genesis verification for: ${entity_name} (${verification_type})`);

    // Simulate comprehensive verification process
    const verificationResult = await performVerification(entity_name, verification_type, known_details);

    // Store verification result in database
    const { data: storedResult, error: storeError } = await supabase
      .from('genesis_verification_results')
      .insert({
        entity_name,
        verification_type,
        risk_score: verificationResult.risk_score,
        status: verificationResult.status,
        flags: verificationResult.flags,
        recommendation: verificationResult.recommendation,
        evidence_urls: verificationResult.evidence_urls,
        confidence_score: verificationResult.confidence_score,
        known_details
      })
      .select()
      .single();

    if (storeError) {
      console.error('Error storing verification result:', storeError);
    }

    // If flagged, create notification
    if (verificationResult.status === 'flagged') {
      await supabase
        .from('aria_notifications')
        .insert({
          entity_name,
          event_type: 'preemptive_verification_flag',
          summary: `High-risk entity flagged during ${verification_type} verification`,
          priority: verificationResult.risk_score >= 80 ? 'critical' : 'high'
        });
    }

    return new Response(
      JSON.stringify({
        success: true,
        result: verificationResult,
        stored_id: storedResult?.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Genesis verification error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function performVerification(
  entityName: string, 
  verificationType: string, 
  knownDetails?: string
): Promise<VerificationResult> {
  
  console.log(`Performing verification checks for ${entityName}`);
  
  // Initialize result
  let riskScore = 0;
  const flags: string[] = [];
  const evidenceUrls: string[] = [];
  
  // Simulate company registry checks
  if (entityName.toLowerCase().includes('crypto') || entityName.toLowerCase().includes('offshore')) {
    riskScore += 30;
    flags.push('High-risk industry sector');
    evidenceUrls.push('https://example.com/crypto-regulatory-risk');
  }
  
  // Simulate director/person checks
  if (entityName.toLowerCase().includes('smith') || entityName.toLowerCase().includes('john')) {
    // Common names might have more historical data
    riskScore += 10;
  }
  
  // Simulate litigation history checks
  if (Math.random() > 0.7) {
    riskScore += 25;
    flags.push('Historical litigation involvement');
    evidenceUrls.push('https://example.com/court-records');
  }
  
  // Simulate media sentiment analysis
  if (Math.random() > 0.6) {
    riskScore += 15;
    flags.push('Negative media coverage detected');
    evidenceUrls.push('https://example.com/media-analysis');
  }
  
  // Simulate regulatory compliance checks
  if (verificationType === 'ma_diligence' && Math.random() > 0.8) {
    riskScore += 20;
    flags.push('Regulatory compliance concerns');
    evidenceUrls.push('https://example.com/regulatory-filing');
  }
  
  // Determine status and recommendation
  let status: 'clean' | 'flagged' | 'pending';
  let recommendation: string;
  
  if (riskScore >= 60) {
    status = 'flagged';
    if (riskScore >= 80) {
      recommendation = 'Escalate - High risk, recommend avoiding engagement';
    } else {
      recommendation = 'Monitor - Proceed with enhanced due diligence';
    }
  } else {
    status = 'clean';
    recommendation = 'Clean - No significant risk indicators found';
  }
  
  // Confidence score based on available data
  const confidenceScore = Math.min(95, 60 + (flags.length * 10));
  
  return {
    entity_name: entityName,
    verification_type: verificationType,
    risk_score: Math.min(100, riskScore),
    status,
    flags,
    recommendation,
    evidence_urls: evidenceUrls,
    confidence_score: confidenceScore
  };
}
