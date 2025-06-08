
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, Brain, Cloud, Home, RefreshCw, TestTube } from 'lucide-react';
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
  const [localDisabled, setLocalDisabled] = useState(true);

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    setIsInitializing(true);
    try {
      await hybridAIService.initialize();
      const status = hybridAIService.getServiceStatus();
      
      setServiceStatus({
        local: status.local === 'available',
        openai: status.openai === 'available',
        active: status.active
      });
      
      // Set local disabled state
      setLocalDisabled(status.local === 'disabled');
      
      // Auto-prefer OpenAI when local is disabled
      if (status.local === 'disabled' && status.openai === 'available') {
        setPreferLocal(false);
        hybridAIService.setPreferLocal(false);
      }
    } catch (error) {
      console.error('Failed to initialize AI services:', error);
      toast.error('AI service initialization failed');
    } finally {
      setIsInitializing(false);
    }
  };

  const handlePreferenceChange = (prefer: boolean) => {
    if (localDisabled && prefer) {
      toast.warning('Local AI is disabled for testing', {
        description: 'Enable local AI first to use this preference'
      });
      return;
    }
    
    setPreferLocal(prefer);
    hybridAIService.setPreferLocal(prefer);
    
    const status = hybridAIService.getServiceStatus();
    setServiceStatus({
      local: status.local === 'available',
      openai: status.openai === 'available',
      active: status.active
    });
    
    toast.success(`AI preference set to ${prefer ? 'Local' : 'OpenAI'}`, {
      description: prefer ? 'Using offline models for privacy' : 'Using cloud AI for quality'
    });
  };

  const handleLocalToggle = (enabled: boolean) => {
    hybridAIService.setOllamaEnabled(enabled);
    setLocalDisabled(!enabled);
    
    if (enabled) {
      toast.success('Local AI enabled', {
        description: 'Ollama server will be checked on next initialization'
      });
    } else {
      toast.info('Local AI disabled for testing', {
        description: 'Only OpenAI will be used for AI operations'
      });
      setPreferLocal(false);
      hybridAIService.setPreferLocal(false);
    }
    
    // Refresh status
    initializeServices();
  };

  const testOpenAIConnection = async () => {
    try {
      const result = await hybridAIService.classifyThreat(
        'This is a test message for OpenAI connectivity',
        'test-entity'
      );
      
      if (result) {
        toast.success('OpenAI test successful', {
          description: `Model responded with ${result.threatLevel} threat level`
        });
      }
    } catch (error) {
      toast.error('OpenAI test failed', {
        description: 'Check your API key configuration'
      });
    }
  };

  const getStatusBadge = (service: string, available: boolean) => {
    if (service === 'local' && localDisabled) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Disabled</Badge>;
    }
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
          <TestTube className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-normal text-yellow-700">(Testing Mode)</span>
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
                  {localDisabled ? 'Disabled for testing' : 'Mixtral, LLaMA3, Mistral'}
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

        {/* Local AI Testing Control */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Enable Local AI</div>
              <div className="text-sm text-muted-foreground">
                Toggle Ollama server connection for testing
              </div>
            </div>
            <Switch 
              checked={!localDisabled}
              onCheckedChange={handleLocalToggle}
            />
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
              disabled={localDisabled || !serviceStatus.local}
            />
          </div>

          {localDisabled && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <TestTube className="h-4 w-4 text-yellow-600" />
              <div className="text-sm text-yellow-800">
                Local AI is disabled for testing. Only OpenAI will be used for AI operations.
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

          {serviceStatus.openai && (
            <Button 
              variant="outline" 
              onClick={testOpenAIConnection}
            >
              Test OpenAI
            </Button>
          )}
        </div>

        {/* Current Status Summary */}
        <div className="text-sm text-muted-foreground">
          Active Service: <strong className="text-foreground">
            {serviceStatus.active === 'local' ? 'Local AI (Ollama)' : 
             serviceStatus.active === 'openai' ? 'OpenAI API' : 'None Available'}
          </strong>
          {localDisabled && ' (Local AI disabled for testing)'}
        </div>
      </CardContent>
    </Card>
  );
};
