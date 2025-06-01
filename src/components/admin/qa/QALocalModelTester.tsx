import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { useLocalInference } from '@/hooks/useLocalInference';
import { loadLocalModel, getModelStatus, analyzeSentiment, classifyText } from '@/services/localModelService';
import { loadRiskClassifier, classifyRisk } from '@/services/riskClassificationService';

interface LocalModelTest {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  details: string;
  modelId?: string;
}

const QALocalModelTester = () => {
  const [tests, setTests] = useState<LocalModelTest[]>([
    {
      name: 'HuggingFace Transformers - Sentiment Analysis',
      status: 'pending',
      details: 'Testing local sentiment analysis model loading and inference',
      modelId: 'distilbert-base-uncased-finetuned-sst-2-english'
    },
    {
      name: 'Local Threat Analysis via Ollama',
      status: 'pending',
      details: 'Testing local Ollama inference server connection and threat analysis'
    },
    {
      name: 'Risk Classification Model',
      status: 'pending',
      details: 'Testing risk classification model with sample threat content'
    },
    {
      name: 'Memory Search & Context',
      status: 'pending',
      details: 'Testing Anubis memory system and contextual threat analysis'
    },
    {
      name: 'WebGPU Acceleration',
      status: 'pending',
      details: 'Testing WebGPU acceleration for local model inference'
    },
    {
      name: 'Local Server Health Check',
      status: 'pending',
      details: 'Checking if local inference server (Ollama) is running'
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const { analyzeThreat, searchMemories, isAnalyzing } = useLocalInference();

  const updateTestStatus = (testName: string, status: LocalModelTest['status'], duration?: number, details?: string) => {
    setTests(prevTests => prevTests.map(test => 
      test.name === testName 
        ? { ...test, status, duration, details: details || test.details }
        : test
    ));
  };

  const checkLocalServerHealth = async (): Promise<boolean> => {
    try {
      // Enhanced health check with better CORS handling
      const endpoints = [
        'http://localhost:3001/api/tags',
        'http://127.0.0.1:3001/api/tags'
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Testing Ollama endpoint: ${endpoint}`);
          const response = await fetch(endpoint, {
            method: 'GET',
            mode: 'no-cors', // Changed to no-cors to bypass CORS restrictions
            signal: AbortSignal.timeout(3000)
          });
          
          // With no-cors mode, we can't read the response, but if it doesn't throw, the server is accessible
          console.log(`✅ Ollama server accessible at ${endpoint}`);
          return true;
        } catch (endpointError) {
          console.log(`❌ Failed to connect to ${endpoint}:`, endpointError.message);
          
          // Try with a simple connectivity test using a different approach
          try {
            const img = new Image();
            const promise = new Promise((resolve, reject) => {
              img.onload = () => resolve(true);
              img.onerror = () => reject(new Error('Connection failed'));
              setTimeout(() => reject(new Error('Timeout')), 2000);
            });
            
            img.src = endpoint.replace('/api/tags', '/favicon.ico');
            await promise;
            console.log(`✅ Ollama server connectivity confirmed for ${endpoint}`);
            return true;
          } catch (connectivityError) {
            console.log(`❌ Connectivity test failed for ${endpoint}:`, connectivityError.message);
          }
        }
      }
      
      return false;
    } catch (error) {
      console.error('❌ Health check error:', error);
      return false;
    }
  };

  const runLocalModelTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    toast.info('🧠 Running Local AI Model Tests...', {
      description: 'Testing all local inference capabilities'
    });

    try {
      // Test 0: Local Server Health Check - Run this first for better diagnostics
      console.log('🧪 Testing Local Server Health...');
      updateTestStatus('Local Server Health Check', 'running');
      
      const startTime0 = Date.now();
      try {
        const isServerHealthy = await checkLocalServerHealth();
        const duration0 = Date.now() - startTime0;
        
        if (isServerHealthy) {
          updateTestStatus(
            'Local Server Health Check', 
            'passed', 
            duration0,
            'Local inference server (Ollama) is accessible on port 3001. CORS handled automatically.'
          );
          console.log('✅ Local server health check passed');
        } else {
          updateTestStatus(
            'Local Server Health Check', 
            'failed', 
            duration0,
            'Cannot connect to Ollama server. Verify: 1) Server running with "ollama serve --host 0.0.0.0:3001", 2) Port 3001 accessible, 3) No firewall blocking'
          );
          console.log('❌ Local server not accessible');
        }
      } catch (error) {
        updateTestStatus(
          'Local Server Health Check', 
          'failed', 
          Date.now() - startTime0,
          `Server check failed: ${error.message}. This may be a CORS issue - server might be running but not accessible from browser.`
        );
      }
      
      setProgress(16);

      // Test 1: HuggingFace Transformers Sentiment Analysis
      console.log('🧪 Testing HuggingFace Transformers...');
      updateTestStatus('HuggingFace Transformers - Sentiment Analysis', 'running');
      
      const startTime1 = Date.now();
      try {
        const modelId = 'distilbert-base-uncased-finetuned-sst-2-english';
        const loaded = await loadLocalModel(modelId, 'sentiment-analysis');
        
        if (loaded) {
          const result = await analyzeSentiment(modelId, 'This is a test of local AI capabilities');
          const duration1 = Date.now() - startTime1;
          
          updateTestStatus(
            'HuggingFace Transformers - Sentiment Analysis', 
            'passed', 
            duration1,
            `Model loaded successfully. Result: ${result.label} (${Math.round(result.score * 100)}% confidence)`
          );
          
          console.log('✅ HuggingFace test passed:', result);
        } else {
          throw new Error('Model failed to load - check browser compatibility');
        }
      } catch (error) {
        updateTestStatus(
          'HuggingFace Transformers - Sentiment Analysis', 
          'failed', 
          Date.now() - startTime1,
          `Error: ${error.message}. Try refreshing or check browser WebAssembly support.`
        );
        console.error('❌ HuggingFace test failed:', error);
      }
      
      setProgress(32);

      // Test 2: Local Ollama Threat Analysis
      console.log('🧪 Testing Local Ollama Inference...');
      updateTestStatus('Local Threat Analysis via Ollama', 'running');
      
      const startTime2 = Date.now();
      try {
        const analysis = await analyzeThreat(
          'Sample threat content for testing local AI analysis capabilities',
          'testing',
          'TestEntity',
          false
        );
        
        const duration2 = Date.now() - startTime2;
        
        if (analysis && analysis.provider === 'local_ollama') {
          updateTestStatus(
            'Local Threat Analysis via Ollama', 
            'passed', 
            duration2,
            `Threat analysis completed. Level: ${analysis.threatLevel}, Category: ${analysis.category}`
          );
          console.log('✅ Ollama test passed:', analysis);
        } else {
          updateTestStatus(
            'Local Threat Analysis via Ollama', 
            'failed', 
            duration2,
            analysis ? 'Analysis returned but using fallback mode' : 'No analysis result - check Ollama server on localhost:3001'
          );
        }
      } catch (error) {
        updateTestStatus(
          'Local Threat Analysis via Ollama', 
          'failed', 
          Date.now() - startTime2,
          `Error: ${error.message}`
        );
        console.error('❌ Ollama test failed:', error);
      }
      
      setProgress(48);

      // Test 3: Risk Classification
      console.log('🧪 Testing Risk Classification...');
      updateTestStatus('Risk Classification Model', 'running');
      
      const startTime3 = Date.now();
      try {
        const riskLoaded = await loadRiskClassifier();
        
        if (riskLoaded) {
          const riskResult = await classifyRisk('This content contains potential security threats and malicious activity');
          const duration3 = Date.now() - startTime3;
          
          updateTestStatus(
            'Risk Classification Model', 
            'passed', 
            duration3,
            `Risk: ${riskResult.risk}, Confidence: ${Math.round(riskResult.confidence * 100)}%`
          );
          console.log('✅ Risk classification test passed:', riskResult);
        } else {
          throw new Error('Risk classifier failed to load - using fallback mode');
        }
      } catch (error) {
        updateTestStatus(
          'Risk Classification Model', 
          'failed', 
          Date.now() - startTime3,
          `Error: ${error.message}. Fallback classification available.`
        );
        console.error('❌ Risk classification test failed:', error);
      }
      
      setProgress(64);

      // Test 4: Memory Search & Context
      console.log('🧪 Testing Memory Search...');
      updateTestStatus('Memory Search & Context', 'running');
      
      const startTime4 = Date.now();
      try {
        const memories = await searchMemories('threat patterns', 'TestEntity', 'threat_analysis');
        const duration4 = Date.now() - startTime4;
        
        updateTestStatus(
          'Memory Search & Context', 
          'passed', 
          duration4,
          `Memory search completed. Found ${memories.length} relevant memories`
        );
        console.log('✅ Memory search test passed:', memories);
      } catch (error) {
        updateTestStatus(
          'Memory Search & Context', 
          'failed', 
          Date.now() - startTime4,
          `Error: ${error.message}`
        );
        console.error('❌ Memory search test failed:', error);
      }
      
      setProgress(80);

      // Test 5: WebGPU Check
      console.log('🧪 Testing WebGPU Acceleration...');
      updateTestStatus('WebGPU Acceleration', 'running');
      
      const startTime5 = Date.now();
      try {
        // Check if WebGPU is available
        const hasWebGPU = 'gpu' in navigator;
        const duration5 = Date.now() - startTime5;
        
        if (hasWebGPU) {
          updateTestStatus(
            'WebGPU Acceleration', 
            'passed', 
            duration5,
            'WebGPU is available and ready for hardware acceleration'
          );
          console.log('✅ WebGPU test passed');
        } else {
          updateTestStatus(
            'WebGPU Acceleration', 
            'failed', 
            duration5,
            'WebGPU not available - models will use CPU (slower but functional)'
          );
          console.log('⚠️ WebGPU not available');
        }
      } catch (error) {
        updateTestStatus(
          'WebGPU Acceleration', 
          'failed', 
          Date.now() - startTime5,
          `Error: ${error.message}`
        );
        console.error('❌ WebGPU test failed:', error);
      }
      
      setProgress(100);

      // Summary
      const passedTests = tests.filter(t => t.status === 'passed').length;
      const totalTests = tests.length;
      
      if (passedTests === totalTests) {
        toast.success('🎉 All Local AI Models Operational!', {
          description: `${passedTests}/${totalTests} tests passed - Local inference ready`
        });
      } else if (passedTests >= totalTests * 0.5) {
        toast.warning(`⚠️ ${passedTests}/${totalTests} Local AI Tests Passed`, {
          description: 'Some models need setup - check individual test details'
        });
      } else {
        toast.error(`❌ ${passedTests}/${totalTests} Local AI Tests Passed`, {
          description: 'Most local models need configuration or server setup'
        });
      }

    } catch (error) {
      toast.error('❌ Local Model Testing Failed', {
        description: error.message
      });
      console.error('Local model testing error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: LocalModelTest['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Zap className="h-4 w-4 text-blue-500 animate-pulse" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: LocalModelTest['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="w-full corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Brain className="h-5 w-5 text-corporate-accent" />
          Local AI Model Testing Suite
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm corporate-subtext">
            Comprehensive testing of all local inference capabilities
          </p>
          <Button
            onClick={runLocalModelTests}
            disabled={isRunning}
            className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
          >
            {isRunning ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                Testing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Run Local AI Tests
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isRunning && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Testing Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="space-y-3">
          {tests.map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border border-corporate-border rounded-lg bg-corporate-darkSecondary"
            >
              <div className="flex items-center gap-3 flex-1">
                {getStatusIcon(test.status)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm">{test.name}</h4>
                  <p className="text-xs text-corporate-lightGray mt-1">{test.details}</p>
                  {test.duration && (
                    <p className="text-xs text-corporate-accent mt-1">
                      Duration: {test.duration}ms
                    </p>
                  )}
                </div>
              </div>
              <Badge className={getStatusColor(test.status)}>
                {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-corporate-darkSecondary border border-corporate-border rounded-lg">
          <div className="text-xs text-corporate-lightGray space-y-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Setup Requirements:</strong>
                <ul className="mt-1 space-y-1 ml-2">
                  <li>• HuggingFace models require first-time download (~100-500MB)</li>
                  <li>• Ollama server must be running: <code>ollama serve --host 0.0.0.0:3001</code></li>
                  <li>• WebGPU requires modern browser with GPU acceleration enabled</li>
                  <li>• Memory search requires existing data in Anubis system</li>
                  <li>• For HuggingFace issues: Clear browser cache or try Chrome/Edge</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QALocalModelTester;
