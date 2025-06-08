
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Brain, Cloud, Home, RefreshCw } from 'lucide-react';
import { hybridAIService } from '@/services/ai/hybridAIService';
import { toast } from 'sonner';

export const AIServiceControl = () => {
  const [serviceStatus, setServiceStatus] = useState({
    local: false,
    openai: false,
    active: 'none'
  });
  const [preferLocal, setPreferLocal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    setIsInitializing(true);
    try {
      await hybridAIService.initialize();
      const status = hybridAIService.getServiceStatus();
      setServiceStatus(status);
      
      // Auto-prefer local if available
      if (status.local) {
        setPreferLocal(true);
        hybridAIService.setPreferLocal(true);
      }
    } catch (error) {
      console.error('Failed to initialize AI services:', error);
      toast.error('AI service initialization failed');
    } finally {
      setIsInitializing(false);
    }
  };

  const handlePreferenceChange = (prefer: boolean) => {
    setPreferLocal(prefer);
    hybridAIService.setPreferLocal(prefer);
    
    const status = hybridAIService.getServiceStatus();
    setServiceStatus(status);
    
    toast.success(`AI preference set to ${prefer ? 'Local' : 'OpenAI'}`, {
      description: prefer ? 'Using offline models for privacy' : 'Using cloud AI for quality'
    });
  };

  const testLocalConnection = async () => {
    try {
      const result = await hybridAIService.classifyThreat(
        'This is a test message for AI connectivity',
        'test-entity'
      );
      
      if (result) {
        toast.success('Local AI test successful', {
          description: `Model responded with ${result.threatLevel} threat level`
        });
      }
    } catch (error) {
      toast.error('Local AI test failed', {
        description: 'Check if Ollama is running with Mixtral model'
      });
    }
  };

  const getStatusBadge = (service: string, available: boolean) => {
    if (service === serviceStatus.active) {
      return <Badge className="bg-green-600">Active</Badge>;
    } else if (available) {
      return <Badge variant="secondary">Available</Badge>;
    } else {
      return <Badge variant="destructive">Offline</Badge>;
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600" />
          Hybrid AI Service Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Home className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium">Local AI (Ollama)</div>
                <div className="text-sm text-muted-foreground">
                  Mixtral, LLaMA3, Mistral
                </div>
              </div>
            </div>
            {getStatusBadge('local', serviceStatus.local)}
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Cloud className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">OpenAI API</div>
                <div className="text-sm text-muted-foreground">
                  GPT-4, GPT-4o models
                </div>
              </div>
            </div>
            {getStatusBadge('openai', serviceStatus.openai)}
          </div>
        </div>

        {/* AI Preference Control */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Prefer Local AI</div>
              <div className="text-sm text-muted-foreground">
                Use local models when available for privacy and speed
              </div>
            </div>
            <Switch 
              checked={preferLocal}
              onCheckedChange={handlePreferenceChange}
              disabled={!serviceStatus.local}
            />
          </div>

          {preferLocal && !serviceStatus.local && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <div className="text-sm text-amber-800">
                Local AI preferred but not available. Install Ollama and pull Mixtral model.
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={initializeServices}
            disabled={isInitializing}
          >
            {isInitializing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </>
            )}
          </Button>

          {serviceStatus.local && (
            <Button 
              variant="outline" 
              onClick={testLocalConnection}
            >
              Test Local AI
            </Button>
          )}
        </div>

        {/* Setup Instructions */}
        {!serviceStatus.local && (
          <div className="p-4 bg-gray-50 border rounded-lg">
            <div className="font-medium text-sm mb-2">Setup Local AI (Optional)</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>1. Install Ollama: <code>curl -fsSL https://ollama.ai/install.sh | sh</code></div>
              <div>2. Pull Mixtral: <code>ollama pull mixtral:8x7b-instruct</code></div>
              <div>3. Start service: <code>ollama serve</code></div>
            </div>
          </div>
        )}

        {/* Current Status Summary */}
        <div className="text-sm text-muted-foreground">
          Active Service: <strong className="text-foreground">
            {serviceStatus.active === 'local' ? 'Local AI (Ollama)' : 
             serviceStatus.active === 'openai' ? 'OpenAI API' : 'None Available'}
          </strong>
        </div>
      </CardContent>
    </Card>
  );
};
