
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Play, BarChart3, AlertTriangle } from "lucide-react";
import { triggerRSISimulation, getRSIActivationLogs, generateRSIReports } from '@/services/rsi/rsiService';
import { toast } from 'sonner';

const RSIManagementPanel = () => {
  const [threatTopic, setThreatTopic] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activationLogs, setActivationLogs] = useState([]);
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
      const logs = await getRSIActivationLogs();
      setActivationLogs(logs);
      
      setStats({
        totalSimulations: logs.length,
        activeThreats: logs.filter(log => log.activation_status === 'active').length,
        successRate: logs.length > 0 ? (logs.filter(log => log.activation_status === 'completed').length / logs.length) * 100 : 0
      });
    } catch (error) {
      console.error('Error loading activation logs:', error);
    }
  };

  const handleTriggerSimulation = async () => {
    if (!threatTopic.trim()) {
      toast.error('Please enter a threat topic');
      return;
    }

    setIsSimulating(true);
    try {
      await triggerRSISimulation(threatTopic);
      setThreatTopic('');
      loadActivationLogs();
    } catch (error) {
      console.error('Error triggering simulation:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      await generateRSIReports('default-campaign');
      toast.success('RSI effectiveness report generated');
    } catch (error) {
      console.error('Error generating report:', error);
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
            {activationLogs.slice(0, 5).map((log) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RSIManagementPanel;
