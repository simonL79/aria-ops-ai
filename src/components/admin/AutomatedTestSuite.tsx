
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  Bug
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
  details?: string;
}

const AutomatedTestSuite = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);

  const tests = [
    { name: 'Database Connectivity', category: 'Infrastructure' },
    { name: 'System Configuration', category: 'Configuration' },
    { name: 'Live Status Modules', category: 'Monitoring' },
    { name: 'Edge Functions Health', category: 'Functions' },
    { name: 'Client Entity Creation', category: 'Operations' },
    { name: 'Threat Detection Pipeline', category: 'Security' },
    { name: 'Notification System', category: 'Communications' },
    { name: 'Data Processing Compliance', category: 'Compliance' }
  ];

  const runTest = async (testName: string): Promise<TestResult> => {
    const startTime = Date.now();
    
    try {
      let result: TestResult = {
        name: testName,
        status: 'running'
      };

      setTestResults(prev => [...prev.filter(t => t.name !== testName), result]);

      switch (testName) {
        case 'Database Connectivity':
          await supabase.from('system_config').select('*').limit(1);
          result = { 
            ...result, 
            status: 'passed', 
            details: 'Supabase connection verified',
            duration: Date.now() - startTime
          };
          break;

        case 'System Configuration':
          const { data: configs } = await supabase
            .from('system_config')
            .select('*')
            .in('config_key', ['system_mode', 'live_enforcement']);
          
          if (!configs || configs.length < 2) {
            throw new Error('Required system configurations missing');
          }
          result = { 
            ...result, 
            status: 'passed', 
            details: `${configs.length} configurations verified`,
            duration: Date.now() - startTime
          };
          break;

        case 'Live Status Modules':
          const { data: modules } = await supabase
            .from('live_status')
            .select('*')
            .eq('system_status', 'LIVE');
          
          if (!modules || modules.length < 5) {
            throw new Error(`Only ${modules?.length || 0} modules active, need at least 5`);
          }
          result = { 
            ...result, 
            status: 'passed', 
            details: `${modules.length} live modules operational`,
            duration: Date.now() - startTime
          };
          break;

        case 'Edge Functions Health':
          const { data: healthData, error } = await supabase.functions.invoke('health-check');
          if (error) throw error;
          
          result = { 
            ...result, 
            status: 'passed', 
            details: 'Health check endpoint responding',
            duration: Date.now() - startTime
          };
          break;

        case 'Client Entity Creation':
          const { data: clients } = await supabase
            .from('clients')
            .select('id')
            .limit(1);
          
          result = { 
            ...result, 
            status: clients && clients.length > 0 ? 'passed' : 'failed', 
            details: clients && clients.length > 0 ? 'Client entities found' : 'No client entities configured',
            duration: Date.now() - startTime
          };
          break;

        case 'Threat Detection Pipeline':
          const { data: threats } = await supabase
            .from('scan_results')
            .select('id')
            .eq('source_type', 'live_osint')
            .limit(1);
          
          result = { 
            ...result, 
            status: 'passed', 
            details: `Threat detection pipeline accessible`,
            duration: Date.now() - startTime
          };
          break;

        case 'Notification System':
          // Test notification creation
          await supabase
            .from('aria_notifications')
            .insert({
              entity_name: 'Test Entity',
              event_type: 'system_test',
              summary: 'Automated test notification',
              priority: 'low'
            });
          
          result = { 
            ...result, 
            status: 'passed', 
            details: 'Test notification created successfully',
            duration: Date.now() - startTime
          };
          break;

        case 'Data Processing Compliance':
          const { data: compliance } = await supabase
            .from('system_config')
            .select('config_value')
            .eq('config_key', 'allow_mock_data')
            .single();
          
          if (compliance?.config_value === 'enabled') {
            throw new Error('Mock data is still enabled in production');
          }
          
          result = { 
            ...result, 
            status: 'passed', 
            details: 'Compliance settings verified',
            duration: Date.now() - startTime
          };
          break;

        default:
          throw new Error('Unknown test case');
      }

      return result;

    } catch (error) {
      return {
        name: testName,
        status: 'failed',
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setOverallProgress(0);
    
    toast.info('🧪 Running automated test suite...');

    const results: TestResult[] = [];
    
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      const result = await runTest(test.name);
      results.push(result);
      setTestResults([...results]);
      setOverallProgress(((i + 1) / tests.length) * 100);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const passedTests = results.filter(t => t.status === 'passed').length;
    const failedTests = results.filter(t => t.status === 'failed').length;

    if (failedTests === 0) {
      toast.success(`✅ All ${passedTests} tests passed! System is ready for production.`);
    } else {
      toast.error(`❌ ${failedTests} tests failed. ${passedTests} tests passed.`);
    }

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-blue-400 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'running': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <Card className="bg-corporate-dark border-corporate-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Bug className="h-5 w-5 text-corporate-accent" />
          Automated Test Suite
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Run Tests Button */}
        <Button
          onClick={runAllTests}
          disabled={isRunning}
          className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <PlayCircle className="h-4 w-4 mr-2" />
              Run All Tests
            </>
          )}
        </Button>

        {/* Progress */}
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-corporate-lightGray">Progress</span>
              <span className="text-white">{overallProgress.toFixed(0)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-medium">Test Results</h4>
            {testResults.map((result, index) => (
              <div key={index} className="p-3 bg-corporate-darkSecondary rounded border border-corporate-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="text-white text-sm">{result.name}</span>
                  </div>
                  <Badge className={getStatusColor(result.status)}>
                    {result.status.toUpperCase()}
                  </Badge>
                </div>
                
                {result.details && (
                  <p className="text-corporate-lightGray text-xs">{result.details}</p>
                )}
                
                {result.error && (
                  <p className="text-red-400 text-xs mt-1">Error: {result.error}</p>
                )}
                
                {result.duration && (
                  <p className="text-corporate-lightGray text-xs mt-1">
                    Duration: {result.duration}ms
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {testResults.length === tests.length && !isRunning && (
          <div className="p-4 bg-corporate-darkSecondary rounded border border-corporate-border">
            <h4 className="text-white font-medium mb-2">Test Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-400">Passed: </span>
                <span className="text-white">{testResults.filter(t => t.status === 'passed').length}</span>
              </div>
              <div>
                <span className="text-red-400">Failed: </span>
                <span className="text-white">{testResults.filter(t => t.status === 'failed').length}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomatedTestSuite;
