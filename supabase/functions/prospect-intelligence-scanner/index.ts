
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('[PROSPECT-INTEL] Request received');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { action, targetEntity, scanDepth, platforms } = await req.json();

    if (action === 'health_check') {
      return new Response(JSON.stringify({ status: 'healthy', service: 'prospect-intelligence-scanner' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'scan_prospect') {
      console.log(`[PROSPECT-INTEL] Scanning prospect: ${targetEntity}`);
      
      // Perform multi-platform intelligence gathering
      const intelligenceResults = await gatherProspectIntelligence(
        targetEntity, 
        scanDepth || 'standard',
        platforms || ['social', 'news', 'business', 'legal']
      );

      // Analyze and score the prospect
      const prospectProfile = await analyzeProspectProfile(targetEntity, intelligenceResults);

      // Store results
      const { data: prospect, error } = await supabase
        .from('prospect_intelligence')
        .insert({
          entity_name: targetEntity,
          scan_depth: scanDepth,
          platforms_scanned: platforms,
          intelligence_data: intelligenceResults,
          prospect_score: prospectProfile.score,
          risk_indicators: prospectProfile.riskIndicators,
          opportunity_indicators: prospectProfile.opportunityIndicators,
          recommended_approach: prospectProfile.recommendedApproach,
          scan_status: 'completed'
        })
        .select()
        .single();

      if (error) {
        console.error('[PROSPECT-INTEL] Database error:', error);
        throw error;
      }

      return new Response(JSON.stringify({
        success: true,
        prospect: prospect,
        intelligence: intelligenceResults,
        profile: prospectProfile
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (action === 'get_prospect_profile') {
      console.log(`[PROSPECT-INTEL] Getting profile for: ${targetEntity}`);
      
      const { data: prospect } = await supabase
        .from('prospect_intelligence')
        .select('*')
        .eq('entity_name', targetEntity)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return new Response(JSON.stringify({
        success: true,
        prospect: prospect
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[PROSPECT-INTEL] Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function gatherProspectIntelligence(
  targetEntity: string, 
  scanDepth: string, 
  platforms: string[]
) {
  const intelligence = {
    socialMedia: {},
    businessIntel: {},
    newsPresence: {},
    legalRecords: {},
    digitalFootprint: {}
  };

  // Social media intelligence
  if (platforms.includes('social')) {
    intelligence.socialMedia = await gatherSocialIntelligence(targetEntity, scanDepth);
  }

  // Business intelligence
  if (platforms.includes('business')) {
    intelligence.businessIntel = await gatherBusinessIntelligence(targetEntity, scanDepth);
  }

  // News and media presence
  if (platforms.includes('news')) {
    intelligence.newsPresence = await gatherNewsIntelligence(targetEntity, scanDepth);
  }

  // Legal records
  if (platforms.includes('legal')) {
    intelligence.legalRecords = await gatherLegalIntelligence(targetEntity, scanDepth);
  }

  // Digital footprint analysis
  intelligence.digitalFootprint = await analyzeDigitalFootprint(targetEntity, scanDepth);

  return intelligence;
}

async function gatherSocialIntelligence(targetEntity: string, scanDepth: string) {
  // Simulate social media intelligence gathering
  return {
    platforms: ['LinkedIn', 'Twitter', 'Facebook', 'Instagram'],
    followerCounts: {
      linkedin: Math.floor(Math.random() * 10000),
      twitter: Math.floor(Math.random() * 5000),
      facebook: Math.floor(Math.random() * 2000),
      instagram: Math.floor(Math.random() * 3000)
    },
    engagementRates: {
      linkedin: (Math.random() * 0.1).toFixed(3),
      twitter: (Math.random() * 0.05).toFixed(3),
      facebook: (Math.random() * 0.08).toFixed(3),
      instagram: (Math.random() * 0.12).toFixed(3)
    },
    recentActivity: [
      {
        platform: 'LinkedIn',
        type: 'post',
        engagement: Math.floor(Math.random() * 100),
        sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    influenceScore: (Math.random() * 100).toFixed(1),
    networkQuality: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
  };
}

async function gatherBusinessIntelligence(targetEntity: string, scanDepth: string) {
  return {
    companySize: Math.random() > 0.5 ? 'enterprise' : Math.random() > 0.3 ? 'mid-market' : 'startup',
    industry: 'Technology', // Could be determined from actual data
    revenue: {
      estimated: `$${Math.floor(Math.random() * 100)}M`,
      confidence: (Math.random() * 0.4 + 0.6).toFixed(2)
    },
    employees: Math.floor(Math.random() * 1000) + 10,
    fundingHistory: [
      {
        round: 'Series A',
        amount: `$${Math.floor(Math.random() * 50)}M`,
        date: '2023',
        investors: ['Venture Capital Firm']
      }
    ],
    competitivePosition: Math.random() > 0.6 ? 'leader' : Math.random() > 0.3 ? 'challenger' : 'follower',
    riskFactors: []
  };
}

async function gatherNewsIntelligence(targetEntity: string, scanDepth: string) {
  return {
    mediaPresence: {
      total_mentions: Math.floor(Math.random() * 100),
      sentiment_breakdown: {
        positive: Math.floor(Math.random() * 60),
        neutral: Math.floor(Math.random() * 30),
        negative: Math.floor(Math.random() * 10)
      },
      recent_coverage: [
        {
          title: `${targetEntity} announces new initiative`,
          source: 'Tech News',
          sentiment: 'positive',
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          reach: Math.floor(Math.random() * 10000)
        }
      ]
    },
    thoughtLeadership: {
      speaking_engagements: Math.floor(Math.random() * 10),
      published_articles: Math.floor(Math.random() * 20),
      media_interviews: Math.floor(Math.random() * 15)
    },
    crisis_indicators: []
  };
}

async function gatherLegalIntelligence(targetEntity: string, scanDepth: string) {
  return {
    litigation_history: [],
    regulatory_compliance: 'good',
    intellectual_property: {
      patents: Math.floor(Math.random() * 50),
      trademarks: Math.floor(Math.random() * 20),
      copyrights: Math.floor(Math.random() * 100)
    },
    legal_risk_score: (Math.random() * 0.3).toFixed(2),
    compliance_flags: []
  };
}

async function analyzeDigitalFootprint(targetEntity: string, scanDepth: string) {
  return {
    domain_authority: Math.floor(Math.random() * 100),
    seo_visibility: (Math.random() * 100).toFixed(1),
    digital_assets: [
      'company_website',
      'linkedin_profile',
      'twitter_account'
    ],
    security_posture: Math.random() > 0.7 ? 'strong' : Math.random() > 0.4 ? 'moderate' : 'weak',
    data_exposure_risk: (Math.random() * 0.5).toFixed(2)
  };
}

async function analyzeProspectProfile(targetEntity: string, intelligence: any) {
  const profile = {
    score: 0,
    riskIndicators: [],
    opportunityIndicators: [],
    recommendedApproach: 'standard'
  };

  // Calculate prospect score based on various factors
  let score = 50; // Base score

  // Social media factors
  if (intelligence.socialMedia.influenceScore > 70) {
    score += 15;
    profile.opportunityIndicators.push('High social media influence');
  }

  // Business factors
  if (intelligence.businessIntel.companySize === 'enterprise') {
    score += 20;
    profile.opportunityIndicators.push('Enterprise-level prospect');
  }

  // News presence factors
  if (intelligence.newsPresence.mediaPresence.total_mentions > 50) {
    score += 10;
    profile.opportunityIndicators.push('Strong media presence');
  }

  // Risk factors
  if (intelligence.newsPresence.mediaPresence.sentiment_breakdown.negative > 20) {
    score -= 15;
    profile.riskIndicators.push('Negative media sentiment detected');
  }

  if (intelligence.legalRecords.legal_risk_score > 0.2) {
    score -= 10;
    profile.riskIndicators.push('Legal risk indicators present');
  }

  // Digital security factors
  if (intelligence.digitalFootprint.security_posture === 'weak') {
    score -= 5;
    profile.riskIndicators.push('Weak digital security posture');
  }

  profile.score = Math.max(0, Math.min(100, score));

  // Determine recommended approach
  if (profile.score > 80) {
    profile.recommendedApproach = 'high_priority';
  } else if (profile.score < 30 || profile.riskIndicators.length > 2) {
    profile.recommendedApproach = 'cautious';
  } else {
    profile.recommendedApproach = 'standard';
  }

  return profile;
}
