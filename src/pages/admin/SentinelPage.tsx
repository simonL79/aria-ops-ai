
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Search, AlertTriangle, Zap, Target, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const SentinelPage = () => {
  const { user, isAdmin } = useAuth();
  const [entityInput, setEntityInput] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [responsePlans, setResponsePlans] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('briefing');

  useEffect(() => {
    if (isAdmin) {
      loadClients();
      loadCases();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedCase) {
      loadResponsePlans(selectedCase.id);
      loadTimeline(selectedCase.id);
    }
  }, [selectedCase]);

  const loadClients = async () => {
    const { data } = await supabase.from('clients').select('*').order('name');
    setClients(data || []);
  };

  const loadCases = async () => {
    const { data } = await supabase
      .from('sentinel_cases')
      .select(`
        *,
        clients(name)
      `)
      .order('created_at', { ascending: false });
    setCases(data || []);
  };

  const loadResponsePlans = async (caseId) => {
    const { data } = await supabase
      .from('sentinel_response_plans')
      .select('*')
      .eq('case_id', caseId)
      .order('plan_type');
    setResponsePlans(data || []);
  };

  const loadTimeline = async (caseId) => {
    const { data } = await supabase
      .from('sentinel_threat_timeline')
      .select('*')
      .eq('case_id', caseId)
      .order('detected_at', { ascending: false });
    setTimeline(data || []);
  };

  const handleScanEntity = async () => {
    if (!entityInput.trim()) {
      toast.error('Please enter an entity name');
      return;
    }

    setScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('sigmalive-enhanced', {
        body: {
          entityName: entityInput,
          scanType: 'sentinel',
          clientId: selectedClient || null
        }
      });

      if (error) throw error;

      toast.success(`Scan completed: ${data.resultsFound} threats detected`);
      setEntityInput('');
      loadCases(); // Refresh cases
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Scan failed: ' + error.message);
    } finally {
      setScanning(false);
    }
  };

  const handleExecuteResponse = async (planType) => {
    if (!selectedCase) {
      toast.error('Please select a case first');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('execute-response', {
        body: {
          caseId: selectedCase.id,
          executionType: planType,
          userId: user?.id
        }
      });

      if (error) throw error;

      toast.success(`${planType.toUpperCase()} response executed successfully`);
      loadCases();
      loadTimeline(selectedCase.id);
    } catch (error) {
      console.error('Response execution error:', error);
      toast.error('Response execution failed: ' + error.message);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanTypeColor = (type) => {
    switch (type) {
      case 'soft': return 'bg-blue-500';
      case 'hard': return 'bg-orange-500';
      case 'nuclear': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-500 mb-2">Access Denied</h3>
              <p className="text-red-400">A.R.I.A™ Sentinel requires administrative clearance</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold">A.R.I.A™ Sentinel</h1>
              <p className="text-gray-600">Threat Response & Client Protection</p>
            </div>
          </div>
          <Badge className="bg-blue-500 text-white">
            {cases.filter(c => c.case_status === 'active').length} Active Cases
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Input & Cases */}
          <div className="space-y-6">
            {/* "I Need Help" Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  I Need Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Entity Name</label>
                  <Input
                    placeholder="Enter person/company name"
                    value={entityInput}
                    onChange={(e) => setEntityInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleScanEntity()}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Client (Optional)</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                  >
                    <option value="">Select Client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
                <Button 
                  onClick={handleScanEntity} 
                  disabled={scanning}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {scanning ? 'Scanning...' : 'Start Threat Scan'}
                </Button>
              </CardContent>
            </Card>

            {/* Active Cases */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {cases.filter(c => c.case_status === 'active').map(caseItem => (
                    <div
                      key={caseItem.id}
                      className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                        selectedCase?.id === caseItem.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedCase(caseItem)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{caseItem.entity_name}</div>
                          <div className="text-sm text-gray-500">
                            {caseItem.clients?.name || 'No Client'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getSeverityColor('high')} text-white text-xs`}>
                            Level {caseItem.threat_level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Main Content */}
          <div className="lg:col-span-2">
            {selectedCase ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="briefing">Intelligence Brief</TabsTrigger>
                  <TabsTrigger value="response">Response Plans</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="briefing">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Intelligence Brief: {selectedCase.entity_name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Threat Level</label>
                          <div className="text-lg font-semibold">Level {selectedCase.threat_level}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Status</label>
                          <Badge className="ml-2">{selectedCase.case_status}</Badge>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Discovery Method</label>
                          <div className="text-sm">{selectedCase.discovery_method}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Created</label>
                          <div className="text-sm">
                            {new Date(selectedCase.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {selectedCase.case_summary && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Summary</label>
                          <div className="text-sm mt-1 p-3 bg-gray-50 rounded">
                            {selectedCase.case_summary}
                          </div>
                        </div>
                      )}

                      {selectedCase.intelligence_brief && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Intelligence Brief</label>
                          <div className="text-sm mt-1 p-3 bg-blue-50 rounded whitespace-pre-wrap">
                            {selectedCase.intelligence_brief}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="response">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Response Plans
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {responsePlans.map(plan => (
                          <div key={plan.id} className="border rounded p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Badge className={`${getPlanTypeColor(plan.plan_type)} text-white`}>
                                  {plan.plan_type.toUpperCase()}
                                </Badge>
                                <span className="font-medium">{plan.strategy_summary}</span>
                              </div>
                              <Button
                                onClick={() => handleExecuteResponse(plan.plan_type)}
                                disabled={plan.approval_status === 'executed'}
                                size="sm"
                                className={`${getPlanTypeColor(plan.plan_type)} hover:opacity-80`}
                              >
                                {plan.approval_status === 'executed' ? 'Executed' : 'Execute'}
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                              <div>
                                <span className="font-medium">Effectiveness:</span> {Math.round(plan.estimated_effectiveness * 100)}%
                              </div>
                              <div>
                                <span className="font-medium">Time:</span> {plan.time_to_execute}
                              </div>
                              <div>
                                <span className="font-medium">Resources:</span> {plan.resource_requirements}
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium text-gray-500">Actions</label>
                              <div className="mt-1 space-y-1">
                                {(plan.specific_actions || []).map((action, idx) => (
                                  <div key={idx} className="text-sm p-2 bg-gray-50 rounded">
                                    <span className="font-medium">{action.type}:</span> {action.description}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="timeline">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Threat Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {timeline.map(event => (
                          <div key={event.id} className="flex gap-4 p-3 border-l-4 border-gray-200">
                            <div className="flex-shrink-0">
                              {event.threat_severity && (
                                <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.threat_severity)}`} />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{event.event_type}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(event.detected_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{event.event_description}</p>
                              {event.source_platform && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {event.source_platform}
                                  </Badge>
                                  {event.source_url && (
                                    <a 
                                      href={event.source_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-500 hover:underline"
                                    >
                                      View Source
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No Case Selected</h3>
                  <p className="text-gray-400">Select a case from the left panel or start a new threat scan</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SentinelPage;
