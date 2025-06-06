
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Play, 
  Server,
  Activity
} from 'lucide-react';
import { useLocalInference } from '@/hooks/useLocalInference';
import { checkServerHealth } from '@/services/localInference/serverMonitor';
import { toast } from 'sonner';

interface LocalAITestModuleProps {
  selectedEntity: string;
}

const LocalAITestModule: React.FC<LocalAITestModuleProps> = ({ selectedEntity }) => {
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [testContent, setTestContent] = useState('');
  const [testResults, setTestResults] = useState<any>(null);
  const { analyzeThreat, isAnalyzing } = useLocalInference();

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const health = await checkServerHealth();
      setServerStatus(health);
    } catch (error) {
      console.error('Health check failed:', error);
    }
  };

  const runLocalTest = async () => {
    if (!testContent.trim()) {
      toast.error('Please enter test content');
      return;
    }

    if (!selectedEntity.trim()) {
      toast.error('Please select an entity first');
      return;
    }

    try {
      const result = await analyzeThreat(testContent, 'test_platform', selectedEntity, true);
      setTestResults(result);
      
      if (result) {
        toast.success('Local AI analysis completed');
      } else {
        toast.error('Local AI analysis failed');
      }
    } catch (error) {
      toast.error('Local AI test failed');
      console.error('Local AI test error:', error);
    }
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-4">
      {/* Server Status */}
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardHeader>
          <CardTitle className="text-corporate-accent flex items-center gap-2">
            <Server className="h-5 w-5" />
            Local AI Server Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`text-xl font-bold ${getStatusColor(serverStatus?.isOnline)}`}>
                {serverStatus?.isOnline ? (
                  <><CheckCircle className="h-5 w-5 mx-auto mb-1" />ONLINE</>
                ) : (
                  <><XCircle className="h-5 w-5 mx-auto mb-1" />OFFLINE</>
                )}
              </div>
              <div className="text-xs text-corporate-lightGray">Server Status</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-400">
                {serverStatus?.responseTime || 0}ms
              </div>
              <div className="text-xs text-corporate-lightGray">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">
                {serverStatus?.modelsLoaded || 0}
              </div>
              <div className="text-xs text-corporate-lightGray">Models Loaded</div>
            </div>
          </div>
          
          {serverStatus?.memoryUsage && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-corporate-lightGray">Memory Usage</span>
                <span className="text-white">{serverStatus.memoryUsage.toFixed(1)}%</span>
              </div>
              <Progress value={serverStatus.memoryUsage} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Local AI Test */}
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardHeader>
          <CardTitle className="text-corporate-accent flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Local AI Test Console
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block text-corporate-lightGray">
              Entity Context
            </label>
            <Input
              value={selectedEntity}
              disabled
              className="bg-corporate-dark border-corporate-border text-white"
              placeholder="Select an entity in the main console"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block text-corporate-lightGray">
              Test Content
            </label>
            <Textarea
              value={testContent}
              onChange={(e) => setTestContent(e.target.value)}
              placeholder="Enter content to analyze with local AI..."
              className="bg-corporate-dark border-corporate-border text-white min-h-[80px]"
            />
          </div>

          <Button
            onClick={runLocalTest}
            disabled={isAnalyzing || !serverStatus?.isOnline}
            className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            {isAnalyzing ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Local AI Test
              </>
            )}
          </Button>

          {testResults && (
            <div className="p-3 bg-corporate-dark rounded border border-corporate-border">
              <h4 className="text-sm font-medium text-corporate-accent mb-2">Analysis Results</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Threat Level:</span>
                  <Badge variant="outline" className="text-red-400 border-red-400">
                    {testResults.threatLevel}/10
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Category:</span>
                  <span className="text-white">{testResults.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Confidence:</span>
                  <span className="text-green-400">{(testResults.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-corporate-lightGray">Analysis Time:</span>
                  <span className="text-blue-400">{testResults.analysisTime}ms</span>
                </div>
                <div className="mt-2">
                  <span className="text-corporate-lightGray">Explanation:</span>
                  <p className="text-white text-xs mt-1">{testResults.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalAITestModule;
