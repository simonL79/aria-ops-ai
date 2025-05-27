
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Play, BarChart3, AlertTriangle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RSIActivationLog {
  id: string;
  matched_threat: string;
  trigger_type: string;
  activation_status: string;
  created_at: string;
}

const RSIManagementPanel = () => {
  const [threatTopic, setThreatTopic] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activationLogs, setActivationLogs] = useState<RSIActivationLog[]>([]);
  const [stats, setStats] = useState({
    totalSimulations: 0,
    activeThreats: 0,
    successRate: 0
  });

  useEffect(() => {
    loadActivationLogs();
  }, []);

  const loadActivationLogs = async () => {
    try {
      // Get RSI activation logs from activity_logs
      const { data: logs, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('action', 'rsi_simulation_triggered')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading RSI logs:', error);
        setActivationLogs([]);
      } else {
        // Map activity_logs to RSIActivationLog format
        const mappedLogs: RSIActivationLog[] = (logs || []).map(log => ({
          id: log.id,
          matched_threat: log.details || 'RSI Simulation',
          trigger_type: 'manual',
          activation_status: 'completed',
          created_at: log.created_at
        }));
        setActivationLogs(mappedLogs);
      }

      // Calculate stats
      const totalSims = logs?.length || 0;
      const activeSims = logs?.filter(log => log.action === 'rsi_simulation_triggered').length || 0;
      const completedSims = logs?.filter(log => log.action === 'rsi_simulation_triggered').length || 0;
      
      setStats({
        totalSimulations: totalSims,
        activeThreats: activeSims,
        successRate: totalSims > 0 ? (completedSims / totalSims) * 100 : 0
      });
    } catch (error) {
      console.error('Error in loadActivationLogs:', error);
      setActivationLogs([]);
    }
  };

  const handleTriggerSimulation = async () => {
    if (!threatTopic.trim()) {
      toast.error('Please enter a threat topic');
      return;
    }

    setIsSimulating(true);
    try {
      console.log('Triggering RSI simulation for:', threatTopic);
      
      const { data, error } = await supabase.functions.invoke('rsi-threat-simulator', {
        body: { 
          threat_topic: threatTopic,
          simulation_type: 'manual'
        }
      });

      if (error) {
        console.error('RSI simulation error:', error);
        toast.error('RSI simulation failed: ' + error.message);
      } else {
        console.log('RSI simulation result:', data);
        toast.success('RSI simulation triggered successfully');
        setThreatTopic('');
        loadActivationLogs();
      }
    } catch (error) {
      console.error('Error triggering simulation:', error);
      toast.error('Failed to trigger RSI simulation');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      toast.info('Generating RSI effectiveness report...');
      
      // Create a basic report entry
      const { data, error } = await supabase
        .from('executive_reports')
        .insert({
          title: 'RSI Effectiveness Report',
          report_type: 'rsi_effectiveness',
          executive_summary: `RSI system processed ${stats.totalSimulations} simulations with ${stats.successRate.toFixed(1)}% success rate.`,
          period_start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          period_end: new Date().toISOString().split('T')[0],
          key_metrics: {
            total_simulations: stats.totalSimulations,
            active_threats: stats.activeThreats,
            success_rate: stats.successRate
          }
        });

      if (error) {
        console.error('Error generating report:', error);
        toast.error('Failed to generate report');
      } else {
        toast.success('RSI effectiveness report generated');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Simulations</p>
                <p className="text-2xl font-bold">{stats.totalSimulations}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Threats</p>
                <p className="text-2xl font-bold">{stats.activeThreats}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Threat Simulation Control */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Threat Simulation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="threat-topic">Threat Topic</Label>
            <Input
              id="threat-topic"
              value={threatTopic}
              onChange={(e) => setThreatTopic(e.target.value)}
              placeholder="Enter threat scenario to simulate..."
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleTriggerSimulation} 
              disabled={isSimulating}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isSimulating ? 'Simulating...' : 'Trigger Simulation'}
            </Button>
            <Button variant="outline" onClick={handleGenerateReport}>
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent RSI Activations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activationLogs.length > 0 ? (
              activationLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{log.matched_threat}</p>
                    <p className="text-sm text-gray-600">{log.trigger_type}</p>
                  </div>
                  <Badge variant={
                    log.activation_status === 'completed' ? 'default' :
                    log.activation_status === 'active' ? 'secondary' :
                    log.activation_status === 'failed' ? 'destructive' : 'outline'
                  }>
                    {log.activation_status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No RSI activations yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RSIManagementPanel;
