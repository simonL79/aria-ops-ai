
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

  const runLocalModelTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    toast.info('🧠 Running Local AI Model Tests...', {
      description: 'Testing all local inference capabilities'
    });

    try {
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
          throw new Error('Model failed to load');
        }
      } catch (error) {
        updateTestStatus(
          'HuggingFace Transformers - Sentiment Analysis', 
          'failed', 
          Date.now() - startTime1,
          `Error: ${error.message}`
        );
        console.error('❌ HuggingFace test failed:', error);
      }
      
      setProgress(20);

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
        
        if (analysis) {
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
            'No analysis result returned - check Ollama server connection'
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
      
      setProgress(40);

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
          throw new Error('Risk classifier failed to load');
        }
      } catch (error) {
        updateTestStatus(
          'Risk Classification Model', 
          'failed', 
          Date.now() - startTime3,
          `Error: ${error.message}`
        );
        console.error('❌ Risk classification test failed:', error);
      }
      
      setProgress(60);

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
            'WebGPU not available - falling back to CPU inference'
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
      } else {
        toast.warning(`⚠️ ${passedTests}/${totalTests} Local AI Tests Passed`, {
          description: 'Some local models may need configuration'
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
          <div className="text-xs text-corporate-lightGray">
            <AlertTriangle className="h-4 w-4 inline mr-2 text-yellow-500" />
            <strong>Note:</strong> Local models require initial download and setup. First run may take longer.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QALocalModelTester;
