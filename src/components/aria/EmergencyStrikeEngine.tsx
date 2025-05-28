
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Shield, 
  Zap, 
  Clock,
  CheckCircle,
  XCircle,
  AlertOctagon
} from "lucide-react";
import { emergencyStrikeService, EmergencyThreat, StrikePlan, AdminDecision, ActionLog } from '@/services/aria/emergencyStrikeService';
import { toast } from 'sonner';

const EmergencyStrikeEngine = () => {
  const [threats, setThreats] = useState<EmergencyThreat[]>([]);
  const [strikePlans, setStrikePlans] = useState<StrikePlan[]>([]);
  const [adminDecisions, setAdminDecisions] = useState<AdminDecision[]>([]);
  const [actionLogs, setActionLogs] = useState<ActionLog[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<EmergencyThreat | null>(null);
  const [adminReason, setAdminReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadAllData();
    
    // Refresh data every 10 seconds for emergency monitoring
    const interval = setInterval(loadAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [threatsData, plansData, decisionsData, logsData] = await Promise.all([
        emergencyStrikeService.getEmergencyThreats(),
        emergencyStrikeService.getStrikePlans(),
        emergencyStrikeService.getAdminDecisions(),
        emergencyStrikeService.getActionLogs()
      ]);

      setThreats(threatsData);
      setStrikePlans(plansData);
      setAdminDecisions(decisionsData);
      setActionLogs(logsData);
    } catch (error) {
      console.error('Error loading emergency data:', error);
      toast.error('Failed to load emergency data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmStrike = async (threatId: string) => {
    if (!adminReason.trim()) {
      toast.error('Admin reason required for strike confirmation');
      return;
    }

    setIsProcessing(true);
    try {
      const success = await emergencyStrikeService.confirmStrike(
        threatId,
        'admin_user', // In production, this would come from auth context
        adminReason
      );

      if (success) {
        setAdminReason('');
        setSelectedThreat(null);
        loadAllData();
      }
    } catch (error) {
      console.error('Error confirming strike:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelThreat = async (threatId: string) => {
    if (!adminReason.trim()) {
      toast.error('Reason required for threat cancellation');
      return;
    }

    setIsProcessing(true);
    try {
      const success = await emergencyStrikeService.cancelThreat(threatId, adminReason);
      
      if (success) {
        setAdminReason('');
        setSelectedThreat(null);
        loadAllData();
      }
    } catch (error) {
      console.error('Error cancelling threat:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getRiskColor = (level: string) => {
    return level === 'critical' ? 'bg-red-600' : 'bg-orange-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unconfirmed': return 'bg-yellow-600';
      case 'confirmed': return 'bg-blue-600';
      case 'executed': return 'bg-green-600';
      case 'cancelled': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getThreatPlans = (threatId: string) => {
    return strikePlans.filter(plan => plan.threat_id === threatId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2 text-red-600 font-semibold">Loading A.R.I.A/EX™ Emergency System...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-red-600">
            <AlertOctagon className="h-6 w-6" />
            A.R.I.A/EX™ Emergency Strike Engine
          </h1>
          <p className="text-muted-foreground">
            EMERGENCY RESPONSE SYSTEM - ADMIN AUTHORIZATION REQUIRED
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => emergencyStrikeService.simulateEmergencyThreat()}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            <Zap className="h-4 w-4 mr-2" />
            Simulate Emergency
          </Button>
        </div>
      </div>

      {/* Emergency Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Unconfirmed</p>
              <p className="text-lg font-bold text-red-600">
                {threats.filter(t => t.status === 'unconfirmed').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Confirmed</p>
              <p className="text-lg font-bold text-blue-600">
                {threats.filter(t => t.status === 'confirmed').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Executed</p>
              <p className="text-lg font-bold text-green-600">
                {threats.filter(t => t.status === 'executed').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Cancelled</p>
              <p className="text-lg font-bold text-gray-600">
                {threats.filter(t => t.status === 'cancelled').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="threats">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="threats" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Emergency Threats
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Strike Plans
          </TabsTrigger>
          <TabsTrigger value="decisions" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Admin Decisions
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Execution Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="threats">
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Emergency Threat Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {threats.length > 0 ? (
                  threats.map((threat) => {
                    const threatPlans = getThreatPlans(threat.id);
                    
                    return (
                      <div key={threat.id} className="p-4 border rounded-lg border-red-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-red-900">{threat.threat_type}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getRiskColor(threat.risk_level)} text-white`}>
                              {threat.risk_level.toUpperCase()}
                            </Badge>
                            <Badge className={`${getStatusColor(threat.status)} text-white`}>
                              {threat.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">
                          {threat.threat_description}
                        </p>

                        {threat.origin_url && (
                          <div className="text-xs text-gray-500 mb-3">
                            <strong>Source:</strong> {threat.origin_url}
                          </div>
                        )}

                        {threatPlans.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium mb-1">
                              Strike Plans ({threatPlans.length}):
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {threatPlans.map((plan) => (
                                <Badge 
                                  key={plan.id} 
                                  variant="outline" 
                                  className="text-xs"
                                >
                                  {plan.action_type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                          <span>
                            <Clock className="inline h-3 w-3 mr-1" />
                            {new Date(threat.detected_at).toLocaleString()}
                          </span>
                        </div>

                        {threat.status === 'unconfirmed' && (
                          <div className="space-y-3 pt-3 border-t border-red-200">
                            <Textarea
                              placeholder="Admin decision reason (required)..."
                              value={selectedThreat?.id === threat.id ? adminReason : ''}
                              onChange={(e) => {
                                setSelectedThreat(threat);
                                setAdminReason(e.target.value);
                              }}
                              className="min-h-[60px] border-red-200"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleConfirmStrike(threat.id)}
                                disabled={isProcessing || !adminReason.trim()}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                CONFIRM STRIKE
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleCancelThreat(threat.id)}
                                disabled={isProcessing || !adminReason.trim()}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No emergency threats detected
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>Strike Action Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {strikePlans.length > 0 ? (
                  strikePlans.map((plan) => (
                    <div key={plan.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{plan.action_type}</span>
                        <Badge variant={plan.approved ? "default" : "outline"}>
                          {plan.approved ? 'Approved' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{plan.action_detail}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(plan.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No strike plans available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions">
          <Card>
            <CardHeader>
              <CardTitle>Admin Decision Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {adminDecisions.length > 0 ? (
                  adminDecisions.map((decision) => (
                    <div key={decision.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Admin: {decision.admin_id}</span>
                        <Badge className={decision.approved ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                          {decision.approved ? 'APPROVED' : 'REJECTED'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{decision.reason}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(decision.reviewed_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No admin decisions recorded
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Strike Execution Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {actionLogs.length > 0 ? (
                  actionLogs.map((log) => (
                    <div key={log.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{log.action_type}</span>
                        <Badge variant="outline">
                          {log.engine_version}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.result}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(log.executed_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No executions logged
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmergencyStrikeEngine;
