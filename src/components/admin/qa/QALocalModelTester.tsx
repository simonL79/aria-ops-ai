
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
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
  const [testResults, setTestResults] = useState<LocalModelTestResult[]>([]);
  const [testEntity, setTestEntity] = useState('Test Entity');
  const [testKeywords, setTestKeywords] = useState('leadership, innovation, excellence');
  const [testContent, setTestContent] = useState('This is a test content for sentiment analysis and threat detection.');

  const runLocalAITests = async () => {
    setIsRunning(true);
    const results: LocalModelTestResult[] = [];
    
    try {
      toast.info('🧠 Running Local AI Model Tests...', {
        description: 'Testing content generation, sentiment analysis, and threat detection'
      });

      // Test 1: Local Content Generation
      const startTime1 = Date.now();
      try {
        const content = await localInference.generatePersonaContent(
          testEntity, 
          testKeywords.split(',').map(k => k.trim())
        );
        const duration1 = Date.now() - startTime1;
        
        results.push({
          testName: 'Content Generation Test',
          status: content.length > 100 ? 'pass' : 'warning',
          duration: duration1,
          details: `Generated ${content.length} characters of content`,
        });
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
      } catch (error) {
        results.push({
          testName: 'Threat Classification Test',
          status: 'fail',
          duration: Date.now() - startTime3,
          details: `Failed: ${error.message}`,
        });
      }

      // Test 4: Local Inference Initialization
      const startTime4 = Date.now();
      try {
        const initialized = await localInference.initialize();
        const duration4 = Date.now() - startTime4;
        
        results.push({
          testName: 'Local AI Initialization',
          status: initialized ? 'pass' : 'fail',
          duration: duration4,
          details: initialized ? 'Local inference service ready' : 'Initialization failed',
        });
      } catch (error) {
        results.push({
          testName: 'Local AI Initialization',
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
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Brain className="h-5 w-5 text-corporate-accent" />
          Local AI Model Testing
        </CardTitle>
        <p className="text-sm corporate-subtext">
          Test local inference models for content generation, sentiment analysis, and threat detection
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Test Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-corporate-lightGray mb-2 block">Test Entity</label>
            <Input
              value={testEntity}
              onChange={(e) => setTestEntity(e.target.value)}
              placeholder="Entity name for testing"
              className="bg-corporate-dark border-corporate-border text-white"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-corporate-lightGray mb-2 block">Test Keywords</label>
            <Input
              value={testKeywords}
              onChange={(e) => setTestKeywords(e.target.value)}
              placeholder="Comma-separated keywords"
              className="bg-corporate-dark border-corporate-border text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-corporate-lightGray mb-2 block">Test Content</label>
          <Textarea
            value={testContent}
            onChange={(e) => setTestContent(e.target.value)}
            placeholder="Content for sentiment and threat analysis testing"
            className="bg-corporate-dark border-corporate-border text-white min-h-20"
          />
        </div>

        {/* Test Runner */}
        <div className="flex items-center gap-4">
          <Button
            onClick={runLocalAITests}
            disabled={isRunning}
            className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
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
          
          <div className="text-sm text-corporate-lightGray">
            ✅ No API keys required - Using local inference
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold corporate-heading">Test Results</h3>
            
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="bg-corporate-darkSecondary p-4 rounded border border-corporate-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium text-white">{result.testName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-corporate-lightGray">
                        {result.duration}ms
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-corporate-lightGray">
                    {result.details}
                  </div>
                  
                  {result.confidence && (
                    <div className="mt-2">
                      <div className="text-xs text-corporate-lightGray mb-1">
                        Confidence: {Math.round(result.confidence * 100)}%
                      </div>
                      <div className="w-full bg-corporate-dark rounded-full h-2">
                        <div 
                          className="bg-corporate-accent h-2 rounded-full transition-all duration-300" 
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

        {/* Status Indicator */}
        <div className="p-3 bg-corporate-darkSecondary border border-corporate-border rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-corporate-accent" />
            <span className="text-sm font-medium text-white">Local AI Status:</span>
            <span className="text-sm text-corporate-lightGray">
              Ready for privacy-first inference testing
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QALocalModelTester;
