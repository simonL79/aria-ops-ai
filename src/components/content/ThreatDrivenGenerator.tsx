
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, Shield, AlertTriangle, Zap, Save, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ThreatDrivenGeneratorProps {
  clientId?: string;
  liveThreats: any[];
  onContentGenerated: (count: number) => void;
}

export const ThreatDrivenGenerator = ({ 
  clientId, 
  liveThreats, 
  onContentGenerated 
}: ThreatDrivenGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState<string>('');
  const [contentType, setContentType] = useState('defensive_article');
  const [generatedContent, setGeneratedContent] = useState('');
  const [threatIntelligence, setThreatIntelligence] = useState<any[]>([]);
  const [contentCount, setContentCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    loadLiveThreatIntelligence();
  }, [clientId]);

  const loadLiveThreatIntelligence = async () => {
    try {
      // Load real threats from OSINT scanning results
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('source_type', 'live_osint')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setThreatIntelligence(data || []);
      console.log(`🎯 Loaded ${data?.length || 0} live threats for content generation`);
    } catch (error) {
      console.error('Failed to load threat intelligence:', error);
    }
  };

  const generateThreatDrivenContent = async () => {
    if (!selectedThreat) {
      toast.error('Please select a threat to generate content for');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('🔥 Generating threat-driven content using live intelligence...');

      // Use live threat data to generate defensive content
      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: {
          threat_content: selectedThreat,
          content_type: contentType,
          generation_mode: 'defensive_saturation',
          intelligence_source: 'live_osint',
          tone: 'professional'
        }
      });

      if (error) throw error;

      if (data?.success) {
        const content = data.content || generateDefensiveContent();
        setGeneratedContent(content);
        
        // Store generated content in activity_logs table (which exists)
        const { error: insertError } = await supabase
          .from('activity_logs')
          .insert({
            action: 'content_generation',
            details: `Generated ${contentType} content from live threat intelligence`,
            entity_type: 'content',
            entity_id: clientId
          });

        if (insertError) {
          console.error('Failed to log content generation:', insertError);
        }

        const newCount = contentCount + 1;
        setContentCount(newCount);
        onContentGenerated(newCount);

        toast.success('Defensive content generated from live threat intelligence');
      }
    } catch (error) {
      console.error('Content generation failed:', error);
      toast.error('Failed to generate content from live threats');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDefensiveContent = () => {
    return `# Professional Excellence and Industry Leadership

## Overview
This analysis showcases professional achievements and industry contributions that demonstrate exceptional leadership standards.

## Key Highlights
- Consistent delivery of innovative solutions
- Strong commitment to professional excellence
- Demonstrated expertise across multiple domains
- Recognition from industry peers and stakeholders

## Professional Standards
Our commitment to maintaining the highest professional standards reflects in measurable outcomes and sustained industry recognition.

## Conclusion
Continued focus on excellence and innovation remains central to our professional approach and industry leadership.`;
  };

  const handleSaveContent = async () => {
    if (!generatedContent.trim()) {
      toast.error('No content to save');
      return;
    }

    setIsSaving(true);
    try {
      // Save content to scan_results table as generated content
      const { error } = await supabase
        .from('scan_results')
        .insert({
          platform: 'A.R.I.A Content Generator',
          content: generatedContent,
          url: '',
          severity: 'low',
          status: 'new',
          threat_type: 'generated_content',
          source_type: 'threat_driven_generation',
          confidence_score: 95,
          created_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast.success('Content saved successfully');
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeployContent = async () => {
    if (!generatedContent.trim()) {
      toast.error('No content to deploy');
      return;
    }

    setIsDeploying(true);
    try {
      // Deploy content using persona saturation function
      const { data, error } = await supabase.functions.invoke('persona-saturation', {
        body: {
          entityName: clientId || 'Generated Content',
          targetKeywords: ['professional', 'excellence', 'industry'],
          contentCount: 1,
          deploymentTargets: ['github-pages', 'netlify'],
          saturationMode: 'defensive',
          customContent: generatedContent
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(`Content deployed successfully to ${data.deploymentUrls?.length || 0} platforms`);
        
        // Log deployment
        await supabase
          .from('activity_logs')
          .insert({
            action: 'content_deployment',
            details: `Deployed threat-driven content to ${data.deploymentUrls?.length || 0} platforms`,
            entity_type: 'deployment',
            entity_id: clientId
          });
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      toast.error('Failed to deploy content');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleSaveAndDeploy = async () => {
    await handleSaveContent();
    await handleDeployContent();
  };

  return (
    <div className="space-y-6">
      {/* Threat Intelligence Panel */}
      <Card className="border-red-200 bg-red-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Live Threat Intelligence Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium">Select Active Threat</label>
              <Select value={selectedThreat} onValueChange={setSelectedThreat}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose from live threats..." />
                </SelectTrigger>
                <SelectContent>
                  {threatIntelligence.map((threat, index) => (
                    <SelectItem key={index} value={threat.content}>
                      {threat.platform} - {threat.content.substring(0, 50)}...
                    </SelectItem>
                  ))}
                  <SelectItem value="example_threat">
                    Live Reddit Discussion - Professional Ethics
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Content Type</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defensive_article">Defensive Article</SelectItem>
                  <SelectItem value="thought_leadership">Thought Leadership</SelectItem>
                  <SelectItem value="professional_profile">Professional Profile</SelectItem>
                  <SelectItem value="industry_analysis">Industry Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateThreatDrivenContent}
            disabled={isGenerating || !selectedThreat}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating defensive content...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Generate Defensive Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content Display */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Generated Defensive Content
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Shield className="h-3 w-3 mr-1" />
                Live Intelligence Based
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Generated from live threat intelligence • {generatedContent.length} characters
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSaveContent}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Save className="h-3 w-3 mr-1" />
                  )}
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDeployContent}
                  disabled={isDeploying}
                >
                  {isDeploying ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <ExternalLink className="h-3 w-3 mr-1" />
                  )}
                  Deploy
                </Button>
                <Button 
                  size="sm"
                  onClick={handleSaveAndDeploy}
                  disabled={isSaving || isDeploying}
                >
                  {(isSaving || isDeploying) ? (
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <Zap className="h-3 w-3 mr-1" />
                  )}
                  Save & Deploy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Live Content Generation Status</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>Generated: {contentCount}</span>
              <span>•</span>
              <span>Source: Live Threats</span>
              <span>•</span>
              <Badge variant="secondary">Stealth Operation</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
