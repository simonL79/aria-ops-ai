import { useState } from 'react';
import { toast } from 'sonner';
import { AnubisSecurityService } from '@/services/aria/anubisSecurityService';
import { AnubisService } from '@/services/aria/anubisService';
import { multilingualThreatService } from '@/services/aria/multilingualThreatService';
import { useAuth } from '@/hooks/useAuth';

export const useAnubisControl = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const { user } = useAuth();

  const runDiagnostic = async () => {
    if (!user) {
      toast.error('Authentication required');
      return;
    }

    setIsLoading(true);
    setStatus('🧠 Running comprehensive diagnostics...');

    try {
      const result = await AnubisService.runDiagnostics();
      if (result) {
        setStatus(`✅ Diagnostic completed. Status: ${result.overall_status}`);
        toast.success('System diagnostics completed successfully');
      } else {
        setStatus('❌ Diagnostic failed');
        toast.error('Failed to run system diagnostics');
      }
    } catch (error) {
      console.error('Diagnostic error:', error);
      setStatus('❌ Failed to run diagnostic');
      toast.error('Diagnostic execution failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logHotword = async (phrase: string, triggered: boolean = true) => {
    if (!user) {
      toast.error('Authentication required');
      return;
    }

    try {
      const success = await AnubisSecurityService.logSecurityEvent(
        'hotword_detected',
        `Hotword phrase: "${phrase}" - Triggered: ${triggered}`,
        'medium'
      );

      if (success) {
        setStatus(`🎤 Hotword logged: "${phrase}"`);
        toast.success('Hotword event logged');
      } else {
        setStatus('❌ Failed to log hotword');
        toast.error('Failed to log hotword event');
      }
    } catch (error) {
      console.error('Hotword logging error:', error);
      toast.error('Hotword logging failed');
    }
  };

  const logSlackEvent = async (channel: string, eventType: string, payload: any) => {
    try {
      const success = await AnubisSecurityService.queueSlackEvent({
        channel,
        event_type: eventType,
        payload
      });

      if (success) {
        setStatus(`📢 Slack event queued for ${channel}`);
        toast.success('Slack event queued successfully');
      } else {
        setStatus('❌ Failed to queue Slack event');
        toast.error('Failed to queue Slack event');
      }
    } catch (error) {
      console.error('Slack event error:', error);
      toast.error('Slack event queueing failed');
    }
  };

  const pushTestResult = async (
    module: string, 
    testName: string, 
    passed: boolean, 
    executionTime: number, 
    errorMessage?: string
  ) => {
    try {
      const success = await AnubisSecurityService.logTestResult({
        module,
        test_name: testName,
        passed,
        execution_time_ms: executionTime,
        error_message: errorMessage
      });

      if (success) {
        setStatus(`📊 Test result logged: ${module}/${testName} - ${passed ? 'PASS' : 'FAIL'}`);
        toast.success('Test result logged');
      } else {
        setStatus('❌ Failed to log test result');
        toast.error('Failed to log test result');
      }
    } catch (error) {
      console.error('Test result error:', error);
      toast.error('Test result logging failed');
    }
  };

  const registerMobileDevice = async (
    deviceName: string, 
    platform: 'iOS' | 'Android' | 'WebApp', 
    pushToken?: string
  ) => {
    if (!user) {
      toast.error('Authentication required');
      return;
    }

    try {
      const success = await AnubisSecurityService.registerMobileSession({
        user_id: user.id,
        device_name: deviceName,
        platform,
        push_token: pushToken
      });

      if (success) {
        setStatus(`📱 Mobile session registered: ${deviceName} (${platform})`);
        toast.success('Mobile session registered');
      } else {
        setStatus('❌ Failed to register mobile session');
        toast.error('Failed to register mobile session');
      }
    } catch (error) {
      console.error('Mobile registration error:', error);
      toast.error('Mobile session registration failed');
    }
  };

  const logAIAttack = async (
    source: string, 
    prompt: string, 
    attackVector: string, 
    confidenceScore: number, 
    mitigationAction?: string
  ) => {
    try {
      const success = await AnubisSecurityService.logAIAttack({
        source,
        prompt,
        attack_vector: attackVector,
        confidence_score: confidenceScore,
        mitigation_action: mitigationAction
      });

      if (success) {
        setStatus(`🚨 AI attack logged: ${attackVector} (${Math.round(confidenceScore * 100)}% confidence)`);
        toast.error('AI attack detected and logged');
      } else {
        setStatus('❌ Failed to log AI attack');
        toast.error('Failed to log AI attack');
      }
    } catch (error) {
      console.error('AI attack logging error:', error);
      toast.error('AI attack logging failed');
    }
  };

  const getSecurityMetrics = async () => {
    try {
      const metrics = await AnubisSecurityService.getSecurityMetrics();
      setStatus(`📈 Security metrics: ${metrics.attacksDetected} attacks, ${metrics.activeSessions} sessions`);
      return metrics;
    } catch (error) {
      console.error('Security metrics error:', error);
      toast.error('Failed to fetch security metrics');
      return null;
    }
  };

  const logMultilingualThreat = async (
    originalText: string,
    languageCode: string,
    translatedText?: string
  ) => {
    try {
      const success = await multilingualThreatService.logMultilingualThreat({
        original_text: originalText,
        language_code: languageCode,
        translated_text: translatedText
      });

      if (success) {
        setStatus(`🌍 Multilingual threat logged: ${languageCode}`);
        toast.success('Multilingual threat logged successfully');
      } else {
        setStatus('❌ Failed to log multilingual threat');
        toast.error('Failed to log multilingual threat');
      }
    } catch (error) {
      console.error('Multilingual threat logging error:', error);
      toast.error('Multilingual threat logging failed');
    }
  };

  const deployDarkWebAgent = async (
    agentAlias: string,
    missionType: 'surveillance' | 'interaction' | 'bait' | 'extraction',
    targetActor?: string
  ) => {
    try {
      const success = await multilingualThreatService.deployDarkWebAgent({
        agent_alias: agentAlias,
        mission_type: missionType,
        target_actor: targetActor
      });

      if (success) {
        setStatus(`🕵️‍♂️ Dark web agent deployed: ${agentAlias} (${missionType})`);
        toast.success('Dark web agent deployed successfully');
      } else {
        setStatus('❌ Failed to deploy dark web agent');
        toast.error('Failed to deploy dark web agent');
      }
    } catch (error) {
      console.error('Dark web agent deployment error:', error);
      toast.error('Dark web agent deployment failed');
    }
  };

  const logLLMWatchdog = async (
    model: 'gpt-4' | 'claude' | 'gemini' | 'mistral' | 'other',
    perceptionSummary: string,
    containsBias = false,
    hallucinationDetected = false,
    threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ) => {
    try {
      const success = await multilingualThreatService.logLLMWatchdog({
        llm_model: model,
        perception_summary: perceptionSummary,
        contains_bias: containsBias,
        hallucination_detected: hallucinationDetected,
        threat_level: threatLevel
      });

      if (success) {
        setStatus(`🤖 LLM watchdog alert logged: ${model} (${threatLevel})`);
        if (containsBias || hallucinationDetected) {
          toast.error(`LLM issue detected in ${model}`);
        } else {
          toast.success('LLM watchdog logged successfully');
        }
      } else {
        setStatus('❌ Failed to log LLM watchdog');
        toast.error('Failed to log LLM watchdog');
      }
    } catch (error) {
      console.error('LLM watchdog logging error:', error);
      toast.error('LLM watchdog logging failed');
    }
  };

  const getIntelligenceMetrics = async () => {
    try {
      const metrics = await multilingualThreatService.getIntelligenceMetrics();
      setStatus(`📊 Intelligence metrics: ${metrics.activeAgents} agents, ${metrics.biasDetections} bias alerts`);
      return metrics;
    } catch (error) {
      console.error('Intelligence metrics error:', error);
      toast.error('Failed to fetch intelligence metrics');
      return null;
    }
  };

  return {
    // Core functions
    runDiagnostic,
    logHotword,
    logSlackEvent,
    pushTestResult,
    registerMobileDevice,
    logAIAttack,
    getSecurityMetrics,
    
    // New intelligence functions
    logMultilingualThreat,
    deployDarkWebAgent,
    logLLMWatchdog,
    getIntelligenceMetrics,
    
    // State
    isLoading,
    status,
    setStatus
  };
};
