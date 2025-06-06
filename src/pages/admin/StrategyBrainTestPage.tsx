
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Play, 
  Square, 
  RotateCcw, 
  CheckCircle,
  AlertTriangle,
  Zap,
  Target
} from 'lucide-react';
import { toast } from 'sonner';

const StrategyBrainTestPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testScenario, setTestScenario] = useState('');
  const [entityName, setEntityName] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const runStrategyTest = async () => {
    if (!testScenario.trim() || !entityName.trim()) {
      toast.error('Please provide both entity name and test scenario');
      return;
    }

    setIsRunning(true);
    
    try {
      // Simulate strategy brain processing
      const mockResults = [
        {
          id: 1,
          phase: 'Intelligence Gathering',
          status: 'completed',
          duration: '2.3s',
          findings: `Identified 5 potential threat vectors for ${entityName}`,
          confidence: 87
        },
        {
          id: 2,
          phase: 'Threat Classification',
          status: 'completed',
          duration: '1.8s',
          findings: 'Classified as reputation threat, severity level 6/10',
          confidence: 92
        },
        {
          id: 3,
          phase: 'Response Strategy',
          status: 'completed',
          duration: '3.1s',
          findings: 'Generated defensive content strategy with 3 deployment vectors',
          confidence: 89
        },
        {
          id: 4,
          phase: 'Risk Assessment',
          status: 'completed',
          duration: '1.5s',
          findings: 'Calculated potential impact: Medium-High risk to brand reputation',
          confidence: 94
        }
      ];

      // Simulate processing delay
      for (let i = 0; i < mockResults.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setResults(prev => [...prev, mockResults[i]]);
      }

      toast.success('Strategy Brain test completed successfully');
    } catch (error) {
      toast.error('Strategy test failed');
    } finally {
      setIsRunning(false);
    }
  };

  const resetTest = () => {
    setResults([]);
    setTestScenario('');
    setEntityName('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running':
        return <Zap className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Square className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-600" />
              Strategy Brain Test Console
            </h1>
            <p className="text-muted-foreground">Test A.R.I.A™ strategic decision-making capabilities</p>
          </div>
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            <Target className="h-3 w-3 mr-1" />
            Test Environment
          </Badge>
        </div>

        {/* Test Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Entity Name</label>
                <Input
                  value={entityName}
                  onChange={(e) => setEntityName(e.target.value)}
                  placeholder="e.g., Acme Corp, John Smith"
                  disabled={isRunning}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Test Type</label>
                <select className="w-full p-2 border rounded-md" disabled={isRunning}>
                  <option>Reputation Threat Response</option>
                  <option>Crisis Management</option>
                  <option>Preventive Strategy</option>
                  <option>Counter-Intelligence</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Test Scenario</label>
              <Textarea
                value={testScenario}
                onChange={(e) => setTestScenario(e.target.value)}
                placeholder="Describe the threat scenario you want to test the Strategy Brain against..."
                className="min-h-[100px]"
                disabled={isRunning}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={runStrategyTest}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <Square className="h-4 w-4" />
                    Running Test...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Strategy Test
                  </>
                )}
              </Button>

              <Button 
                variant="outline"
                onClick={resetTest}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Strategy Brain Processing Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <h4 className="font-medium">{result.phase}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {result.findings}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{result.duration}</div>
                      <div className="text-muted-foreground">
                        {result.confidence}% confidence
                      </div>
                    </div>
                  </div>
                ))}

                {isRunning && (
                  <div className="flex items-center gap-3 p-4 border rounded-lg border-blue-200 bg-blue-50">
                    <Zap className="h-4 w-4 text-blue-600 animate-pulse" />
                    <div>
                      <h4 className="font-medium text-blue-900">Processing...</h4>
                      <p className="text-sm text-blue-700">
                        Strategy Brain is analyzing the scenario and generating response strategies
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {results.length === 4 && !isRunning && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Test Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-green-700">Total Time:</span>
                      <div className="font-medium">8.7 seconds</div>
                    </div>
                    <div>
                      <span className="text-green-700">Avg Confidence:</span>
                      <div className="font-medium">90.5%</div>
                    </div>
                    <div>
                      <span className="text-green-700">Success Rate:</span>
                      <div className="font-medium">100%</div>
                    </div>
                    <div>
                      <span className="text-green-700">Recommendations:</span>
                      <div className="font-medium">3 strategies</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>Strategy Brain System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">Online</div>
                <p className="text-sm text-muted-foreground">System Status</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">4.2s</div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">847</div>
                <p className="text-sm text-muted-foreground">Strategies Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StrategyBrainTestPage;
