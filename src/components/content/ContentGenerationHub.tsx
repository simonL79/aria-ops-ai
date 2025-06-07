import React, { useState } from 'react';
import { ContentTypeSelector } from './ContentTypeSelector';
import { ContentPreview } from './ContentPreview';
import { LiveDeploymentManager } from './LiveDeploymentManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Target, Shield, Loader2, Search, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import ClientSelector from '@/components/admin/ClientSelector';
import type { Client } from '@/types/clients';
import { supabase } from '@/integrations/supabase/client';

export const ContentGenerationHub = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [contentConfig, setContentConfig] = useState<any>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deploymentResults, setDeploymentResults] = useState<any[]>([]);

  const handleContentTypeSelect = async (contentType: string, config: any) => {
    const fullConfig = {
      ...config,
      clientId: selectedClient?.id,
      clientName: selectedClient?.name
    };
    
    setContentConfig(fullConfig);
    await generatePreviewContent(fullConfig);
  };

  const generatePreviewContent = async (config: any) => {
    setIsGenerating(true);
    try {
      console.log('🎯 Generating advanced SEO-optimized content preview...');
      
      const { data, error } = await supabase.functions.invoke('persona-saturation', {
        body: {
          ...config,
          previewOnly: true
        }
      });

      if (error) throw error;

      setGeneratedContent({
        title: data.title || 'Generated Article',
        body: data.content || data.body || 'Content generation failed',
        keywords: config.targetKeywords || [],
        contentType: config.contentType,
        responseAngle: config.responseAngle,
        sourceUrl: config.followUpSource,
        metaDescription: data.metaDescription,
        urlSlug: data.urlSlug,
        hashtags: data.hashtags,
        internalLinks: data.internalLinks,
        imageAlt: data.imageAlt,
        schemaData: data.schemaData,
        seoKeywords: data.seoKeywords,
        keywordDensity: data.keywordDensity,
        seoScore: data.seoScore
      });

      toast.success(`Advanced SEO-optimized content generated (Score: ${data.seoScore || 'N/A'}/100)`);
    } catch (error) {
      console.error('❌ Content generation failed:', error);
      toast.error('Failed to generate content preview');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveContent = () => {
    toast.success('Advanced SEO-optimized content approved for deployment');
    // Content is ready for deployment
  };

  const handleEditContent = () => {
    setGeneratedContent(null);
    toast.info('Please regenerate content with updated configuration');
  };

  const handleRejectContent = () => {
    setGeneratedContent(null);
    setContentConfig(null);
    toast.info('Content rejected - starting over');
  };

  const handleDeploymentComplete = (results: any[]) => {
    setDeploymentResults(results);
  };

  const handleContentUpdate = (updatedContent: any) => {
    setGeneratedContent(updatedContent);
    toast.success('Content updated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-corporate-darkSecondary border-corporate-accent/30">
        <CardHeader>
          <CardTitle className="text-corporate-accent flex items-center gap-2">
            <Zap className="h-6 w-6" />
            A.R.I.A™ Advanced SEO Content Generation & Live Deployment Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">LIVE</div>
              <p className="text-xs text-gray-400">Real Platform Deployment</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">AI-DRIVEN</div>
              <p className="text-xs text-gray-400">Intelligent Content Generation</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">SEO-OPTIMIZED</div>
              <p className="text-xs text-gray-400">Advanced Search Optimization</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">SCHEMA-READY</div>
              <p className="text-xs text-gray-400">Google News Compliant</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">STEALTH</div>
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
      {selectedClient && !generatedContent && (
        <ContentTypeSelector
          onContentTypeSelect={handleContentTypeSelect}
          selectedEntity={selectedClient.name}
        />
      )}

      {/* Loading State */}
      {isGenerating && (
        <Card className="border-corporate-border bg-corporate-darkSecondary">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-corporate-accent" />
            <p className="text-white">Generating advanced SEO-optimized content preview...</p>
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-green-400" />
                <span className="text-sm text-green-400">Advanced keyword optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-400">Schema markup generation</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Preview */}
      {generatedContent && !isGenerating && (
        <ContentPreview
          content={generatedContent}
          onApprove={handleApproveContent}
          onEdit={handleEditContent}
          onReject={handleRejectContent}
          onContentUpdate={handleContentUpdate}
        />
      )}

      {/* Live Deployment */}
      {generatedContent && contentConfig && (
        <LiveDeploymentManager
          contentConfig={{
            ...contentConfig,
            generatedContent
          }}
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
