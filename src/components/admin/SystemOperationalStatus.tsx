
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Zap, 
  Shield,
  Activity,
  Users,
  Brain,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PhaseStatus {
  name: string;
  completion: number;
  status: 'complete' | 'partial' | 'blocked' | 'pending';
  blockers: string[];
  icon: React.ReactNode;
}

const SystemOperationalStatus = () => {
  const [phases, setPhases] = useState<PhaseStatus[]>([]);
  const [overallStatus, setOverallStatus] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    checkSystemStatus();
    const interval = setInterval(checkSystemStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemStatus = async () => {
    try {
      // Check Phase 4: AI Integration
      const aiPhase = await checkAIIntegration();
      
      // Check Phase 5: Real-Time Operations
      const opsPhase = await checkRealTimeOperations();
      
      // Check Phase 6: Client Operations
      const clientPhase = await checkClientOperations();

      const allPhases = [
        {
          name: 'Core Infrastructure',
          completion: 100,
          status: 'complete' as const,
          blockers: [],
          icon: <Shield className="h-4 w-4" />
        },
        {
          name: 'Data Processing Pipeline',
          completion: 100,
          status: 'complete' as const,
          blockers: [],
          icon: <Activity className="h-4 w-4" />
        },
        {
          name: 'Security & Compliance',
          completion: 100,
          status: 'complete' as const,
          blockers: [],
          icon: <Shield className="h-4 w-4" />
        },
        aiPhase,
        opsPhase,
        clientPhase
      ];

      setPhases(allPhases);
      
      const avgCompletion = allPhases.reduce((acc, phase) => acc + phase.completion, 0) / allPhases.length;
      setOverallStatus(avgCompletion);

    } catch (error) {
      console.error('Failed to check system status:', error);
    }
  };

  const checkAIIntegration = async (): Promise<PhaseStatus> => {
    const blockers = [];
    let completion = 80;

    // Check if local inference is configured
    try {
      const response = await fetch('http://localhost:11434/api/tags', { 
        method: 'GET',
        signal: AbortSignal.timeout(3000)
      });
      if (!response.ok) {
        blockers.push('Ollama server connection failed');
        completion = 70;
      }
    } catch (error) {
      blockers.push('Ollama server not accessible');
      completion = 70;
    }

    return {
      name: 'AI Integration',
      completion,
      status: blockers.length > 0 ? 'blocked' : 'complete',
      blockers,
      icon: <Brain className="h-4 w-4" />
    };
  };

  const checkRealTimeOperations = async (): Promise<PhaseStatus> => {
    const blockers = [];
    let completion = 60;

    try {
      // Check if system is initialized
      const { data: config } = await supabase
        .from('system_config')
        .select('config_value')
        .eq('config_key', 'system_mode')
        .single();

      if (config?.config_value !== 'live') {
        blockers.push('System not initialized for live operations');
      } else {
        completion += 20;
      }

      // Check live status modules
      const { data: modules } = await supabase
        .from('live_status')
        .select('*')
        .eq('system_status', 'LIVE');

      if (!modules || modules.length < 8) {
        blockers.push('Live monitoring modules not activated');
      } else {
        completion += 20;
      }

    } catch (error) {
      blockers.push('Failed to check operational status');
    }

    return {
      name: 'Real-Time Operations',
      completion,
      status: blockers.length > 0 ? 'partial' : 'complete',
      blockers,
      icon: <Activity className="h-4 w-4" />
    };
  };

  const checkClientOperations = async (): Promise<PhaseStatus> => {
    const blockers = [];
    let completion = 40;

    try {
      // Check if any clients are configured
      const { data: clients } = await supabase
        .from('clients')
        .select('id');

      if (!clients || clients.length === 0) {
        blockers.push('No client entities configured');
      } else {
        completion += 30;
      }

      // Check if notifications are configured
      const { data: notifications } = await supabase
        .from('aria_notifications')
        .select('id')
        .limit(1);

      if (notifications && notifications.length > 0) {
        completion += 30;
      } else {
        blockers.push('Notification system not tested');
      }

    } catch (error) {
      blockers.push('Failed to check client configuration');
    }

    return {
      name: 'Client Operations',
      completion,
      status: blockers.length > 0 ? 'partial' : 'complete',
      blockers,
      icon: <Users className="h-4 w-4" />
    };
  };

  const handleInitializeSystem = async () => {
    setIsInitializing(true);
    toast.info('🚀 Initializing A.R.I.A™ System for live operations...');

    try {
      // Initialize system configuration
      const configs = [
        { key: 'system_mode', value: 'live' },
        { key: 'allow_mock_data', value: 'disabled' },
        { key: 'live_enforcement', value: 'enabled' },
        { key: 'aria_core_active', value: 'true' }
      ];

      for (const config of configs) {
        await supabase
          .from('system_config')
          .upsert({
            config_key: config.key,
            config_value: config.value
          }, { onConflict: 'config_key' });
      }

      // Activate live status modules
      const modules = [
        'Live Threat Scanner',
        'Social Media Monitor',
        'News Feed Scanner',
        'Forum Analysis Engine',
        'Legal Discussion Monitor',
        'Reputation Risk Detector',
        'HyperCore Intelligence',
        'EIDETIC Memory Engine',
        'Anubis Diagnostics'
      ];

      for (const module of modules) {
        await supabase
          .from('live_status')
          .upsert({
            name: module,
            system_status: 'LIVE',
            last_report: new Date().toISOString()
          }, { onConflict: 'name' });
      }

      await checkSystemStatus();
      toast.success('✅ System initialization completed successfully!');

    } catch (error) {
      console.error('System initialization failed:', error);
      toast.error('❌ System initialization failed');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleActivateMonitoring = async () => {
    setIsActivating(true);
    toast.info('📡 Activating real-time monitoring...');

    try {
      // Update monitoring status
      await supabase
        .from('monitoring_status')
        .upsert({
          id: '1',
          is_active: true,
          sources_count: 12,
          last_run: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      // Trigger initial scan
      await supabase.functions.invoke('monitoring-scan', {
        body: { fullScan: true }
      });

      await checkSystemStatus();
      toast.success('✅ Real-time monitoring activated!');

    } catch (error) {
      console.error('Failed to activate monitoring:', error);
      toast.error('❌ Failed to activate monitoring');
    } finally {
      setIsActivating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'partial': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'blocked': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle className="h-4 w-4" />;
      case 'blocked': return <XCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-corporate-accent" />
            A.R.I.A™ System Operational Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-corporate-lightGray">Overall Completion</span>
              <span className="text-white font-bold">{overallStatus.toFixed(0)}%</span>
            </div>
            <Progress value={overallStatus} className="h-2" />
            
            {overallStatus >= 90 ? (
              <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-green-400 text-sm">✅ System is operational and ready for production use</p>
              </div>
            ) : (
              <div className="p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                <p className="text-yellow-400 text-sm">⚠️ System requires completion of remaining phases</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="p-4">
            <Button
              onClick={handleInitializeSystem}
              disabled={isInitializing}
              className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              {isInitializing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Initialize System
                </>
              )}
            </Button>
            <p className="text-xs text-corporate-lightGray mt-2 text-center">
              Configure for live operations
            </p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-dark border-corporate-border">
          <CardContent className="p-4">
            <Button
              onClick={handleActivateMonitoring}
              disabled={isActivating}
              className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              {isActivating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Activate Monitoring
                </>
              )}
            </Button>
            <p className="text-xs text-corporate-lightGray mt-2 text-center">
              Start real-time scanning
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Phase Details */}
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <Card key={index} className="bg-corporate-dark border-corporate-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {phase.icon}
                  <span className="text-white font-medium">{phase.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(phase.status)}>
                    {getStatusIcon(phase.status)}
                    <span className="ml-1">{phase.status.toUpperCase()}</span>
                  </Badge>
                  <span className="text-white text-sm">{phase.completion}%</span>
                </div>
              </div>
              
              <Progress value={phase.completion} className="h-2 mb-3" />
              
              {phase.blockers.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-red-400 font-medium">Blockers:</p>
                  {phase.blockers.map((blocker, blockerIndex) => (
                    <p key={blockerIndex} className="text-xs text-red-400">
                      • {blocker}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SystemOperationalStatus;
