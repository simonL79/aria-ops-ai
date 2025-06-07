
import React, { useState } from 'react';
import { ContentTypeSelector } from './ContentTypeSelector';
import { LiveDeploymentManager } from './LiveDeploymentManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Shield } from 'lucide-react';
import ClientSelector from '@/components/admin/ClientSelector';
import type { Client } from '@/types/clients';

export const ContentGenerationHub = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [contentConfig, setContentConfig] = useState<any>(null);
  const [deploymentResults, setDeploymentResults] = useState<any[]>([]);

  const handleContentTypeSelect = (contentType: string, config: any) => {
    setContentConfig({
      ...config,
      clientId: selectedClient?.id,
      clientName: selectedClient?.name
    });
  };

  const handleDeploymentComplete = (results: any[]) => {
    setDeploymentResults(results);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-corporate-darkSecondary border-corporate-accent/30">
        <CardHeader>
          <CardTitle className="text-corporate-accent flex items-center gap-2">
            <Zap className="h-6 w-6" />
            A.R.I.A™ Content Generation & Live Deployment Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">LIVE</div>
              <p className="text-xs text-gray-400">Real Platform Deployment</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">AI-DRIVEN</div>
              <p className="text-xs text-gray-400">Intelligent Content Generation</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">STEALTH</div>
              <p className="text-xs text-gray-400">Untraceable Source</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Selection */}
      <ClientSelector
        selectedClient={selectedClient}
        onClientSelect={setSelectedClient}
      />

      {/* Content Type Selection */}
      {selectedClient && (
        <ContentTypeSelector
          onContentTypeSelect={handleContentTypeSelect}
          selectedEntity={selectedClient.name}
        />
      )}

      {/* Live Deployment */}
      {contentConfig && (
        <LiveDeploymentManager
          contentConfig={contentConfig}
          onDeploymentComplete={handleDeploymentComplete}
        />
      )}

      {/* Deployment Results */}
      {deploymentResults.length > 0 && (
        <Card className="border-corporate-border bg-corporate-darkSecondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="h-5 w-5 text-green-400" />
              Live Deployment Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {deploymentResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-corporate-border rounded">
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <Shield className="h-4 w-4 text-green-600" />
                    ) : (
                      <Shield className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-white font-medium">{result.platform}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.success && result.url && (
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-corporate-accent hover:underline text-sm"
                      >
                        View Live
                      </a>
                    )}
                    <Badge variant={result.success ? 'default' : 'destructive'}>
                      {result.success ? 'LIVE' : 'Failed'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
