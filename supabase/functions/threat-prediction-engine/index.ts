
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[THREAT-PREDICTION] Request received');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { action, entityName, timeframe, riskFactors } = await req.json();

    if (action === 'health_check') {
      return new Response(JSON.stringify({ status: 'healthy', service: 'threat-prediction-engine' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'predict_threats') {
      console.log(`[THREAT-PREDICTION] Analyzing threats for ${entityName}`);
      
      // Get historical threat data
      const { data: historicalThreats } = await supabase
        .from('scan_results')
        .select('*')
        .eq('detected_entities', entityName)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      // Get narrative clusters
      const { data: narrativeClusters } = await supabase
        .from('narrative_clusters')
        .select('*')
        .eq('entity_name', entityName)
        .order('created_at', { ascending: false })
        .limit(10);

      // Generate threat predictions
      const predictions = await generateThreatPredictions(
        entityName, 
        historicalThreats || [], 
        narrativeClusters || [],
        timeframe,
        riskFactors
      );

      // Store predictions
      for (const prediction of predictions) {
        await supabase
          .from('threat_predictions')
          .insert({
            entity_name: entityName,
            threat_type: prediction.type,
            confidence_score: prediction.confidence,
            predicted_timeframe: prediction.timeframe,
            risk_factors: prediction.riskFactors,
            mitigation_strategies: prediction.mitigationStrategies,
            prediction_model: 'aria_threat_engine_v1'
          });
      }

      return new Response(JSON.stringify({
        success: true,
        predictions: predictions,
        analysisDate: new Date().toISOString(),
        entityName: entityName
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'get_risk_assessment') {
      console.log(`[THREAT-PREDICTION] Getting risk assessment for ${entityName}`);
      
      // Get latest predictions
      const { data: predictions } = await supabase
        .from('threat_predictions')
        .select('*')
        .eq('entity_name', entityName)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('confidence_score', { ascending: false });

      // Calculate overall risk score
      const riskScore = calculateOverallRiskScore(predictions || []);
      
      return new Response(JSON.stringify({
        success: true,
        entityName: entityName,
        overallRiskScore: riskScore,
        predictions: predictions,
        lastUpdated: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[THREAT-PREDICTION] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function generateThreatPredictions(
  entityName: string, 
  historicalThreats: any[], 
  narrativeClusters: any[],
  timeframe: string = '7d',
  riskFactors: any[] = []
) {
  const predictions = [];

  // Analyze threat patterns
  const threatTypes = historicalThreats.reduce((acc, threat) => {
    const type = threat.threat_type || 'general';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Analyze narrative patterns
  const narrativeIntents = narrativeClusters.reduce((acc, cluster) => {
    if (cluster.intent_label) {
      acc[cluster.intent_label] = (acc[cluster.intent_label] || 0) + 1;
    }
    return acc;
  }, {});

  // Generate reputational threat prediction
  if (threatTypes.reputation_risk > 0 || narrativeIntents.attack > 0) {
    predictions.push({
      type: 'reputation_escalation',
      confidence: Math.min(0.95, (threatTypes.reputation_risk || 0) * 0.1 + (narrativeIntents.attack || 0) * 0.15),
      timeframe: timeframe,
      riskFactors: [
        'Historical reputation attacks',
        'Active negative narrative clusters',
        'Social media amplification patterns'
      ],
      mitigationStrategies: [
        'Deploy counter-narrative campaign',
        'Activate positive content saturation',
        'Monitor for viral risk indicators',
        'Prepare crisis response protocols'
      ]
    });
  }

  // Generate legal threat prediction
  if (narrativeIntents.legal > 0 || riskFactors.includes('legal_discussion')) {
    predictions.push({
      type: 'legal_escalation',
      confidence: Math.min(0.90, (narrativeIntents.legal || 0) * 0.2),
      timeframe: timeframe,
      riskFactors: [
        'Legal discussion clusters identified',
        'Potential defamation vectors',
        'Platform policy violation risks'
      ],
      mitigationStrategies: [
        'Prepare legal documentation',
        'Monitor for escalation triggers',
        'Engage platform support channels',
        'Document all relevant communications'
      ]
    });
  }

  // Generate viral threat prediction
  const viralRiskScore = calculateViralRisk(historicalThreats, narrativeClusters);
  if (viralRiskScore > 0.3) {
    predictions.push({
      type: 'viral_amplification',
      confidence: viralRiskScore,
      timeframe: '24h',
      riskFactors: [
        'High engagement velocity detected',
        'Cross-platform amplification',
        'Influencer involvement potential'
      ],
      mitigationStrategies: [
        'Immediate monitoring activation',
        'Rapid response team standby',
        'Counter-narrative preparation',
        'Platform relationship activation'
      ]
    });
  }

  // Generate synthetic media threat prediction
  if (riskFactors.includes('ai_generated_content')) {
    predictions.push({
      type: 'synthetic_media_threat',
      confidence: 0.75,
      timeframe: timeframe,
      riskFactors: [
        'AI-generated content detected',
        'Deepfake risk indicators',
        'Media manipulation patterns'
      ],
      mitigationStrategies: [
        'Deploy media verification protocols',
        'Activate synthetic detection systems',
        'Prepare authenticity documentation',
        'Monitor for distribution patterns'
      ]
    });
  }

  return predictions;
}

function calculateViralRisk(threats: any[], narratives: any[]): number {
  let riskScore = 0;

  // Analyze recent threat velocity
  const recentThreats = threats.filter(t => 
    new Date(t.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  );
  
  if (recentThreats.length > 5) riskScore += 0.3;
  if (recentThreats.length > 10) riskScore += 0.2;

  // Analyze narrative attack surfaces
  const attackNarratives = narratives.filter(n => 
    n.intent_label === 'attack' && n.attack_surface_score > 0.7
  );
  
  if (attackNarratives.length > 0) riskScore += 0.4;

  // Analyze platform diversity
  const platforms = new Set(threats.map(t => t.platform));
  if (platforms.size > 3) riskScore += 0.2;

  return Math.min(1.0, riskScore);
}

function calculateOverallRiskScore(predictions: any[]): number {
  if (!predictions || predictions.length === 0) return 0;

  const weightedScores = predictions.map(p => {
    const confidence = p.confidence_score || 0;
    const typeWeight = getTypeWeight(p.threat_type);
    return confidence * typeWeight;
  });

  const totalWeight = predictions.reduce((sum, p) => sum + getTypeWeight(p.threat_type), 0);
  const weightedSum = weightedScores.reduce((sum, score) => sum + score, 0);

  return totalWeight > 0 ? Math.min(1.0, weightedSum / totalWeight) : 0;
}

function getTypeWeight(threatType: string): number {
  const weights = {
    'viral_amplification': 1.0,
    'reputation_escalation': 0.8,
    'legal_escalation': 0.9,
    'synthetic_media_threat': 0.7,
    'narrative_attack': 0.6
  };
  
  return weights[threatType] || 0.5;
}
