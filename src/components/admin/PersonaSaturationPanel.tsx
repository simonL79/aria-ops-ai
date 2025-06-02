
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CampaignConfiguration from './persona-saturation/CampaignConfiguration';
import CampaignMonitor from './persona-saturation/CampaignMonitor';
import ContentSourcesPanel from './persona-saturation/ContentSourcesPanel';
import ReviewPostGenerator from './persona-saturation/ReviewPostGenerator';
import AdvancedDeploymentPanel from './persona-saturation/AdvancedDeploymentPanel';
import { Globe, Monitor, Database, Settings, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SaturationCampaign {
  id: string;
  entityName: string;
  status: 'planning' | 'generating' | 'deploying' | 'indexing' | 'monitoring' | 'completed';
  progress: number;
  contentGenerated: number;
  deploymentsSuccessful: number;
  serpPenetration: number;
  estimatedImpact: string;
  createdAt?: string;
  deploymentUrls?: string[];
  platformResults?: Record<string, any>;
}

const PersonaSaturationPanel = () => {
  const [entityName, setEntityName] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [contentCount, setContentCount] = useState(10);
  const [saturationMode, setSaturationMode] = useState<'defensive' | 'aggressive' | 'nuclear'>('defensive');
  const [deploymentTargets, setDeploymentTargets] = useState<string[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<SaturationCampaign | null>(null);
  const [allCampaigns, setAllCampaigns] = useState<SaturationCampaign[]>([]);

  const handleExecutePersonaSaturation = async () => {
    if (!entityName.trim() || !targetKeywords.trim() || deploymentTargets.length === 0) {
      toast.error('Please fill in all required fields and select deployment platforms');
      return;
    }

    setIsExecuting(true);
    
    try {
      console.log('🚀 Starting A.R.I.A™ Persona Saturation with LIVE DATA...');
      
      // First, gather live content sources
      console.log('📡 Gathering live content sources...');
      const { data: contentSources, error: contentError } = await supabase
        .from('content_sources')
        .select('*')
        .eq('source_type', 'watchtower')
        .order('created_at', { ascending: false })
        .limit(20);

      if (contentError) {
        console.warn('Content sources not available:', contentError);
      }

      // Get live scan results for context
      const { data: liveResults, error: scanError } = await supabase
        .from('scan_results')
        .select('*')
        .eq('source_type', 'live_osint')
        .order('created_at', { ascending: false })
        .limit(10);

      if (scanError) {
        console.warn('Live scan results not available:', scanError);
      }

      const keywords = targetKeywords.split(',').map(k => k.trim()).filter(k => k);
      
      console.log('📊 Payload for persona saturation:', {
        entityName,
        targetKeywords: keywords,
        contentCount,
        deploymentTargets,
        saturationMode,
        liveContentSources: contentSources?.length || 0,
        liveScanResults: liveResults?.length || 0
      });

      // Enhanced payload with live data context
      const enhancedPayload = {
        entityName,
        targetKeywords: keywords,
        contentCount,
        deploymentTargets,
        saturationMode,
        liveContentSources: contentSources || [],
        liveScanResults: liveResults || [],
        useLiveData: true,
        enhancedMode: true
      };

      const { data, error } = await supabase.functions.invoke('persona-saturation', {
        body: enhancedPayload
      });

      console.log('📊 Enhanced function response:', { data, error });

      if (error) {
        console.error('❌ Edge function error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from persona saturation function');
      }

      const campaign: SaturationCampaign = {
        id: crypto.randomUUID(),
        entityName,
        status: 'completed',
        progress: 100,
        contentGenerated: data.campaign?.contentGenerated || contentCount,
        deploymentsSuccessful: data.campaign?.deploymentsSuccessful || 0,
        serpPenetration: data.campaign?.serpPenetration || 0,
        estimatedImpact: `${data.campaign?.deploymentsSuccessful || 0} live deployments across ${deploymentTargets.length} platforms using live content sources`,
        createdAt: new Date().toISOString(),
        deploymentUrls: data.deploymentUrls || [],
        platformResults: data.campaign?.platformResults || {}
      };

      setCurrentCampaign(campaign);
      setAllCampaigns(prev => [campaign, ...prev]);

      // Store campaign in scan_results table using correct column names
      try {
        await supabase
          .from('scan_results')
          .insert({
            platform: 'A.R.I.A Persona Saturation',
            content: JSON.stringify(campaign),
            url: '',
            severity: 'low',
            status: 'new',
            threat_type: 'persona_saturation_campaign',
            source_type: 'aria_deployment',
            confidence_score: campaign.serpPenetration,
            created_by: (await supabase.auth.getUser()).data.user?.id
          });
      } catch (dbError) {
        console.warn('Could not store campaign in database:', dbError);
      }

      toast.success(`✅ Live persona saturation complete! ${campaign.deploymentsSuccessful} articles deployed using live data sources.`);
      
    } catch (error: any) {
      console.error('❌ Persona saturation error:', error);
      
      let errorMessage = 'Failed to execute persona saturation campaign';
      
      if (error?.message?.includes('Failed to send a request')) {
        errorMessage = 'Network error: Unable to connect to persona saturation service';
      } else if (error?.message?.includes('Function not found')) {
        errorMessage = 'Persona saturation service is not available';
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6 bg-black text-white min-h-screen">
      <div>
        <h2 className="text-2xl font-bold text-white">A.R.I.A™ Persona Saturation Engine</h2>
        <p className="text-gray-300 mt-1">
          Advanced deployment management and content saturation with live data integration
        </p>
      </div>

      <Tabs defaultValue="configure" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-900 border border-gray-800">
          <TabsTrigger value="configure" className="data-[state=active]:bg-green-500 data-[state=active]:text-black text-gray-300">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </TabsTrigger>
          <TabsTrigger value="sources" className="data-[state=active]:bg-green-500 data-[state=active]:text-black text-gray-300">
            <Database className="h-4 w-4 mr-2" />
            Live Sources
          </TabsTrigger>
          <TabsTrigger value="reviews" className="data-[state=active]:bg-green-500 data-[state=active]:text-black text-gray-300">
            <FileText className="h-4 w-4 mr-2" />
            Review Generator
          </TabsTrigger>
          <TabsTrigger value="monitor" className="data-[state=active]:bg-green-500 data-[state=active]:text-black text-gray-300">
            <Monitor className="h-4 w-4 mr-2" />
            Monitor
          </TabsTrigger>
          <TabsTrigger value="deploy" className="data-[state=active]:bg-green-500 data-[state=active]:text-black text-gray-300">
            <Globe className="h-4 w-4 mr-2" />
            Deploy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configure">
          <CampaignConfiguration
            entityName={entityName}
            setEntityName={setEntityName}
            targetKeywords={targetKeywords}
            setTargetKeywords={setTargetKeywords}
            contentCount={contentCount}
            setContentCount={setContentCount}
            saturationMode={saturationMode}
            setSaturationMode={setSaturationMode}
            deploymentTargets={deploymentTargets}
            setDeploymentTargets={setDeploymentTargets}
            isExecuting={isExecuting}
            onExecute={handleExecutePersonaSaturation}
          />
        </TabsContent>

        <TabsContent value="sources">
          <ContentSourcesPanel />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewPostGenerator />
        </TabsContent>

        <TabsContent value="monitor">
          <CampaignMonitor 
            currentCampaign={currentCampaign}
            allCampaigns={allCampaigns}
            loadingCampaigns={false}
          />
        </TabsContent>

        <TabsContent value="deploy">
          <AdvancedDeploymentPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonaSaturationPanel;
