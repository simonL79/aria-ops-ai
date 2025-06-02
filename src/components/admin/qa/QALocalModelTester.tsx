
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, CheckCircle, AlertTriangle, Zap, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { localInference } from '@/services/localInference';

interface LocalModelTestResult {
  testName: string;
  status: 'pass' | 'fail' | 'warning';
  duration: number;
  details: string;
  confidence?: number;
}

const QALocalModelTester = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [testResults, setTestResults] = useState<LocalModelTestResult[]>([]);
  const [testEntity, setTestEntity] = useState('Test Entity Corp');
  const [testKeywords, setTestKeywords] = useState('leadership, innovation, excellence, quality');
  const [testContent, setTestContent] = useState('This company shows excellent leadership and innovative approaches to business challenges.');

  // Initialize local AI on component mount
  useEffect(() => {
    initializeLocalAI();
  }, []);

  const initializeLocalAI = async () => {
    try {
      console.log('🧠 Initializing Local AI for QA Testing...');
      const success = await localInference.initialize();
      setIsInitialized(success);
      
      if (success) {
        toast.success('🧠 Local AI initialized successfully');
      } else {
        toast.warning('⚠️ Local AI using fallback mode');
      }
    } catch (error) {
      console.error('Local AI initialization error:', error);
      toast.error('❌ Local AI initialization failed');
      setIsInitialized(false);
    }
  };

  const runLocalAITests = async () => {
    if (!isInitialized) {
      toast.error('❌ Local AI not initialized. Please refresh and try again.');
      return;
    }

    setIsRunning(true);
    const results: LocalModelTestResult[] = [];
    
    try {
      toast.info('🧪 Running Local AI Test Suite...', {
        description: 'Testing content generation, sentiment analysis, and threat detection'
      });

      // Test 1: Local Content Generation
      const startTime1 = Date.now();
      try {
        const content = await localInference.generatePersonaContent(
          testEntity, 
          testKeywords.split(',').map(k => k.trim()),
          'article'
        );
        const duration1 = Date.now() - startTime1;
        
        results.push({
          testName: 'Content Generation Test',
          status: content.length > 100 ? 'pass' : 'warning',
          duration: duration1,
          details: `Generated ${content.length} characters of professional content`,
        });
        
        console.log('✅ Content generation test completed:', content.substring(0, 100) + '...');
      } catch (error) {
        results.push({
          testName: 'Content Generation Test',
          status: 'fail',
          duration: Date.now() - startTime1,
          details: `Failed: ${error.message}`,
        });
      }

      // Test 2: Sentiment Analysis
      const startTime2 = Date.now();
      try {
        const sentiment = await localInference.analyzeSentiment(testContent);
        const duration2 = Date.now() - startTime2;
        
        results.push({
          testName: 'Sentiment Analysis Test',
          status: sentiment.confidence > 0.6 ? 'pass' : 'warning',
          duration: duration2,
          details: `Detected: ${sentiment.label} (${Math.round(sentiment.confidence * 100)}% confidence)`,
          confidence: sentiment.confidence
        });
        
        console.log('✅ Sentiment analysis test completed:', sentiment);
      } catch (error) {
        results.push({
          testName: 'Sentiment Analysis Test',
          status: 'fail',
          duration: Date.now() - startTime2,
          details: `Failed: ${error.message}`,
        });
      }

      // Test 3: Threat Classification
      const startTime3 = Date.now();
      try {
        const threat = await localInference.classifyThreat(testContent, testEntity);
        const duration3 = Date.now() - startTime3;
        
        results.push({
          testName: 'Threat Classification Test',
          status: threat.confidence > 0.7 ? 'pass' : 'warning',
          duration: duration3,
          details: `Level: ${threat.threatLevel}, Category: ${threat.category} (${Math.round(threat.confidence * 100)}% confidence)`,
          confidence: threat.confidence
        });
        
        console.log('✅ Threat classification test completed:', threat);
      } catch (error) {
        results.push({
          testName: 'Threat Classification Test',
          status: 'fail',
          duration: Date.now() - startTime3,
          details: `Failed: ${error.message}`,
        });
      }

      // Test 4: Multi-content Type Generation
      const startTime4 = Date.now();
      try {
        const reviewContent = await localInference.generatePersonaContent(
          testEntity,
          testKeywords.split(',').map(k => k.trim()),
          'review'
        );
        const duration4 = Date.now() - startTime4;
        
        results.push({
          testName: 'Multi-Content Generation',
          status: reviewContent.length > 50 ? 'pass' : 'warning',
          duration: duration4,
          details: `Generated review content: ${reviewContent.length} characters`,
        });
        
        console.log('✅ Multi-content generation test completed');
      } catch (error) {
        results.push({
          testName: 'Multi-Content Generation',
          status: 'fail',
          duration: Date.now() - startTime4,
          details: `Failed: ${error.message}`,
        });
      }

      setTestResults(results);
      
      const passedTests = results.filter(r => r.status === 'pass').length;
      const totalTests = results.length;
      
      if (passedTests === totalTests) {
        toast.success(`✅ Local AI Tests: ${passedTests}/${totalTests} passed`, {
          description: 'All local inference models operational'
        });
      } else {
        toast.warning(`⚠️ Local AI Tests: ${passedTests}/${totalTests} passed`, {
          description: 'Some local inference issues detected'
        });
      }
      
    } catch (error) {
      console.error('Local AI testing failed:', error);
      toast.error('❌ Local AI testing failed', {
        description: 'Check console for detailed error information'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const resetTests = () => {
    setTestResults([]);
    toast.info('🔄 Test results cleared');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'fail': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default: return <Play className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'fail': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-500">
          <Brain className="h-5 w-5" />
          Local AI Model Testing & Setup
        </CardTitle>
        <p className="text-sm text-gray-400">
          Test and validate local inference models for content generation, sentiment analysis, and threat detection
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Initialization Status */}
        <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-white">Local AI Status:</span>
              <Badge className={isInitialized ? getStatusColor('pass') : getStatusColor('warning')}>
                {isInitialized ? 'READY' : 'INITIALIZING'}
              </Badge>
            </div>
            <Button
              onClick={initializeLocalAI}
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reinitialize
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {isInitialized 
              ? 'Ready for privacy-first inference testing - No API keys required'
              : 'Setting up local AI models...'
            }
          </div>
        </div>

        {/* Test Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Test Entity</label>
            <Input
              value={testEntity}
              onChange={(e) => setTestEntity(e.target.value)}
              placeholder="Entity name for testing"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">Test Keywords</label>
            <Input
              value={testKeywords}
              onChange={(e) => setTestKeywords(e.target.value)}
              placeholder="Comma-separated keywords"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Test Content</label>
          <Textarea
            value={testContent}
            onChange={(e) => setTestContent(e.target.value)}
            placeholder="Content for sentiment and threat analysis testing"
            className="bg-gray-900 border-gray-700 text-white min-h-20"
          />
        </div>

        {/* Test Runner */}
        <div className="flex items-center gap-4">
          <Button
            onClick={runLocalAITests}
            disabled={isRunning || !isInitialized}
            className="bg-amber-500 text-black hover:bg-amber-600"
          >
            {isRunning ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-pulse" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Local AI Tests
              </>
            )}
          </Button>
          
          {testResults.length > 0 && (
            <Button
              onClick={resetTests}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Results
            </Button>
          )}
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-amber-500">Test Results</h3>
            
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium text-white">{result.testName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {result.duration}ms
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-400">
                    {result.details}
                  </div>
                  
                  {result.confidence && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">
                        Confidence: {Math.round(result.confidence * 100)}%
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${result.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QALocalModelTester;
