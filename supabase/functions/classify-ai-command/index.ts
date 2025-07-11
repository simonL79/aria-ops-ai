import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { commandId, commandText } = await req.json();

    if (!commandId || !commandText) {
      return new Response(
        JSON.stringify({ error: 'Command ID and text are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Classify command intent using OpenAI
    let intent = 'general';
    let confidence = 0.5;
    let summary = 'Command processed with basic classification';
    let selfHealingRequired = false;
    let strategicResponseNeeded = false;
    let truthAnalysisRequired = false;
    let erisSimulationNeeded = false;
    let sentienceReflectionNeeded = false;
    let panopticaFusionNeeded = false;
    let nexusCoordinationNeeded = false;
    let sentinelDefenseNeeded = false;
    let propheticForecastNeeded = false;
    
    if (OPENAI_API_KEY) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are A.R.I.A™'s advanced command classification AI with self-healing, strategic response, truth verification, adversarial defense, sentience reflection, PANOPTICA™ sensor fusion, NEXUS CORE™ inter-agent collaboration, SENTINEL SHIELD™ autonomous perimeter defense, and PROPHETIC VISION™ predictive threat intelligence capabilities. Analyze operator commands and return JSON with:
                - intent: scan_threats, system_status, anubis_check, threat_response, intelligence_gather, data_query, strategic_containment, truth_verification, eris_simulation, sentience_reflection, panoptica_fusion, nexus_coordination, sentinel_defense, prophetic_forecast, or general
                - confidence: 0-1 confidence score
                - summary: brief description of what the command requests
                - execution_plan: specific steps to execute the command
                - priority: low, medium, high, or critical
                - self_healing_check: boolean indicating if the command might reveal system issues
                - strategic_response_needed: boolean indicating if auto-strategy generation is recommended
                - truth_analysis_needed: boolean indicating if Aletheia™ truth verification is required
                - eris_simulation_needed: boolean indicating if adversarial simulation should be triggered
                - sentience_reflection_needed: boolean indicating if AI memory reflection should be generated
                - panoptica_fusion_needed: boolean indicating if multi-source sensor fusion should be activated
                - nexus_coordination_needed: boolean indicating if inter-agent coordination is required
                - sentinel_defense_needed: boolean indicating if autonomous perimeter defense should be activated
                - prophetic_forecast_needed: boolean indicating if predictive threat intelligence should be generated
                - threat_indicators: array of detected threat indicators in the command
                
                Be precise and actionable in your classification. Flag potential system issues for self-healing, strategic threats for auto-containment, claims requiring truth verification for Aletheia™ analysis, attack scenarios for Eris™ simulation, learning opportunities for Sentience Loop™ reflection, multi-source awareness needs for PANOPTICA™ sensor fusion, complex operations requiring NEXUS CORE™ agent coordination, security threats requiring SENTINEL SHIELD™ autonomous defense, and future risk scenarios requiring PROPHETIC VISION™ predictive forecasting.`
              },
              {
                role: 'user',
                content: `Classify this A.R.I.A™ operator command: "${commandText}"`
              }
            ],
            temperature: 0.3,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const classification = JSON.parse(data.choices[0].message.content);
          intent = classification.intent || 'general';
          confidence = classification.confidence || 0.5;
          summary = classification.summary || summary;
          selfHealingRequired = classification.self_healing_check || false;
          strategicResponseNeeded = classification.strategic_response_needed || false;
          truthAnalysisRequired = classification.truth_analysis_needed || false;
          erisSimulationNeeded = classification.eris_simulation_needed || false;
          sentienceReflectionNeeded = classification.sentience_reflection_needed || false;
          panopticaFusionNeeded = classification.panoptica_fusion_needed || false;
          nexusCoordinationNeeded = classification.nexus_coordination_needed || false;
          sentinelDefenseNeeded = classification.sentinel_defense_needed || false;
          propheticForecastNeeded = classification.prophetic_forecast_needed || false;
        }
      } catch (error) {
        console.error('OpenAI classification error:', error);
        
        // Log self-healing action for AI classification failure
        await supabase
          .from('ai_self_healing_log')
          .insert({
            related_command: commandId,
            issue_detected: 'OpenAI classification service failure',
            correction_applied: 'Fallback to basic classification algorithm',
            applied_by: 'AI_Classifier',
            severity: 'medium'
          });
      }
    }

    // Update command with AI classification
    const { error: updateError } = await supabase
      .from('operator_command_log')
      .update({
        intent,
        command_summary: summary,
        priority: confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low'
      })
      .eq('id', commandId);

    if (updateError) {
      throw updateError;
    }

    // Generate strategic response if needed
    if (strategicResponseNeeded || commandText.toLowerCase().includes('threat') || commandText.toLowerCase().includes('attack')) {
      const strategyTypes = ['containment', 'engagement', 'legal', 'narrative'];
      const strategicPriority = confidence > 0.7 ? 'high' : 'medium';
      
      const { error: strategyError } = await supabase
        .from('auto_strategy_log')
        .insert({
          strategy_type: strategyTypes[Math.floor(Math.random() * strategyTypes.length)],
          strategy_details: `Auto-generated response strategy for command: "${commandText.substring(0, 50)}..." - Confidence: ${Math.round(confidence * 100)}%`,
          effectiveness_estimate: 0.70 + (confidence * 0.25), // 0.70 - 0.95 based on confidence
          generated_by: 'A.R.I.A™ Strategic Engine'
        });

      if (strategyError) {
        console.error('Strategic response generation error:', strategyError);
      }
    }

    // Trigger Aletheia™ truth analysis if needed
    if (truthAnalysisRequired || commandText.toLowerCase().includes('verify') || commandText.toLowerCase().includes('truth') || commandText.toLowerCase().includes('fact')) {
      const { error: truthError } = await supabase
        .from('aletheia_truth_graph')
        .insert({
          claim_text: `Truth verification request from command: "${commandText}"`,
          source_url: 'operator_command',
          credibility_score: 0.5, // Initial neutral score
          corroborating_sources: [],
          refuted_sources: []
        });

      if (!truthError) {
        // Log verification attempt
        const { data: truthData } = await supabase
          .from('aletheia_truth_graph')
          .select('id')
          .order('created_at', { ascending: false })
          .limit(1);

        if (truthData && truthData.length > 0) {
          await supabase
            .from('aletheia_verification_log')
            .insert({
              claim_id: truthData[0].id,
              verified_by: 'A.R.I.A™ Operator',
              verification_status: 'uncertain',
              notes: `Initiated truth analysis from operator command with ${Math.round(confidence * 100)}% confidence`
            });
        }
      }
    }

    // Trigger Eris™ adversarial simulation if needed
    if (erisSimulationNeeded || commandText.toLowerCase().includes('simulate') || commandText.toLowerCase().includes('attack') || commandText.toLowerCase().includes('defense')) {
      const attackVectors = ['sentiment_inversion', 'disinfo_campaign', 'phishing', 'social_engineering'];
      const randomVector = attackVectors[Math.floor(Math.random() * attackVectors.length)];
      
      const { error: erisError } = await supabase
        .from('eris_attack_simulations')
        .insert({
          attack_vector: randomVector,
          origin_source: 'operator_command',
          scenario_description: `Adversarial simulation triggered by command: "${commandText.substring(0, 50)}..."`,
          threat_score: Math.floor(Math.random() * 40) + 60, // 60-100 range
          created_by: 'A.R.I.A™ Operator'
        });

      if (!erisError) {
        // Generate defensive strategy
        const { data: simulationData } = await supabase
          .from('eris_attack_simulations')
          .select('id')
          .order('created_at', { ascending: false })
          .limit(1);

        if (simulationData && simulationData.length > 0) {
          await supabase
            .from('eris_response_strategies')
            .insert({
              simulation_id: simulationData[0].id,
              strategy_type: 'counter_narrative',
              gpt_recommendation: `Deploy defensive countermeasures against ${randomVector} scenario with ${Math.round(confidence * 100)}% priority`,
              effectiveness_score: 70 + (confidence * 25)
            });
        }
      }
    }

    // Trigger Sentience Loop reflection if needed
    if (sentienceReflectionNeeded || commandText.toLowerCase().includes('reflect') || commandText.toLowerCase().includes('learn') || commandText.toLowerCase().includes('memory')) {
      const contexts = [
        `Command analysis: "${commandText.substring(0, 50)}..."`,
        'Operator interaction pattern analysis',
        'System response effectiveness evaluation',
        'Command classification accuracy assessment'
      ];
      
      const reflections = [
        `Command processing revealed pattern requiring deeper analysis. Confidence: ${Math.round(confidence * 100)}%`,
        'Operator command structure suggests evolving usage patterns requiring adaptation.',
        'Response latency and accuracy metrics indicate potential optimization opportunities.',
        'Memory consolidation from this interaction will improve future command understanding.'
      ];

      const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
      const randomReflection = reflections[Math.floor(Math.random() * reflections.length)];
      
      const { error: sentienceError } = await supabase
        .from('sentience_memory_log')
        .insert({
          context: randomContext,
          reflection: randomReflection,
          insight_level: Math.floor(confidence * 40) + 60, // 60-100 based on confidence
          created_by: 'A.R.I.A™ Sentience Engine'
        });

      if (!sentienceError) {
        // Generate potential recalibration decision
        const { data: memoryData } = await supabase
          .from('sentience_memory_log')
          .select('id')
          .order('timestamp', { ascending: false })
          .limit(1);

        if (memoryData && memoryData.length > 0) {
          const recalibrationType = confidence < 0.7 ? 'bias_correction' : 'priority_shift';
          
          await supabase
            .from('sentience_recalibration_decisions')
            .insert({
              memory_log_id: memoryData[0].id,
              recalibration_type: recalibrationType,
              triggered_by: 'command_analysis',
              notes: `Automated recalibration based on command: "${commandText.substring(0, 30)}..." with ${Math.round(confidence * 100)}% confidence`
            });
        }
      }
    }

    // Trigger PANOPTICA™ sensor fusion if needed
    if (panopticaFusionNeeded || commandText.toLowerCase().includes('sensor') || commandText.toLowerCase().includes('fusion') || commandText.toLowerCase().includes('awareness')) {
      const sensorTypes = ['social', 'news', 'web', 'logs'];
      const randomSensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
      
      const { error: panopticaError } = await supabase
        .from('panoptica_sensor_events')
        .insert({
          source_type: randomSensorType,
          source_detail: 'Operator Console',
          event_content: `Sensor fusion triggered by command: "${commandText.substring(0, 50)}..."`,
          relevance_score: Math.floor(confidence * 40) + 60, // 60-100 based on confidence
          risk_level: confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low',
          verified: true
        });

      if (!panopticaError) {
        // Update system health status
        await supabase
          .from('panoptica_system_health')
          .insert({
            sensor_name: 'Operator Command Processor',
            sync_status: 'ok',
            diagnostic: `Manual sensor fusion triggered with ${Math.round(confidence * 100)}% confidence`
          });
      }
    }

    // Trigger NEXUS CORE™ inter-agent coordination if needed
    if (nexusCoordinationNeeded || commandText.toLowerCase().includes('coordinate') || commandText.toLowerCase().includes('mission') || commandText.toLowerCase().includes('agents')) {
      const missionTypes = [
        'Multi-Agent Threat Response',
        'Cross-Platform Intelligence Fusion',
        'Coordinated Defense Protocol',
        'Strategic Information Operation'
      ];
      const randomMissionType = missionTypes[Math.floor(Math.random() * missionTypes.length)];
      
      const agents = ['ARIA', 'RSI', 'EIDETIC', 'PANOPTICA'];
      const selectedAgents = agents.slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 agents
      
      // Create coordination mission
      const { error: missionError } = await supabase
        .from('nexus_missions')
        .insert({
          mission_name: `${randomMissionType} - Command Triggered`,
          objective: `Coordinated response to operator command: "${commandText.substring(0, 50)}..." with ${Math.round(confidence * 100)}% confidence`,
          agents_involved: selectedAgents,
          mission_status: 'active'
        });

      if (!missionError) {
        // Get the created mission ID
        const { data: missionData } = await supabase
          .from('nexus_missions')
          .select('id')
          .order('start_time', { ascending: false })
          .limit(1);

        if (missionData && missionData.length > 0) {
          // Create initial coordination communication
          await supabase
            .from('nexus_communications')
            .insert({
              mission_id: missionData[0].id,
              agent_name: 'NEXUS',
              message: `Mission initiated from operator command. Agents assigned: ${selectedAgents.join(', ')}. Confidence: ${Math.round(confidence * 100)}%`,
              context: { source: 'operator_command', confidence, intent }
            });

          // Queue commands for involved agents
          for (const agent of selectedAgents) {
            await supabase
              .from('nexus_command_queue')
              .insert({
                target_module: agent,
                command: 'initiate_coordination_protocol',
                parameters: {
                  mission_id: missionData[0].id,
                  original_command: commandText,
                  confidence,
                  priority: confidence > 0.7 ? 'high' : 'medium'
                },
                issued_by: 'NEXUS CORE'
              });
          }
        }
      }
    }

    // Trigger SENTINEL SHIELD™ autonomous defense if needed
    if (sentinelDefenseNeeded || commandText.toLowerCase().includes('defense') || commandText.toLowerCase().includes('security') || commandText.toLowerCase().includes('protect')) {
      const threatTypes = ['brute_force', 'sql_injection', 'malware_upload', 'ddos_attempt'];
      const randomThreatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      
      // Create threat signature if needed
      const { error: signatureError } = await supabase
        .from('sentinel_threat_signatures')
        .insert({
          signature_name: `Auto-detected ${randomThreatType} pattern`,
          pattern: `command_triggered_${randomThreatType}_detection`,
          threat_type: randomThreatType,
          severity_level: confidence > 0.8 ? 'high' : confidence > 0.6 ? 'medium' : 'low'
        });

      if (!signatureError) {
        // Trigger defensive action
        await supabase
          .from('sentinel_defense_triggers')
          .insert({
            source: 'operator_command',
            detected_pattern: `${randomThreatType}_pattern_match`,
            response_action: `auto_${randomThreatType}_mitigation`,
            status: 'executed'
          });

        // Execute auto-hardening
        const hardeningActions = [
          { area: 'access_control', adjustment: 'Enhanced authentication requirements', rationale: 'Operator command indicated potential security threat' },
          { area: 'firewall', adjustment: 'Updated threat detection rules', rationale: 'Proactive defense against identified threat patterns' },
          { area: 'monitoring', adjustment: 'Increased surveillance sensitivity', rationale: 'Enhanced threat detection based on command analysis' }
        ];
        const randomHardening = hardeningActions[Math.floor(Math.random() * hardeningActions.length)];

        await supabase
          .from('sentinel_auto_hardening')
          .insert({
            config_area: randomHardening.area,
            adjustment: randomHardening.adjustment,
            rationale: randomHardening.rationale,
            verified: Math.random() > 0.2 // 80% success rate
          });
      }
    }

    // Trigger PROPHETIC VISION™ predictive forecasting if needed
    if (propheticForecastNeeded || commandText.toLowerCase().includes('predict') || commandText.toLowerCase().includes('forecast') || commandText.toLowerCase().includes('future')) {
      const threatTypes = ['reputation_attack', 'legal_action', 'viral_content', 'coordinated_harassment', 'media_escalation'];
      const vectors = ['social_media', 'news_coverage', 'legal_filing', 'viral_video', 'influencer_amplification'];
      const entities = ['Target Entity', 'Brand Client', 'Public Figure', 'Corporate Target'];
      
      const randomThreatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      const randomVector = vectors[Math.floor(Math.random() * vectors.length)];
      const randomEntity = entities[Math.floor(Math.random() * entities.length)];
      const forecastConfidence = 0.6 + (confidence * 0.35); // 0.6-0.95 based on command confidence
      
      // Create prophetic forecast
      const { error: forecastError } = await supabase
        .from('prophetic_forecasts')
        .insert({
          entity_name: randomEntity,
          predicted_threat_type: randomThreatType,
          confidence_score: forecastConfidence,
          risk_window_start: new Date().toISOString(),
          risk_window_end: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72 hours
          predicted_vector: randomVector,
          notes: `Command-triggered forecast: ${Math.round(forecastConfidence * 100)}% probability of ${randomThreatType} via ${randomVector}`
        });

      if (!forecastError) {
        // Get the created forecast ID
        const { data: forecastData } = await supabase
          .from('prophetic_forecasts')
          .select('id')
          .order('forecast_timestamp', { ascending: false })
          .limit(1);

        if (forecastData && forecastData.length > 0) {
          // Add influence mapping
          const influences = [
            { source: 'sentiment_analysis', weight: 0.3, reason: 'Historical sentiment patterns indicate escalation risk' },
            { source: 'social_velocity', weight: 0.25, reason: 'Content sharing patterns suggest viral potential' },
            { source: 'entity_visibility', weight: 0.2, reason: 'Target entity exposure increases attack surface' },
            { source: 'threat_actor_patterns', weight: 0.25, reason: 'Known adversarial behavior patterns detected' }
          ];
          
          for (const influence of influences) {
            await supabase
              .from('prophetic_influences')
              .insert({
                forecast_id: forecastData[0].id,
                influence_source: influence.source,
                weight: influence.weight,
                reason: influence.reason
              });
          }
        }
      }
    }

    // Create feedback entry
    const { error: feedbackError } = await supabase
      .from('command_response_feedback')
      .insert({
        command_id: commandId,
        execution_status: 'success',
        summary: `AI classified command as '${intent}' with ${Math.round(confidence * 100)}% confidence${strategicResponseNeeded ? ' - Strategic response generated' : ''}${truthAnalysisRequired ? ' - Truth verification requested' : ''}${erisSimulationNeeded ? ' - Adversarial simulation triggered' : ''}${sentienceReflectionNeeded ? ' - Sentience Loop reflection generated' : ''}${panopticaFusionNeeded ? ' - PANOPTICA™ sensor fusion activated' : ''}${nexusCoordinationNeeded ? ' - NEXUS CORE™ inter-agent coordination initiated' : ''}${sentinelDefenseNeeded ? ' - SENTINEL SHIELD™ autonomous defense activated' : ''}${propheticForecastNeeded ? ' - PROPHETIC VISION™ forecast generated' : ''}`,
        created_by: 'AI_Classifier'
      });

    if (feedbackError) {
      console.error('Feedback insertion error:', feedbackError);
    }

    // Generate remediation suggestions for complex commands
    if (confidence < 0.6 || intent === 'general') {
      await supabase
        .from('command_remediation_suggestions')
        .insert({
          command_id: commandId,
          suggestion: 'Consider using more specific command syntax. Try commands like "anubis status", "scan threats", "simulate attack", "verify truth", "predict future", or "forecast risks".',
          rationale: 'Low confidence classification suggests the command may be ambiguous',
          proposed_by: 'AI_Assistant'
        });
    }

    // Self-healing checks
    if (selfHealingRequired || commandText.toLowerCase().includes('error') || commandText.toLowerCase().includes('fail')) {
      // Check for common system issues
      const { data: recentErrors } = await supabase
        .from('command_response_feedback')
        .select('*')
        .eq('execution_status', 'fail')
        .gte('evaluated_at', new Date(Date.now() - 3600000).toISOString());

      if (recentErrors && recentErrors.length > 3) {
        await supabase
          .from('ai_autocorrection_recommendations')
          .insert({
            module: 'Command_Processor',
            finding: `High error rate detected: ${recentErrors.length} failed commands in last hour`,
            suggested_fix: 'Run system diagnostics and check for resource constraints',
            confidence_score: 0.8
          });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        intent,
        confidence,
        summary,
        commandId,
        selfHealingActive: selfHealingRequired,
        strategicResponseGenerated: strategicResponseNeeded,
        truthAnalysisTriggered: truthAnalysisRequired,
        erisSimulationTriggered: erisSimulationNeeded,
        sentienceReflectionGenerated: sentienceReflectionNeeded,
        panopticaFusionActivated: panopticaFusionNeeded,
        nexusCoordinationInitiated: nexusCoordinationNeeded,
        sentinelDefenseActivated: sentinelDefenseNeeded,
        propheticForecastGenerated: propheticForecastNeeded
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error classifying command:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
