
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CampaignConfiguration from './persona-saturation/CampaignConfiguration';
import CampaignMonitor from './persona-saturation/CampaignMonitor';
import ContentSourcesPanel from './persona-saturation/ContentSourcesPanel';
import { Globe, Monitor, Database, Settings } from 'lucide-react';
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
      console.log('🚀 Starting A.R.I.A™ Persona Saturation deployment...');
      
      const keywords = targetKeywords.split(',').map(k => k.trim()).filter(k => k);
      
      const { data, error } = await supabase.functions.invoke('persona-saturation', {
        body: {
          entityName,
          targetKeywords: keywords,
          contentCount,
          deploymentTargets,
          saturationMode
        }
      });

      if (error) throw error;

      const campaign: SaturationCampaign = {
        id: crypto.randomUUID(),
        entityName,
        status: 'completed',
        progress: 100,
        contentGenerated: data.campaign.contentGenerated,
        deploymentsSuccessful: data.campaign.deploymentsSuccessful,
        serpPenetration: data.campaign.serpPenetration,
        estimatedImpact: `${data.campaign.deploymentsSuccessful} live deployments across ${deploymentTargets.length} platforms`,
        createdAt: new Date().toISOString(),
        deploymentUrls: data.deploymentUrls,
        platformResults: data.campaign.platformResults
      };

      setCurrentCampaign(campaign);
      setAllCampaigns(prev => [campaign, ...prev]);

      toast.success(`Persona saturation complete! ${data.campaign.deploymentsSuccessful} articles deployed successfully.`);
      
    } catch (error) {
      console.error('Persona saturation error:', error);
      toast.error('Failed to execute persona saturation campaign');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold corporate-heading">A.R.I.A™ Persona Saturation Engine</h2>
        <p className="corporate-subtext mt-1">
          Static deployment across multiple platforms without API keys
        </p>
      </div>

      <Tabs defaultValue="configure" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-corporate-darkSecondary border border-corporate-border">
          <TabsTrigger value="configure" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </TabsTrigger>
          <TabsTrigger value="sources" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
            <Database className="h-4 w-4 mr-2" />
            Content Sources
          </TabsTrigger>
          <TabsTrigger value="monitor" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
            <Monitor className="h-4 w-4 mr-2" />
            Monitor
          </TabsTrigger>
          <TabsTrigger value="deploy" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
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

        <TabsContent value="monitor">
          <CampaignMonitor 
            currentCampaign={currentCampaign}
            allCampaigns={allCampaigns}
            loadingCampaigns={false}
          />
        </TabsContent>

        <TabsContent value="deploy">
          <div className="text-center py-12">
            <Globe className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
            <h3 className="text-lg font-medium text-white mb-2">Advanced Deployment</h3>
            <p className="text-corporate-lightGray">Advanced deployment options coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonaSaturationPanel;
