
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Telescope, Radar, TrendingUp, Mail, DollarSign, Users, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const WatchtowerPage = () => {
  const { user, isAdmin } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [outreachLog, setOutreachLog] = useState([]);
  const [conversionPipeline, setConversionPipeline] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('discovery');
  const [filters, setFilters] = useState({
    minThreatScore: 0,
    minPotentialValue: 0,
    industry: '',
    status: ''
  });

  useEffect(() => {
    if (isAdmin) {
      loadCandidates();
      loadConversionPipeline();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedCandidate) {
      loadOutreachLog(selectedCandidate.id);
    }
  }, [selectedCandidate]);

  const loadCandidates = async () => {
    const { data } = await supabase
      .from('watchtower_candidates')
      .select('*')
      .order('priority_score', { ascending: false });
    setCandidates(data || []);
  };

  const loadOutreachLog = async (candidateId) => {
    const { data } = await supabase
      .from('watchtower_outreach_log')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('sent_at', { ascending: false });
    setOutreachLog(data || []);
  };

  const loadConversionPipeline = async () => {
    const { data } = await supabase
      .from('watchtower_conversion_pipeline')
      .select(`
        *,
        watchtower_candidates(entity_name, potential_value, threat_score)
      `)
      .order('stage_entered_at', { ascending: false });
    setConversionPipeline(data || []);
  };

  const handleDiscoveryScan = async () => {
    setScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('watchtower-scan', {
        body: {
          mode: 'manual',
          maxCandidates: 50
        }
      });

      if (error) throw error;

      toast.success(`Discovery completed: ${data.entitiesDiscovered} new entities found`);
      loadCandidates();
    } catch (error) {
      console.error('Discovery scan error:', error);
      toast.error('Discovery scan failed: ' + error.message);
    } finally {
      setScanning(false);
    }
  };

  const handleGenerateOutreach = async (candidateId, outreachType) => {
    try {
      const { data, error } = await supabase.functions.invoke('outreach-generate', {
        body: {
          candidateId,
          outreachType,
          userId: user?.id
        }
      });

      if (error) throw error;

      toast.success(`${outreachType} outreach generated successfully`);
      loadOutreachLog(candidateId);
    } catch (error) {
      console.error('Outreach generation error:', error);
      toast.error('Outreach generation failed: ' + error.message);
    }
  };

  const handleUpdateStage = async (candidateId, newStage) => {
    try {
      const { error } = await supabase
        .from('watchtower_conversion_pipeline')
        .upsert({
          candidate_id: candidateId,
          stage: newStage,
          stage_entered_at: new Date().toISOString()
        }, { onConflict: 'candidate_id' });

      if (error) throw error;

      toast.success(`Stage updated to ${newStage}`);
      loadConversionPipeline();
    } catch (error) {
      console.error('Stage update error:', error);
      toast.error('Stage update failed: ' + error.message);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'bg-red-500';
    if (score >= 0.6) return 'bg-orange-500';
    if (score >= 0.4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStageColor = (stage) => {
    const colors = {
      'prospect': 'bg-gray-500',
      'qualified': 'bg-blue-500',
      'proposal': 'bg-purple-500',
      'negotiation': 'bg-orange-500',
      'converted': 'bg-green-500',
      'lost': 'bg-red-500'
    };
    return colors[stage] || 'bg-gray-500';
  };

  const filteredCandidates = candidates.filter(candidate => {
    return (
      candidate.threat_score >= filters.minThreatScore &&
      candidate.potential_value >= filters.minPotentialValue &&
      (filters.industry === '' || candidate.industry_category === filters.industry) &&
      (filters.status === '' || candidate.outreach_status === filters.status)
    );
  });

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="p-6 text-center">
              <Telescope className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-500 mb-2">Access Denied</h3>
              <p className="text-red-400">A.R.I.A™ Watchtower requires administrative clearance</p>
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
            <Telescope className="h-8 w-8 text-purple-500" />
            <div>
              <h1 className="text-3xl font-bold">A.R.I.A™ Watchtower</h1>
              <p className="text-gray-600">Autonomous Entity Discovery & Lead Generation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-purple-500 text-white">
              {candidates.length} Entities Tracked
            </Badge>
            <Button onClick={handleDiscoveryScan} disabled={scanning} className="bg-purple-600 hover:bg-purple-700">
              {scanning ? 'Scanning...' : 'New Discovery Scan'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="discovery">Discovery Feed</TabsTrigger>
            <TabsTrigger value="intelligence">Threat Intelligence</TabsTrigger>
            <TabsTrigger value="outreach">Outreach Center</TabsTrigger>
            <TabsTrigger value="pipeline">Conversion Pipeline</TabsTrigger>
          </TabsList>

          <TabsContent value="discovery">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Min Threat Score</label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      value={filters.minThreatScore}
                      onChange={(e) => setFilters({...filters, minThreatScore: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Min Value ($)</label>
                    <Input
                      type="number"
                      value={filters.minPotentialValue}
                      onChange={(e) => setFilters({...filters, minPotentialValue: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Industry</label>
                    <select
                      className="w-full p-2 border rounded text-sm"
                      value={filters.industry}
                      onChange={(e) => setFilters({...filters, industry: e.target.value})}
                    >
                      <option value="">All Industries</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Retail">Retail</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Discovery Feed */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Radar className="h-5 w-5" />
                      Live Discovery Feed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {filteredCandidates.map(candidate => (
                        <div
                          key={candidate.id}
                          className={`p-4 border rounded cursor-pointer hover:bg-gray-50 ${
                            selectedCandidate?.id === candidate.id ? 'border-purple-500 bg-purple-50' : ''
                          }`}
                          onClick={() => setSelectedCandidate(candidate)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{candidate.entity_name}</div>
                            <div className="flex items-center gap-2">
                              <Badge className={`${getScoreColor(candidate.priority_score)} text-white text-xs`}>
                                Priority: {Math.round(candidate.priority_score * 100)}%
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                ${candidate.potential_value?.toLocaleString() || '0'}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{candidate.threat_summary}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Source: {candidate.discovery_source}</span>
                            <span>Industry: {candidate.industry_category}</span>
                            <span>Discovered: {new Date(candidate.discovered_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="intelligence">
            {selectedCandidate ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Threat Intelligence: {selectedCandidate.entity_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded">
                      <div className="text-2xl font-bold text-red-500">
                        {Math.round(selectedCandidate.threat_score * 100)}%
                      </div>
                      <div className="text-sm text-gray-500">Threat Score</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded">
                      <div className="text-2xl font-bold text-blue-500">
                        {Math.round(selectedCandidate.confidence_score * 100)}%
                      </div>
                      <div className="text-sm text-gray-500">Confidence</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded">
                      <div className="text-2xl font-bold text-green-500">
                        ${selectedCandidate.potential_value?.toLocaleString() || '0'}
                      </div>
                      <div className="text-sm text-gray-500">Potential Value</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded">
                      <div className="text-2xl font-bold text-purple-500">
                        {Math.round(selectedCandidate.priority_score * 100)}%
                      </div>
                      <div className="text-sm text-gray-500">Priority Score</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Threat Summary</h4>
                    <p className="text-sm text-gray-600 p-3 bg-yellow-50 rounded">
                      {selectedCandidate.threat_summary}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Discovery Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Source:</span> {selectedCandidate.discovery_source}
                      </div>
                      <div>
                        <span className="font-medium">Industry:</span> {selectedCandidate.industry_category}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {selectedCandidate.geographic_location || 'Unknown'}
                      </div>
                      <div>
                        <span className="font-medium">Last Scan:</span> {new Date(selectedCandidate.last_scanned).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {selectedCandidate.contact_information && (
                    <div>
                      <h4 className="font-medium mb-2">Contact Intelligence</h4>
                      <div className="text-sm space-y-1 p-3 bg-blue-50 rounded">
                        {selectedCandidate.contact_information.estimated_domain && (
                          <div><span className="font-medium">Domain:</span> {selectedCandidate.contact_information.estimated_domain}</div>
                        )}
                        {selectedCandidate.contact_information.estimated_email && (
                          <div><span className="font-medium">Email:</span> {selectedCandidate.contact_information.estimated_email}</div>
                        )}
                        {selectedCandidate.contact_information.linkedin_profile && (
                          <div><span className="font-medium">LinkedIn:</span> {selectedCandidate.contact_information.linkedin_profile}</div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No Entity Selected</h3>
                  <p className="text-gray-400">Select an entity from the discovery feed to view intelligence</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="outreach">
            {selectedCandidate ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Generate Outreach
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded">
                      <h4 className="font-medium mb-2">Target: {selectedCandidate.entity_name}</h4>
                      <p className="text-sm text-gray-600">{selectedCandidate.threat_summary}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleGenerateOutreach(selectedCandidate.id, 'email')}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        Generate Email
                      </Button>
                      <Button
                        onClick={() => handleGenerateOutreach(selectedCandidate.id, 'linkedin')}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        LinkedIn Message
                      </Button>
                      <Button
                        onClick={() => handleGenerateOutreach(selectedCandidate.id, 'phone')}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        Phone Script
                      </Button>
                      <Button
                        onClick={() => handleGenerateOutreach(selectedCandidate.id, 'direct')}
                        className="bg-purple-600 hover:bg-purple-700"
                        size="sm"
                      >
                        Direct Approach
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Outreach History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {outreachLog.map(outreach => (
                        <div key={outreach.id} className="p-3 border rounded">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{outreach.outreach_type}</Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(outreach.sent_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {outreach.outreach_content?.substring(0, 100)}...
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge className={outreach.response_received ? 'bg-green-500' : 'bg-yellow-500'}>
                              {outreach.response_received ? 'Responded' : 'Pending'}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Status: {outreach.delivery_status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">No Entity Selected</h3>
                  <p className="text-gray-400">Select an entity to generate targeted outreach</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pipeline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Conversion Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionPipeline.map(pipeline => (
                    <div key={pipeline.id} className="p-4 border rounded">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">
                            {pipeline.watchtower_candidates?.entity_name || 'Unknown Entity'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Value: ${pipeline.watchtower_candidates?.potential_value?.toLocaleString() || '0'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStageColor(pipeline.stage)} text-white`}>
                            {pipeline.stage}
                          </Badge>
                          <select
                            className="text-xs border rounded p-1"
                            value={pipeline.stage}
                            onChange={(e) => handleUpdateStage(pipeline.candidate_id, e.target.value)}
                          >
                            <option value="prospect">Prospect</option>
                            <option value="qualified">Qualified</option>
                            <option value="proposal">Proposal</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="converted">Converted</option>
                            <option value="lost">Lost</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Probability:</span> {Math.round(pipeline.conversion_probability * 100)}%
                        </div>
                        <div>
                          <span className="font-medium">Est. Value:</span> ${pipeline.estimated_value?.toLocaleString() || '0'}
                        </div>
                        <div>
                          <span className="font-medium">Stage Date:</span> {new Date(pipeline.stage_entered_at).toLocaleDateString()}
                        </div>
                      </div>

                      {pipeline.next_action && (
                        <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                          <span className="font-medium">Next Action:</span> {pipeline.next_action}
                          {pipeline.next_action_date && (
                            <span className="text-gray-500 ml-2">
                              Due: {new Date(pipeline.next_action_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WatchtowerPage;
