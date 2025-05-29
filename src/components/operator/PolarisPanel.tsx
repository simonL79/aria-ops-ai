
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Target, Send, Lightbulb, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface CounterNarrative {
  id: string;
  threat_id?: string;
  generated_text: string;
  strategy: string;
  tone: string;
  deployment_status: string;
  generated_by: string;
  created_at: string;
}

interface DeploymentLog {
  id: string;
  narrative_id: string;
  platform: string;
  target_url?: string;
  deployment_result?: string;
  deployed_at?: string;
  created_at: string;
}

export const PolarisPanel = () => {
  const [counterNarratives, setCounterNarratives] = useState<CounterNarrative[]>([]);
  const [deploymentLogs, setDeploymentLogs] = useState<DeploymentLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPolarisData();
  }, []);

  const loadPolarisData = async () => {
    await Promise.all([loadCounterNarratives(), loadDeploymentLogs()]);
  };

  const loadCounterNarratives = async () => {
    try {
      // Use mock data since tables are newly created
      const mockData: CounterNarrative[] = [
        {
          id: '1',
          threat_id: 'threat-001',
          generated_text: 'We appreciate your feedback and take all concerns seriously. Our team is actively working to address these issues and improve our services.',
          strategy: 'reframe',
          tone: 'empathetic',
          deployment_status: 'pending',
          generated_by: 'POLARIS-GPT',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          threat_id: 'threat-002',
          generated_text: 'Thank you for bringing this to our attention. We have investigated the matter thoroughly and found the claims to be inaccurate.',
          strategy: 'denial',
          tone: 'neutral',
          deployment_status: 'deployed',
          generated_by: 'POLARIS-GPT',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          threat_id: 'threat-003',
          generated_text: 'We understand your concerns. Here are the facts about our recent initiatives and the positive impact they have had on our community.',
          strategy: 'redirect',
          tone: 'assertive',
          deployment_status: 'rejected',
          generated_by: 'POLARIS-GPT',
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setCounterNarratives(mockData);
    } catch (error) {
      console.error('Error loading counter narratives:', error);
      setCounterNarratives([]);
    }
  };

  const loadDeploymentLogs = async () => {
    try {
      const mockData: DeploymentLog[] = [
        {
          id: '1',
          narrative_id: '2',
          platform: 'twitter',
          target_url: 'https://twitter.com/example/status/123',
          deployment_result: 'Successfully posted counter-narrative',
          deployed_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          narrative_id: '1',
          platform: 'facebook',
          target_url: 'https://facebook.com/example/post/456',
          deployment_result: 'Pending platform approval',
          deployed_at: null,
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          narrative_id: '2',
          platform: 'linkedin',
          target_url: 'https://linkedin.com/posts/example-789',
          deployment_result: 'Deployment failed - platform rejected content',
          deployed_at: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setDeploymentLogs(mockData);
    } catch (error) {
      console.error('Error loading deployment logs:', error);
      setDeploymentLogs([]);
    }
  };

  const getStrategyColor = (strategy: string) => {
    switch (strategy) {
      case 'denial':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'reframe':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'redirect':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'affirmation':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'neutral':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
      case 'assertive':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'empathetic':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'deployed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const generateCounterNarrative = async () => {
    setIsLoading(true);
    try {
      const strategies = ['denial', 'reframe', 'redirect', 'affirmation'];
      const tones = ['neutral', 'assertive', 'empathetic'];
      const templates = [
        'We appreciate your feedback and are committed to transparency and continuous improvement.',
        'Thank you for your concern. We have reviewed the matter and would like to provide clarity.',
        'We understand your perspective and want to share our side of the story.',
        'Your feedback is valuable to us. Here are the facts about this situation.',
        'We take all feedback seriously and want to address your concerns directly.'
      ];
      
      const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)];
      const randomTone = tones[Math.floor(Math.random() * tones.length)];
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      
      const newNarrative: CounterNarrative = {
        id: Date.now().toString(),
        threat_id: `auto-threat-${Date.now()}`,
        generated_text: randomTemplate,
        strategy: randomStrategy,
        tone: randomTone,
        deployment_status: 'pending',
        generated_by: 'POLARIS-GPT',
        created_at: new Date().toISOString()
      };

      setCounterNarratives(prev => [newNarrative, ...prev.slice(0, 9)]);
      toast.success('Counter-narrative generated by POLARIS™');
    } catch (error) {
      console.error('Error generating counter narrative:', error);
      toast.error('Failed to generate counter-narrative');
    } finally {
      setIsLoading(false);
    }
  };

  const deployNarrative = async () => {
    setIsLoading(true);
    try {
      const platforms = ['twitter', 'facebook', 'linkedin', 'reddit', 'medium'];
      const pendingNarratives = counterNarratives.filter(n => n.deployment_status === 'pending');
      
      if (pendingNarratives.length === 0) {
        toast.info('No pending narratives to deploy');
        return;
      }

      const narrativeToDeploy = pendingNarratives[0];
      const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];
      
      const newDeployment: DeploymentLog = {
        id: Date.now().toString(),
        narrative_id: narrativeToDeploy.id,
        platform: randomPlatform,
        target_url: `https://${randomPlatform}.com/deployed/${Date.now()}`,
        deployment_result: 'Successfully deployed counter-narrative',
        deployed_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      setDeploymentLogs(prev => [newDeployment, ...prev.slice(0, 9)]);
      setCounterNarratives(prev => 
        prev.map(n => 
          n.id === narrativeToDeploy.id 
            ? { ...n, deployment_status: 'deployed' }
            : n
        )
      );
      
      toast.success('Counter-narrative deployed successfully');
    } catch (error) {
      console.error('Error deploying narrative:', error);
      toast.error('Failed to deploy counter-narrative');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Counter-Narrative Generator */}
      <Card className="bg-black border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            POLARIS™ Counter-Narrative Generator
            <Button
              size="sm"
              onClick={generateCounterNarrative}
              disabled={isLoading}
              className="ml-auto text-xs bg-cyan-600 hover:bg-cyan-700"
            >
              <Lightbulb className="h-3 w-3 mr-1" />
              Generate
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {counterNarratives.length === 0 ? (
            <div className="text-gray-500 text-sm">No counter-narratives generated</div>
          ) : (
            counterNarratives.map((narrative) => (
              <div key={narrative.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <MessageSquare className="h-4 w-4 text-cyan-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-cyan-300">[{narrative.generated_by}]</span>
                  </div>
                  <div className="text-xs text-cyan-400 mb-1">
                    {narrative.generated_text.length > 80 ? 
                      `${narrative.generated_text.substring(0, 77)}...` : 
                      narrative.generated_text
                    }
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(narrative.created_at).toLocaleTimeString()} | 
                    Threat: {narrative.threat_id?.substring(0, 8)}...
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getStrategyColor(narrative.strategy)}>
                    {narrative.strategy}
                  </Badge>
                  <Badge className={getToneColor(narrative.tone)}>
                    {narrative.tone}
                  </Badge>
                  <Badge className={getStatusColor(narrative.deployment_status)}>
                    {narrative.deployment_status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Deployment Hub */}
      <Card className="bg-black border-green-500/30">
        <CardHeader>
          <CardTitle className="text-green-400 text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Narrative Deployment Hub
            <Button
              size="sm"
              onClick={deployNarrative}
              disabled={isLoading}
              className="ml-auto text-xs bg-green-600 hover:bg-green-700"
            >
              <Send className="h-3 w-3 mr-1" />
              Deploy
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {deploymentLogs.length === 0 ? (
            <div className="text-gray-500 text-sm">No deployments logged</div>
          ) : (
            deploymentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Target className="h-4 w-4 text-green-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-green-300">[{log.platform.toUpperCase()}]</span>
                  </div>
                  <div className="text-xs text-green-400 mb-1">
                    {log.deployment_result || 'Deployment in progress...'}
                  </div>
                  {log.target_url && (
                    <div className="text-xs text-blue-400 mb-1">
                      {log.target_url.length > 40 ? `${log.target_url.substring(0, 37)}...` : log.target_url}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    {log.deployed_at ? 
                      `Deployed: ${new Date(log.deployed_at).toLocaleTimeString()}` : 
                      `Queued: ${new Date(log.created_at).toLocaleTimeString()}`
                    }
                  </div>
                </div>
                <div className="flex items-center">
                  {log.deployed_at ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-400 animate-spin" />
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
