
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Zap
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ThreatQueueItem {
  id: string;
  threat_type: string;
  target_identity: string;
  origin_platform: string;
  threat_payload: string;
  risk_score: number;
  detected_at: string;
  status: string;
}

interface ActionMatrixItem {
  id: string;
  threat_id: string;
  action_type: string;
  action_detail: string;
  ai_confidence: number;
  created_at: string;
}

interface AdminSignal {
  id: string;
  threat_id: string;
  approved: boolean;
  comment: string;
  reviewed_at: string;
  executor: string;
}

interface SovraActionLog {
  id: string;
  threat_id: string;
  action_type: string;
  executed_by: string;
  executed_at: string;
  result: string;
}

const SovraDecisionEngine = () => {
  const [threats, setThreats] = useState<ThreatQueueItem[]>([]);
  const [actions, setActions] = useState<ActionMatrixItem[]>([]);
  const [signals, setSignals] = useState<AdminSignal[]>([]);
  const [executionLog, setExecutionLog] = useState<SovraActionLog[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<ThreatQueueItem | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadAllData();
    
    // Set up real-time subscriptions
    const threatSubscription = supabase
      .channel('threat_queue_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'threat_queue' },
        () => loadAllData()
      )
      .subscribe();

    return () => {
      threatSubscription.unsubscribe();
    };
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [threatsData, actionsData, signalsData, logData] = await Promise.all([
        supabase.from('threat_queue').select('*').order('detected_at', { ascending: false }),
        supabase.from('action_matrix').select('*').order('created_at', { ascending: false }),
        supabase.from('admin_signals').select('*').order('reviewed_at', { ascending: false }),
        supabase.from('sovra_action_log').select('*').order('executed_at', { ascending: false })
      ]);

      if (threatsData.data) setThreats(threatsData.data);
      if (actionsData.data) setActions(actionsData.data);
      if (signalsData.data) setSignals(signalsData.data);
      if (logData.data) setExecutionLog(logData.data);
    } catch (error) {
      console.error('Error loading SOVRA data:', error);
      toast.error('Failed to load SOVRA data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminDecision = async (threatId: string, approved: boolean) => {
    if (!adminComment.trim()) {
      toast.error('Please add a comment explaining your decision');
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.rpc('api_admin_approve_threat', {
        p_threat_id: threatId,
        p_approved: approved,
        p_comment: adminComment
      });

      if (error) throw error;

      toast.success(data || `Threat ${approved ? 'approved' : 'rejected'} successfully`);
      setAdminComment('');
      setSelectedThreat(null);
      loadAllData();
    } catch (error) {
      console.error('Error processing admin decision:', error);
      toast.error('Failed to process decision');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'awaiting_admin': return 'bg-orange-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'executed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600';
    if (score >= 0.6) return 'text-orange-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getThreatActions = (threatId: string) => {
    return actions.filter(action => action.threat_id === threatId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading SOVRA™ Decision Engine...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            SOVRA™ Decision Engine
          </h1>
          <p className="text-muted-foreground">
            Human-Authorized Threat Response System
          </p>
        </div>
        <div className="text-sm text-gray-600">
          {threats.filter(t => t.status === 'awaiting_admin').length} threats awaiting review
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-lg font-bold text-yellow-600">
                {threats.filter(t => t.status === 'pending').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Awaiting Admin</p>
              <p className="text-lg font-bold text-orange-600">
                {threats.filter(t => t.status === 'awaiting_admin').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Approved</p>
              <p className="text-lg font-bold text-green-600">
                {threats.filter(t => t.status === 'approved').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Rejected</p>
              <p className="text-lg font-bold text-red-600">
                {threats.filter(t => t.status === 'rejected').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Executed</p>
              <p className="text-lg font-bold text-blue-600">
                {threats.filter(t => t.status === 'executed').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="threats">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="threats" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Threat Queue
          </TabsTrigger>
          <TabsTrigger value="actions" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            AI Actions
          </TabsTrigger>
          <TabsTrigger value="decisions" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Admin Decisions
          </TabsTrigger>
          <TabsTrigger value="execution" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Execution Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="threats">
          <Card>
            <CardHeader>
              <CardTitle>Threat Detection Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {threats.length > 0 ? (
                  threats.map((threat) => {
                    const threatActions = getThreatActions(threat.id);
                    
                    return (
                      <div key={threat.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{threat.threat_type}</h4>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(threat.status)} text-white`}>
                              {threat.status.toUpperCase()}
                            </Badge>
                            <span className={`font-medium ${getRiskColor(threat.risk_score)}`}>
                              Risk: {(threat.risk_score * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-500">Target:</span>
                            <div className="font-medium">{threat.target_identity || 'N/A'}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Platform:</span>
                            <div className="font-medium">{threat.origin_platform || 'N/A'}</div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {threat.threat_payload}
                        </p>

                        {threatActions.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium mb-1">
                              AI Recommended Actions ({threatActions.length}):
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {threatActions.map((action) => (
                                <Badge 
                                  key={action.id} 
                                  variant="outline" 
                                  className="text-xs"
                                >
                                  {action.action_type} ({(action.ai_confidence * 100).toFixed(0)}%)
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

                        {threat.status === 'awaiting_admin' && (
                          <div className="space-y-3 pt-3 border-t">
                            <Textarea
                              placeholder="Add your decision comment..."
                              value={selectedThreat?.id === threat.id ? adminComment : ''}
                              onChange={(e) => {
                                setSelectedThreat(threat);
                                setAdminComment(e.target.value);
                              }}
                              className="min-h-[60px]"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleAdminDecision(threat.id, true)}
                                disabled={isProcessing || !adminComment.trim()}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleAdminDecision(threat.id, false)}
                                disabled={isProcessing || !adminComment.trim()}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No threats in queue
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>AI Action Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {actions.length > 0 ? (
                  actions.map((action) => (
                    <div key={action.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{action.action_type}</span>
                        <Badge variant="outline">
                          Confidence: {(action.ai_confidence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{action.action_detail}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(action.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No AI actions available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decisions">
          <Card>
            <CardHeader>
              <CardTitle>Admin Decision History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {signals.length > 0 ? (
                  signals.map((signal) => (
                    <div key={signal.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Decision by {signal.executor}</span>
                        <Badge className={signal.approved ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                          {signal.approved ? 'APPROVED' : 'REJECTED'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{signal.comment}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(signal.reviewed_at).toLocaleString()}
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

        <TabsContent value="execution">
          <Card>
            <CardHeader>
              <CardTitle>Execution Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {executionLog.length > 0 ? (
                  executionLog.map((log) => (
                    <div key={log.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{log.action_type}</span>
                        <Badge variant="outline">
                          {log.executed_by}
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

export default SovraDecisionEngine;
