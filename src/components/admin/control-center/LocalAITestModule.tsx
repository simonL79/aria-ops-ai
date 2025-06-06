
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
  Activity,
  RefreshCw,
  AlertCircle
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
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [showConnectionDetails, setShowConnectionDetails] = useState(false);
  const { analyzeThreat, isAnalyzing } = useLocalInference();

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const health = await checkServerHealth();
      setServerStatus(health);
      
      if (health.isOnline) {
        toast.success(`Local AI server connected successfully! ${health.modelsLoaded} models loaded`);
      } else {
        toast.error(`Server connection failed: ${health.errorDetails}`);
        setShowConnectionDetails(true); // Auto-show details on failure
      }
    } catch (error) {
      console.error('Health check failed:', error);
      toast.error('Health check failed');
    } finally {
      setIsCheckingHealth(false);
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
          <CardTitle className="text-corporate-accent flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Local AI Server Status
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={checkHealth}
                disabled={isCheckingHealth}
                className="text-corporate-accent border-corporate-accent"
              >
                {isCheckingHealth ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Check Now
              </Button>
              {serverStatus && !serverStatus.isOnline && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConnectionDetails(!showConnectionDetails)}
                  className="text-yellow-400"
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Details
                </Button>
              )}
            </div>
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

          {/* Connection Error Details */}
          {serverStatus && !serverStatus.isOnline && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-600 rounded">
              <div className="text-red-400 text-sm">
                <strong>Connection Error:</strong> {serverStatus.errorDetails}
              </div>
              <div className="text-red-300 text-xs mt-1">
                Server Type: {serverStatus.serverType}
              </div>
              
              {showConnectionDetails && serverStatus.connectionAttempts && (
                <div className="mt-3 p-2 bg-red-950/30 rounded border border-red-700">
                  <div className="text-red-300 text-xs font-medium mb-2">Connection Attempts:</div>
                  <div className="space-y-1">
                    {serverStatus.connectionAttempts.map((attempt: string, index: number) => (
                      <div key={index} className="text-xs font-mono text-red-200">
                        {attempt}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-2 text-yellow-300 text-xs">
                <strong>Troubleshooting:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Ensure Ollama is running: <code className="bg-black/30 px-1">ollama serve</code></li>
                  <li>Check CORS origins include Lovable domains</li>
                  <li>Verify server is on port 3001: <code className="bg-black/30 px-1">OLLAMA_HOST=0.0.0.0:3001</code></li>
                </ul>
              </div>
            </div>
          )}

          {/* Success Details */}
          {serverStatus && serverStatus.isOnline && serverStatus.connectionAttempts && (
            <div className="mt-4 p-3 bg-green-900/20 border border-green-600 rounded">
              <div className="text-green-400 text-sm">
                <strong>✅ Connection Successful!</strong> Server: {serverStatus.serverType}
              </div>
              {showConnectionDetails && (
                <div className="mt-2 text-green-300 text-xs">
                  Working endpoint found in {serverStatus.connectionAttempts.length} attempts
                </div>
              )}
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

          {!serverStatus?.isOnline && (
            <div className="text-center text-yellow-400 text-sm">
              Server must be online to run tests
            </div>
          )}

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
