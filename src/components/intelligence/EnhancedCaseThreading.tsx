
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitBranch, Plus, Link, Clock, User, Target, FileText } from 'lucide-react';
import { langchainOrchestrator } from '@/services/ai/langchainOrchestrator';
import { enhancedCorrelationEngine } from '@/services/intelligence/enhancedCorrelationEngine';
import { toast } from 'sonner';

interface CaseThread {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'monitoring' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  threats: string[];
  assignedTo?: string;
  created: Date;
  lastActivity: Date;
  tags: string[];
  aiSummary?: string;
  playbook?: string;
  correlations: number;
  riskScore: number;
}

interface Playbook {
  id: string;
  name: string;
  description: string;
  steps: PlaybookStep[];
  triggers: string[];
  category: 'response' | 'investigation' | 'escalation' | 'monitoring';
}

interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  type: 'manual' | 'automated' | 'ai_assisted';
  estimatedTime: number;
  dependencies?: string[];
}

interface EnhancedCaseThreadingProps {
  selectedThreats: string[];
  onCaseCreated?: (caseThread: CaseThread) => void;
}

const EnhancedCaseThreading = ({ selectedThreats, onCaseCreated }: EnhancedCaseThreadingProps) => {
  const [cases, setCases] = useState<CaseThread[]>([]);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [activeTab, setActiveTab] = useState('cases');
  const [isCreating, setIsCreating] = useState(false);
  const [newCase, setNewCase] = useState({
    title: '',
    description: '',
    priority: 'medium' as CaseThread['priority'],
    assignedTo: '',
    tags: ''
  });

  useEffect(() => {
    loadCases();
    loadPlaybooks();
  }, []);

  const loadCases = () => {
    // Simulate loading cases
    const simulatedCases: CaseThread[] = [
      {
        id: 'case_1',
        title: 'Coordinated Social Media Campaign',
        description: 'Multiple accounts posting similar negative content across platforms',
        status: 'active',
        priority: 'high',
        threats: ['threat_1', 'threat_2', 'threat_3'],
        assignedTo: 'analyst1',
        created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 30 * 60 * 1000),
        tags: ['coordinated', 'multi-platform', 'urgent'],
        aiSummary: 'AI analysis indicates 85% probability of coordinated campaign with central coordination.',
        correlations: 5,
        riskScore: 78
      },
      {
        id: 'case_2',
        title: 'Product Review Manipulation',
        description: 'Suspicious pattern in negative product reviews',
        status: 'monitoring',
        priority: 'medium',
        threats: ['threat_4', 'threat_5'],
        created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
        tags: ['reviews', 'manipulation', 'ecommerce'],
        correlations: 2,
        riskScore: 45
      }
    ];
    
    setCases(simulatedCases);
  };

  const loadPlaybooks = () => {
    const simulatedPlaybooks: Playbook[] = [
      {
        id: 'playbook_1',
        name: 'Coordinated Attack Response',
        description: 'Standard response protocol for coordinated reputation attacks',
        category: 'response',
        triggers: ['coordinated', 'multi-platform', 'high-volume'],
        steps: [
          {
            id: 'step_1',
            title: 'Initial Assessment',
            description: 'Assess scope and severity of the coordinated attack',
            type: 'manual',
            estimatedTime: 30
          },
          {
            id: 'step_2',
            title: 'AI Threat Analysis',
            description: 'Run AI analysis to identify patterns and predict escalation',
            type: 'ai_assisted',
            estimatedTime: 15,
            dependencies: ['step_1']
          },
          {
            id: 'step_3',
            title: 'Platform Notification',
            description: 'Notify relevant platforms of coordinated inauthentic behavior',
            type: 'manual',
            estimatedTime: 45,
            dependencies: ['step_2']
          },
          {
            id: 'step_4',
            title: 'Counter-Narrative Development',
            description: 'Develop strategic counter-narrative and response messaging',
            type: 'ai_assisted',
            estimatedTime: 60,
            dependencies: ['step_2']
          }
        ]
      },
      {
        id: 'playbook_2',
        name: 'Review Manipulation Investigation',
        description: 'Investigation protocol for suspected review manipulation',
        category: 'investigation',
        triggers: ['reviews', 'manipulation', 'patterns'],
        steps: [
          {
            id: 'step_1',
            title: 'Pattern Analysis',
            description: 'Analyze review patterns for manipulation indicators',
            type: 'automated',
            estimatedTime: 20
          },
          {
            id: 'step_2',
            title: 'Account Verification',
            description: 'Verify authenticity of reviewer accounts',
            type: 'manual',
            estimatedTime: 90,
            dependencies: ['step_1']
          },
          {
            id: 'step_3',
            title: 'Platform Reporting',
            description: 'Report suspicious reviews to platform moderation',
            type: 'manual',
            estimatedTime: 30,
            dependencies: ['step_2']
          }
        ]
      }
    ];
    
    setPlaybooks(simulatedPlaybooks);
  };

  const createCase = async () => {
    if (!newCase.title.trim() || selectedThreats.length === 0) {
      toast.error('Please provide a title and select threats');
      return;
    }

    setIsCreating(true);
    try {
      // Generate AI summary
      const correlations = await enhancedCorrelationEngine.analyzeThreats(selectedThreats);
      
      let aiSummary = '';
      if (correlations.length > 0) {
        const execution = await langchainOrchestrator.executeChain('threat_correlation_analysis', {
          threats: JSON.stringify(selectedThreats)
        });
        aiSummary = execution.result || 'AI analysis completed';
      }

      const caseThread: CaseThread = {
        id: `case_${Date.now()}`,
        title: newCase.title,
        description: newCase.description,
        status: 'active',
        priority: newCase.priority,
        threats: selectedThreats,
        assignedTo: newCase.assignedTo || undefined,
        created: new Date(),
        lastActivity: new Date(),
        tags: newCase.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        aiSummary,
        correlations: correlations.length,
        riskScore: Math.round(correlations.reduce((sum, c) => sum + c.confidence, 0) / correlations.length * 100) || 0
      };

      setCases(prev => [caseThread, ...prev]);
      onCaseCreated?.(caseThread);
      
      // Reset form
      setNewCase({
        title: '',
        description: '',
        priority: 'medium',
        assignedTo: '',
        tags: ''
      });
      
      toast.success('Case thread created successfully');
      
    } catch (error) {
      console.error('Failed to create case:', error);
      toast.error('Failed to create case thread');
    } finally {
      setIsCreating(false);
    }
  };

  const assignPlaybook = async (caseId: string, playbookId: string) => {
    try {
      setCases(prev => prev.map(c => 
        c.id === caseId ? { ...c, playbook: playbookId } : c
      ));
      
      toast.success('Playbook assigned to case');
    } catch (error) {
      console.error('Failed to assign playbook:', error);
      toast.error('Failed to assign playbook');
    }
  };

  const updateCaseStatus = (caseId: string, status: CaseThread['status']) => {
    setCases(prev => prev.map(c => 
      c.id === caseId ? { ...c, status, lastActivity: new Date() } : c
    ));
    
    toast.success(`Case status updated to ${status}`);
  };

  const getStatusColor = (status: CaseThread['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'monitoring': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'escalated': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: CaseThread['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlaybookByCategory = (category: Playbook['category']) => {
    return playbooks.filter(p => p.category === category);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Enhanced Case Threading
        </CardTitle>
        <CardDescription>
          AI-powered case management with automated playbooks and correlation analysis
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cases">Active Cases ({cases.filter(c => c.status === 'active').length})</TabsTrigger>
            <TabsTrigger value="create">Create Case</TabsTrigger>
            <TabsTrigger value="playbooks">Playbooks ({playbooks.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cases" className="space-y-4">
            {cases.map(caseThread => (
              <div key={caseThread.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{caseThread.title}</h4>
                      <Badge className={getStatusColor(caseThread.status)}>
                        {caseThread.status}
                      </Badge>
                      <Badge className={getPriorityColor(caseThread.priority)}>
                        {caseThread.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {caseThread.description}
                    </p>
                    
                    {caseThread.aiSummary && (
                      <div className="bg-blue-50 p-2 rounded text-sm mb-2">
                        <strong>AI Analysis:</strong> {caseThread.aiSummary}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-sm">
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="h-3 w-3" />
                      Risk: {caseThread.riskScore}%
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <Link className="h-3 w-3" />
                      {caseThread.correlations} correlations
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {Math.round((Date.now() - caseThread.lastActivity.getTime()) / 60000)}m ago
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {caseThread.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select onValueChange={(playbookId) => assignPlaybook(caseThread.id, playbookId)}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Assign playbook" />
                      </SelectTrigger>
                      <SelectContent>
                        {playbooks.map(playbook => (
                          <SelectItem key={playbook.id} value={playbook.id}>
                            {playbook.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select onValueChange={(status) => updateCaseStatus(caseThread.id, status as CaseThread['status'])}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="monitoring">Monitoring</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="escalated">Escalated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            
            {cases.length === 0 && (
              <div className="text-center py-8">
                <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No case threads created yet</p>
                <p className="text-sm text-muted-foreground">Create your first case to start organizing threats</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Case Title</label>
                <Input
                  placeholder="Enter case title..."
                  value={newCase.title}
                  onChange={(e) => setNewCase(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe the case and its objectives..."
                  value={newCase.description}
                  onChange={(e) => setNewCase(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={newCase.priority} onValueChange={(value) => setNewCase(prev => ({ ...prev, priority: value as CaseThread['priority'] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Assigned To</label>
                  <Input
                    placeholder="Analyst email..."
                    value={newCase.assignedTo}
                    onChange={(e) => setNewCase(prev => ({ ...prev, assignedTo: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input
                  placeholder="coordinated, urgent, multi-platform..."
                  value={newCase.tags}
                  onChange={(e) => setNewCase(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
              
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">Selected Threats</p>
                <p className="text-sm text-muted-foreground">
                  {selectedThreats.length} threat{selectedThreats.length !== 1 ? 's' : ''} selected
                </p>
              </div>
              
              <Button onClick={createCase} disabled={isCreating || !newCase.title.trim() || selectedThreats.length === 0}>
                {isCreating ? (
                  <>Creating case...</>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                    Create Case Thread
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="playbooks" className="space-y-4">
            {['response', 'investigation', 'escalation', 'monitoring'].map(category => (
              <div key={category}>
                <h4 className="font-medium mb-2 capitalize">{category} Playbooks</h4>
                <div className="space-y-2">
                  {getPlaybookByCategory(category as Playbook['category']).map(playbook => (
                    <div key={playbook.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="font-medium">{playbook.name}</h5>
                          <p className="text-sm text-muted-foreground">{playbook.description}</p>
                        </div>
                        <Badge variant="outline">
                          {playbook.steps.length} steps
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <strong>Triggers:</strong> {playbook.triggers.join(', ')}
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        {playbook.steps.slice(0, 3).map(step => (
                          <div key={step.id} className="text-xs bg-muted p-1 rounded">
                            {step.title} ({step.estimatedTime}min)
                          </div>
                        ))}
                        {playbook.steps.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{playbook.steps.length - 3} more steps...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedCaseThreading;
