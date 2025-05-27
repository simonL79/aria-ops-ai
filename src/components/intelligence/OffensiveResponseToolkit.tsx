import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Zap, 
  Target, 
  AlertTriangle, 
  Send, 
  Calendar, 
  TrendingUp, 
  Users,
  Eye,
  CheckCircle,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CounterNarrative {
  id: string;
  threat_id: string;
  message: string;
  tone: 'factual' | 'empathetic' | 'deflective' | 'humorous';
  status: 'draft' | 'approved' | 'deployed';
  platform: string;
  scheduled_at?: string;
  deployed_at?: string;
  created_at: string;
}

interface DiversionCampaign {
  id: string;
  threat_id: string;
  content_title: string;
  content_type: 'press_release' | 'positive_news' | 'engagement_post';
  target_platform: string;
  scheduled_time?: string;
  distraction_strength_score: number;
  deployed: boolean;
  created_at: string;
}

interface InfluenceSimulation {
  id: string;
  input_summary: string;
  scenario: 'respond' | 'ignore' | 'clarify' | 'escalate';
  predicted_sentiment_shift: string;
  virality_risk_score: number;
  recommended_tactic: string;
  created_at: string;
}

interface ActorDisruption {
  id: string;
  actor_handle: string;
  reason: 'impersonation' | 'spam' | 'harmful_content' | 'platform_violation';
  evidence_url: string;
  platform: string;
  reported_to_platform: boolean;
  report_submitted_at?: string;
  created_at: string;
}

interface OffensiveResponseToolkitProps {
  selectedThreats?: string[];
  threatId?: string;
}

const OffensiveResponseToolkit = ({ selectedThreats = [], threatId }: OffensiveResponseToolkitProps) => {
  const { user } = useAuth();
  const [counterNarratives, setCounterNarratives] = useState<CounterNarrative[]>([]);
  const [diversionCampaigns, setDiversionCampaigns] = useState<DiversionCampaign[]>([]);
  const [influenceSimulations, setInfluenceSimulations] = useState<InfluenceSimulation[]>([]);
  const [actorDisruptions, setActorDisruptions] = useState<ActorDisruption[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newNarrative, setNewNarrative] = useState({
    message: '',
    tone: 'factual' as const,
    platform: 'twitter',
    scheduled_at: ''
  });

  const [newCampaign, setNewCampaign] = useState({
    content_title: '',
    content_type: 'positive_news' as const,
    target_platform: 'twitter',
    scheduled_time: '',
    distraction_strength_score: 75
  });

  const [newSimulation, setNewSimulation] = useState({
    input_summary: '',
    scenario: 'respond' as const
  });

  const [newDisruption, setNewDisruption] = useState({
    actor_handle: '',
    reason: 'harmful_content' as const,
    evidence_url: '',
    platform: 'twitter'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [narratives, campaigns, simulations, disruptions] = await Promise.all([
        supabase.from('counter_narratives').select('*').order('created_at', { ascending: false }),
        supabase.from('diversion_campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('influence_simulations').select('*').order('created_at', { ascending: false }),
        supabase.from('actor_disruption_events').select('*').order('created_at', { ascending: false })
      ]);

      if (narratives.error) throw narratives.error;
      if (campaigns.error) throw campaigns.error;
      if (simulations.error) throw simulations.error;
      if (disruptions.error) throw disruptions.error;

      // Type-safe data mapping with proper validation
      setCounterNarratives((narratives.data || []).map(item => ({
        ...item,
        tone: item.tone as CounterNarrative['tone'],
        status: item.status as CounterNarrative['status']
      })));
      
      setDiversionCampaigns((campaigns.data || []).map(item => ({
        ...item,
        content_type: item.content_type as DiversionCampaign['content_type']
      })));
      
      setInfluenceSimulations((simulations.data || []).map(item => ({
        ...item,
        scenario: item.scenario as InfluenceSimulation['scenario']
      })));
      
      setActorDisruptions((disruptions.data || []).map(item => ({
        ...item,
        reason: item.reason as ActorDisruption['reason']
      })));
    } catch (error) {
      console.error('Failed to load offensive toolkit data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const createCounterNarrative = async () => {
    if (!newNarrative.message || !user) return;

    try {
      const targetThreatId = threatId || selectedThreats[0];
      if (!targetThreatId) {
        toast.error('Please select a threat to respond to');
        return;
      }

      const { error } = await supabase
        .from('counter_narratives')
        .insert({
          threat_id: targetThreatId,
          message: newNarrative.message,
          tone: newNarrative.tone,
          platform: newNarrative.platform,
          scheduled_at: newNarrative.scheduled_at || null
        });

      if (error) throw error;

      // Log transparency
      await supabase
        .from('response_transparency_log')
        .insert({
          response_type: 'counter_narrative',
          description: `Counter-narrative created for threat ${targetThreatId}`,
          initiated_by: user.id
        });

      toast.success('Counter-narrative created successfully');
      setNewNarrative({ message: '', tone: 'factual', platform: 'twitter', scheduled_at: '' });
      loadData();
    } catch (error) {
      console.error('Failed to create counter-narrative:', error);
      toast.error('Failed to create counter-narrative');
    }
  };

  const createDiversionCampaign = async () => {
    if (!newCampaign.content_title || !user) return;

    try {
      const targetThreatId = threatId || selectedThreats[0];
      if (!targetThreatId) {
        toast.error('Please select a threat to create campaign for');
        return;
      }

      const { error } = await supabase
        .from('diversion_campaigns')
        .insert({
          threat_id: targetThreatId,
          content_title: newCampaign.content_title,
          content_type: newCampaign.content_type,
          target_platform: newCampaign.target_platform,
          scheduled_time: newCampaign.scheduled_time || null,
          distraction_strength_score: newCampaign.distraction_strength_score
        });

      if (error) throw error;

      // Log transparency
      await supabase
        .from('response_transparency_log')
        .insert({
          response_type: 'diversion',
          description: `Diversion campaign created: ${newCampaign.content_title}`,
          initiated_by: user.id
        });

      toast.success('Diversion campaign created successfully');
      setNewCampaign({ 
        content_title: '', 
        content_type: 'positive_news', 
        target_platform: 'twitter', 
        scheduled_time: '', 
        distraction_strength_score: 75 
      });
      loadData();
    } catch (error) {
      console.error('Failed to create diversion campaign:', error);
      toast.error('Failed to create diversion campaign');
    }
  };

  const runInfluenceSimulation = async () => {
    if (!newSimulation.input_summary || !user) return;

    try {
      // Mock AI simulation - in production this would call OpenAI
      const mockResults = {
        predicted_sentiment_shift: `${newSimulation.scenario} strategy: +15% positive sentiment expected`,
        virality_risk_score: Math.floor(Math.random() * 40) + 30, // 30-70
        recommended_tactic: `Based on ${newSimulation.scenario} approach: Deploy measured response with empathy focus`
      };

      const { error } = await supabase
        .from('influence_simulations')
        .insert({
          input_summary: newSimulation.input_summary,
          scenario: newSimulation.scenario,
          predicted_sentiment_shift: mockResults.predicted_sentiment_shift,
          virality_risk_score: mockResults.virality_risk_score,
          recommended_tactic: mockResults.recommended_tactic,
          created_by: user.id
        });

      if (error) throw error;

      toast.success('Influence simulation completed');
      setNewSimulation({ input_summary: '', scenario: 'respond' });
      loadData();
    } catch (error) {
      console.error('Failed to run simulation:', error);
      toast.error('Failed to run simulation');
    }
  };

  const reportActorDisruption = async () => {
    if (!newDisruption.actor_handle || !user) return;

    try {
      const { error } = await supabase
        .from('actor_disruption_events')
        .insert({
          actor_handle: newDisruption.actor_handle,
          reason: newDisruption.reason,
          evidence_url: newDisruption.evidence_url,
          platform: newDisruption.platform,
          submitted_by: user.id
        });

      if (error) throw error;

      toast.success('Actor disruption report submitted');
      setNewDisruption({ actor_handle: '', reason: 'harmful_content', evidence_url: '', platform: 'twitter' });
      loadData();
    } catch (error) {
      console.error('Failed to submit disruption report:', error);
      toast.error('Failed to submit report');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'deployed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getToneIcon = (tone: string) => {
    switch (tone) {
      case 'factual': return <Shield className="h-3 w-3" />;
      case 'empathetic': return <Users className="h-3 w-3" />;
      case 'deflective': return <Target className="h-3 w-3" />;
      case 'humorous': return <Zap className="h-3 w-3" />;
      default: return <Shield className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Offensive Response Toolkit
        </CardTitle>
        <CardDescription>
          Advanced counter-narrative deployment and threat actor disruption capabilities
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="narratives" className="space-y-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="narratives">Counter-Narratives</TabsTrigger>
            <TabsTrigger value="diversion">Diversion Campaigns</TabsTrigger>
            <TabsTrigger value="simulation">Influence Simulation</TabsTrigger>
            <TabsTrigger value="disruption">Actor Disruption</TabsTrigger>
          </TabsList>

          <TabsContent value="narratives" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Counter-Narrative */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Deploy Counter-Narrative</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Craft your counter-narrative message..."
                    value={newNarrative.message}
                    onChange={(e) => setNewNarrative({ ...newNarrative, message: e.target.value })}
                    rows={4}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Select value={newNarrative.tone} onValueChange={(value: any) => setNewNarrative({ ...newNarrative, tone: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="factual">Factual</SelectItem>
                        <SelectItem value="empathetic">Empathetic</SelectItem>
                        <SelectItem value="deflective">Deflective</SelectItem>
                        <SelectItem value="humorous">Humorous</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={newNarrative.platform} onValueChange={(value) => setNewNarrative({ ...newNarrative, platform: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Input
                    type="datetime-local"
                    placeholder="Schedule deployment"
                    value={newNarrative.scheduled_at}
                    onChange={(e) => setNewNarrative({ ...newNarrative, scheduled_at: e.target.value })}
                  />
                  
                  <Button onClick={createCounterNarrative} className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Deploy Counter-Narrative
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Counter-Narratives */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Deployments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {counterNarratives.map((narrative) => (
                      <div key={narrative.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getToneIcon(narrative.tone)}
                            <Badge className={getStatusColor(narrative.status)}>
                              {narrative.status}
                            </Badge>
                            <Badge variant="outline">{narrative.platform}</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(narrative.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{narrative.message}</p>
                        {narrative.scheduled_at && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            Scheduled: {new Date(narrative.scheduled_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="diversion" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Create Diversion Campaign</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Campaign title..."
                    value={newCampaign.content_title}
                    onChange={(e) => setNewCampaign({ ...newCampaign, content_title: e.target.value })}
                  />
                  
                  <Select value={newCampaign.content_type} onValueChange={(value: any) => setNewCampaign({ ...newCampaign, content_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="press_release">Press Release</SelectItem>
                      <SelectItem value="positive_news">Positive News</SelectItem>
                      <SelectItem value="engagement_post">Engagement Post</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={newCampaign.target_platform} onValueChange={(value) => setNewCampaign({ ...newCampaign, target_platform: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div>
                    <label className="text-sm font-medium">Distraction Strength: {newCampaign.distraction_strength_score}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={newCampaign.distraction_strength_score}
                      onChange={(e) => setNewCampaign({ ...newCampaign, distraction_strength_score: parseInt(e.target.value) })}
                      className="w-full mt-2"
                    />
                  </div>
                  
                  <Button onClick={createDiversionCampaign} className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Launch Campaign
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Active Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {diversionCampaigns.map((campaign) => (
                      <div key={campaign.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={campaign.deployed ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                            {campaign.deployed ? 'Deployed' : 'Pending'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {campaign.distraction_strength_score}% strength
                          </span>
                        </div>
                        <h4 className="font-medium text-sm">{campaign.content_title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {campaign.content_type} • {campaign.target_platform}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Run Influence Simulation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Describe the scenario to simulate..."
                    value={newSimulation.input_summary}
                    onChange={(e) => setNewSimulation({ ...newSimulation, input_summary: e.target.value })}
                    rows={3}
                  />
                  
                  <Select value={newSimulation.scenario} onValueChange={(value: any) => setNewSimulation({ ...newSimulation, scenario: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="respond">Respond Directly</SelectItem>
                      <SelectItem value="ignore">Ignore Completely</SelectItem>
                      <SelectItem value="clarify">Clarify Position</SelectItem>
                      <SelectItem value="escalate">Escalate Response</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={runInfluenceSimulation} className="w-full">
                    <Eye className="h-4 w-4 mr-2" />
                    Run Simulation
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Simulation Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {influenceSimulations.map((simulation) => (
                      <div key={simulation.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{simulation.scenario}</Badge>
                          <Badge className={simulation.virality_risk_score > 60 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                            {simulation.virality_risk_score}% risk
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1">{simulation.input_summary}</p>
                        <p className="text-xs text-muted-foreground mb-1">{simulation.predicted_sentiment_shift}</p>
                        <p className="text-xs text-blue-600">{simulation.recommended_tactic}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="disruption" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Report Actor for Disruption</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Actor handle/username..."
                    value={newDisruption.actor_handle}
                    onChange={(e) => setNewDisruption({ ...newDisruption, actor_handle: e.target.value })}
                  />
                  
                  <Select value={newDisruption.reason} onValueChange={(value: any) => setNewDisruption({ ...newDisruption, reason: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="impersonation">Impersonation</SelectItem>
                      <SelectItem value="spam">Spam</SelectItem>
                      <SelectItem value="harmful_content">Harmful Content</SelectItem>
                      <SelectItem value="platform_violation">Platform Violation</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Evidence URL..."
                    value={newDisruption.evidence_url}
                    onChange={(e) => setNewDisruption({ ...newDisruption, evidence_url: e.target.value })}
                  />
                  
                  <Select value={newDisruption.platform} onValueChange={(value) => setNewDisruption({ ...newDisruption, platform: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={reportActorDisruption} className="w-full">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Submit Disruption Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Disruption Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {actorDisruptions.map((disruption) => (
                      <div key={disruption.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{disruption.platform}</Badge>
                          <Badge className={disruption.reported_to_platform ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                            {disruption.reported_to_platform ? 'Reported' : 'Pending'}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">@{disruption.actor_handle}</p>
                        <p className="text-xs text-muted-foreground">Reason: {disruption.reason}</p>
                        {disruption.evidence_url && (
                          <a href={disruption.evidence_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600">
                            View Evidence
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Alert className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            All offensive response actions are logged for transparency and compliance. Use responsibly and in accordance with platform terms of service.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default OffensiveResponseToolkit;
