
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Rocket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PersonaSaturationReports from './PersonaSaturationReports';
import CampaignConfiguration from './persona-saturation/CampaignConfiguration';
import CampaignMonitor from './persona-saturation/CampaignMonitor';
import CampaignHistory from './persona-saturation/CampaignHistory';

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
}

const PersonaSaturationPanel = () => {
  const [activeTab, setActiveTab] = useState('deploy');
  const [entityName, setEntityName] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [contentCount, setContentCount] = useState(50);
  const [saturationMode, setSaturationMode] = useState<'defensive' | 'aggressive' | 'nuclear'>('defensive');
  const [deploymentTargets, setDeploymentTargets] = useState(['github-pages']);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<SaturationCampaign | null>(null);
  const [campaigns, setCampaigns] = useState<SaturationCampaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  // Fetch campaign history from database
  const fetchCampaigns = async () => {
    setLoadingCampaigns(true);
    try {
      const { data, error } = await supabase
        .from('persona_saturation_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error);
        return;
      }

      if (data) {
        const formattedCampaigns = data.map((campaign: any) => ({
          id: campaign.id,
          entityName: campaign.entity_name,
          status: 'completed' as const,
          progress: 100,
          contentGenerated: campaign.campaign_data?.contentGenerated || 0,
          deploymentsSuccessful: campaign.campaign_data?.deploymentsSuccessful || 0,
          serpPenetration: (campaign.campaign_data?.serpPenetration || 0) * 100,
          estimatedImpact: `${campaign.campaign_data?.deploymentsSuccessful || 0} articles deployed`,
          createdAt: campaign.created_at
        }));
        setCampaigns(formattedCampaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  // Fetch campaigns when component mounts or when switching to campaigns tab
  useEffect(() => {
    if (activeTab === 'campaigns') {
      fetchCampaigns();
    }
  }, [activeTab]);

  const executePersonaSaturation = async () => {
    if (!entityName.trim() || !targetKeywords.trim()) {
      toast.error('Please enter entity name and target keywords');
      return;
    }

    setIsExecuting(true);
    
    const campaign: SaturationCampaign = {
      id: `campaign-${Date.now()}`,
      entityName,
      status: 'planning',
      progress: 0,
      contentGenerated: 0,
      deploymentsSuccessful: 0,
      serpPenetration: 0,
      estimatedImpact: 'Calculating...'
    };
    setCurrentCampaign(campaign);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setCurrentCampaign(prev => {
        if (!prev) return null;
        const newProgress = Math.min(prev.progress + 15, 75); // Stop at 75% until real completion
        let newStatus = prev.status;
        
        if (newProgress === 15) newStatus = 'generating';
        if (newProgress === 30) newStatus = 'deploying';
        if (newProgress === 45) newStatus = 'indexing';
        if (newProgress === 60) newStatus = 'monitoring';
        if (newProgress === 75) newStatus = 'monitoring';
        
        return { ...prev, progress: newProgress, status: newStatus };
      });
    }, 3000);

    try {
      const keywords = targetKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
      
      console.log('🚀 Deploying live articles to GitHub Pages...');
      
      const { data, error } = await supabase.functions.invoke('persona-saturation', {
        body: {
          entityName,
          targetKeywords: keywords,
          contentCount,
          deploymentTargets,
          saturationMode,
          realDeployment: true // Enable real GitHub deployment
        }
      });

      clearInterval(progressInterval);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to invoke persona saturation function');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Unknown error from persona saturation function');
      }

      // Update campaign with real results
      setCurrentCampaign(prev => prev ? {
        ...prev,
        status: 'completed',
        progress: 100,
        contentGenerated: data.campaign.contentGenerated,
        deploymentsSuccessful: data.campaign.deployments.successful,
        serpPenetration: (data.campaign.serpAnalysis.penetrationRate || 0) * 100,
        estimatedImpact: data.estimatedSERPImpact
      } : null);

      toast.success(`🎯 Live Deployment Complete! ${data.campaign.deployments.successful}/${contentCount} articles now live on GitHub Pages`);
      
      // Show deployment URLs
      if (data.campaign.deployments.urls && data.campaign.deployments.urls.length > 0) {
        toast.success(`🌐 ${data.campaign.deployments.urls.length} live websites created. Check Reports tab for all URLs.`);
      }
      
      // Refresh campaigns list if we're on that tab
      if (activeTab === 'campaigns') {
        fetchCampaigns();
      }
      
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Persona Saturation error:', error);
      
      setCurrentCampaign(prev => prev ? { 
        ...prev, 
        status: 'completed', 
        progress: 0,
        estimatedImpact: 'Failed - See error details'
      } : null);
      
      const errorMessage = error.message || 'Unknown error occurred';
      toast.error(`❌ Deployment failed: ${errorMessage}`);
      
      if (errorMessage.includes('GitHub token')) {
        toast.error('⚠️ GitHub token missing. Please configure GITHUB_TOKEN in edge function secrets.');
      }
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          A.R.I.A™ Live Article Deployment
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Deploy SEO-optimized articles to live GitHub Pages sites with automated indexing
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="deploy">Deploy Campaign</TabsTrigger>
            <TabsTrigger value="monitor">Monitor Progress</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign History</TabsTrigger>
            <TabsTrigger value="reports">Live Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="deploy" className="space-y-4">
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
              onExecute={executePersonaSaturation}
            />
          </TabsContent>

          <TabsContent value="monitor">
            <CampaignMonitor currentCampaign={currentCampaign} />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignHistory campaigns={campaigns} loadingCampaigns={loadingCampaigns} />
          </TabsContent>

          <TabsContent value="reports">
            <PersonaSaturationReports />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonaSaturationPanel;
