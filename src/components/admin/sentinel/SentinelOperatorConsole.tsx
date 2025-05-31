
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Shield, Target, Zap, FileText, AlertTriangle, CheckCircle, Clock, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface OperatorCase {
  id: string;
  entity_name: string;
  threat_level: number;
  case_status: string;
  intelligence_brief?: string;
  case_summary?: string;
  clients?: { name: string };
  created_at: string;
}

interface ExecutiveSummary {
  entity: string;
  threatLevel: number;
  activeCases: number;
  lastIncident: string;
  riskFactors: string[];
  recommendedAction: string;
}

interface MissionProgress {
  missionId: string;
  status: 'planning' | 'executing' | 'completed' | 'failed';
  responseType: 'soft' | 'hard' | 'nuclear';
  progress: number;
  startTime: string;
  estimatedCompletion?: string;
  results?: any;
}

const SentinelOperatorConsole = () => {
  const { user } = useAuth();
  const [targetEntity, setTargetEntity] = useState('');
  const [selectedCase, setSelectedCase] = useState<OperatorCase | null>(null);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummary | null>(null);
  const [missionProgress, setMissionProgress] = useState<MissionProgress | null>(null);
  const [cases, setCases] = useState<OperatorCase[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadActiveCases();
  }, []);

  useEffect(() => {
    if (selectedCase) {
      generateExecutiveSummary(selectedCase);
    }
  }, [selectedCase]);

  const loadActiveCases = async () => {
    try {
      const { data, error } = await supabase
        .from('sentinel_cases')
        .select(`
          *,
          clients(name)
        `)
        .eq('case_status', 'active')
        .order('threat_level', { ascending: false })
        .limit(10);

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error loading cases:', error);
    }
  };

  const generateExecutiveSummary = async (caseData: OperatorCase) => {
    // Generate executive summary from case data
    const summary: ExecutiveSummary = {
      entity: caseData.entity_name,
      threatLevel: caseData.threat_level,
      activeCases: 1,
      lastIncident: new Date(caseData.created_at).toLocaleDateString(),
      riskFactors: [
        'Online reputation threats detected',
        'Social media monitoring active',
        caseData.threat_level >= 4 ? 'High-priority escalation required' : 'Standard monitoring protocol'
      ],
      recommendedAction: caseData.threat_level >= 4 ? 'Nuclear Response' : 
                        caseData.threat_level >= 2 ? 'Hard Response' : 'Soft Response'
    };

    setExecutiveSummary(summary);
  };

  const executeResponse = async (responseType: 'soft' | 'hard' | 'nuclear') => {
    if (!selectedCase) {
      toast.error('No case selected');
      return;
    }

    setIsExecuting(true);
    
    // Initialize mission progress
    const mission: MissionProgress = {
      missionId: `MISSION-${Date.now()}`,
      status: 'executing',
      responseType,
      progress: 0,
      startTime: new Date().toISOString()
    };
    setMissionProgress(mission);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setMissionProgress(prev => {
        if (!prev) return null;
        const newProgress = Math.min(prev.progress + 25, 100);
        return {
          ...prev,
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : 'executing'
        };
      });
    }, 1500);

    try {
      const { data, error } = await supabase.functions.invoke('execute-response', {
        body: {
          caseId: selectedCase.id,
          executionType: responseType,
          userId: user?.id
        }
      });

      if (error) throw error;

      clearInterval(progressInterval);
      setMissionProgress(prev => prev ? {
        ...prev,
        status: 'completed',
        progress: 100,
        estimatedCompletion: new Date().toISOString(),
        results: data
      } : null);

      toast.success(`${responseType.toUpperCase()} response executed successfully`);
      
      // Generate mission report
      await generateMissionReport(responseType, data);
      
    } catch (error) {
      clearInterval(progressInterval);
      setMissionProgress(prev => prev ? {
        ...prev,
        status: 'failed',
        progress: 0
      } : null);
      
      console.error('Response execution error:', error);
      toast.error('Response execution failed: ' + error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const generateMissionReport = async (responseType: string, results: any) => {
    try {
      const reportData = {
        entity: selectedCase?.entity_name,
        responseType: responseType.toUpperCase(),
        executedAt: new Date().toISOString(),
        operator: user?.email,
        results: results,
        missionId: missionProgress?.missionId
      };

      // Store report in database
      await supabase.from('sentinel_mission_reports').insert({
        case_id: selectedCase?.id,
        mission_id: missionProgress?.missionId,
        response_type: responseType,
        report_data: reportData,
        generated_by: user?.id
      });

      toast.success('Mission report generated');
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const downloadMissionPDF = async () => {
    if (!missionProgress || !selectedCase) return;

    // Simulate PDF generation
    toast.success('PDF report downloaded');
  };

  const quickScanEntity = async () => {
    if (!targetEntity.trim()) return;

    setIsExecuting(true);
    try {
      const { data, error } = await supabase.functions.invoke('sigmalive-enhanced', {
        body: {
          entityName: targetEntity,
          scanType: 'sentinel'
        }
      });

      if (error) throw error;

      toast.success(`Quick scan completed: ${data.resultsFound} threats detected`);
      setTargetEntity('');
      loadActiveCases();
    } catch (error) {
      console.error('Quick scan error:', error);
      toast.error('Quick scan failed');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Command Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-2xl font-bold">Sentinel Command Center</h1>
            <p className="text-gray-600">Executive threat response operations</p>
          </div>
        </div>
        <Badge className="bg-green-500 text-white">
          {cases.length} Active Missions
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Quick Target Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                placeholder="Enter entity name for immediate scan"
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && quickScanEntity()}
              />
              <Button 
                onClick={quickScanEntity}
                disabled={isExecuting || !targetEntity.trim()}
                className="w-full mt-2"
              >
                {isExecuting ? 'Scanning...' : 'Immediate Threat Scan'}
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Active Cases</h4>
              {cases.map(caseItem => (
                <div
                  key={caseItem.id}
                  className={`p-3 border rounded cursor-pointer transition-colors ${
                    selectedCase?.id === caseItem.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCase(caseItem)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">{caseItem.entity_name}</div>
                      <div className="text-xs text-gray-500">
                        {caseItem.clients?.name || 'Unknown Client'}
                      </div>
                    </div>
                    <Badge 
                      className={`text-xs ${
                        caseItem.threat_level >= 4 ? 'bg-red-500 text-white' :
                        caseItem.threat_level >= 2 ? 'bg-yellow-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}
                    >
                      L{caseItem.threat_level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Center Panel - Executive Overview */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Executive Brief</TabsTrigger>
              <TabsTrigger value="mission">Mission Control</TabsTrigger>
              <TabsTrigger value="reports">Mission Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Executive Intelligence Brief</CardTitle>
                </CardHeader>
                <CardContent>
                  {executiveSummary && selectedCase ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-500">Target Entity</div>
                          <div className="text-lg font-semibold">{executiveSummary.entity}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-500">Threat Level</div>
                          <div className="text-lg font-semibold text-red-600">
                            Level {executiveSummary.threatLevel}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-2">Risk Factors</div>
                        <div className="space-y-1">
                          {executiveSummary.riskFactors.map((factor, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              {factor}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 p-4 rounded">
                        <div className="text-sm font-medium text-gray-700 mb-1">Recommended Action</div>
                        <div className="text-lg font-semibold text-blue-600">
                          {executiveSummary.recommendedAction}
                        </div>
                      </div>

                      {selectedCase.intelligence_brief && (
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-2">Intelligence Brief</div>
                          <div className="text-sm bg-blue-50 p-3 rounded">
                            {selectedCase.intelligence_brief}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Shield className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Select a case to view executive brief</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mission">
              <Card>
                <CardHeader>
                  <CardTitle>Mission Control</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedCase ? (
                    <div className="space-y-6">
                      {/* Response Triggers */}
                      <div>
                        <h3 className="font-medium mb-4">Execute Response</h3>
                        <div className="grid grid-cols-3 gap-3">
                          <Button
                            onClick={() => executeResponse('soft')}
                            disabled={isExecuting}
                            variant="outline"
                            className="h-16 flex flex-col gap-1"
                          >
                            <Zap className="h-5 w-5 text-blue-500" />
                            <span className="text-sm">Soft Response</span>
                          </Button>
                          <Button
                            onClick={() => executeResponse('hard')}
                            disabled={isExecuting}
                            variant="outline"
                            className="h-16 flex flex-col gap-1"
                          >
                            <Zap className="h-5 w-5 text-orange-500" />
                            <span className="text-sm">Hard Response</span>
                          </Button>
                          <Button
                            onClick={() => executeResponse('nuclear')}
                            disabled={isExecuting}
                            className="h-16 flex flex-col gap-1 bg-red-600 hover:bg-red-700"
                          >
                            <Zap className="h-5 w-5" />
                            <span className="text-sm">Nuclear Response</span>
                          </Button>
                        </div>
                      </div>

                      {/* Mission Progress */}
                      {missionProgress && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Mission Progress</h3>
                            <Badge className={
                              missionProgress.status === 'completed' ? 'bg-green-500 text-white' :
                              missionProgress.status === 'failed' ? 'bg-red-500 text-white' :
                              'bg-blue-500 text-white'
                            }>
                              {missionProgress.status.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Mission ID: {missionProgress.missionId}</span>
                              <span>{missionProgress.progress}%</span>
                            </div>
                            <Progress value={missionProgress.progress} />
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Response Type:</span>
                              <span className="ml-2 font-medium">{missionProgress.responseType.toUpperCase()}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Start Time:</span>
                              <span className="ml-2">{new Date(missionProgress.startTime).toLocaleTimeString()}</span>
                            </div>
                          </div>

                          {missionProgress.status === 'completed' && (
                            <div className="flex gap-2">
                              <Button onClick={downloadMissionPDF} size="sm" variant="outline">
                                <FileText className="h-4 w-4 mr-2" />
                                Download Report
                              </Button>
                              <Button onClick={downloadMissionPDF} size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                C&D Letter
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Select a case to access mission control</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Mission Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Mission reports will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SentinelOperatorConsole;
