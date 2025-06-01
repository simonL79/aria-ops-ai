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
  deploymentUrls?: string[];
  platformResults?: Record<string, { success: number; total: number; urls: string[] }>;
}

interface CampaignData {
  deployments?: {
    urls?: string[];
    successful?: number;
  };
  platformResults?: Record<string, { success: number; total: number; urls: string[] }>;
  contentGenerated?: number;
  deploymentsSuccessful?: number;
  serpPenetration?: number;
}

const PersonaSaturationPanel = () => {
  const [activeTab, setActiveTab] = useState('deploy');
  const [entityName, setEntityName] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [contentCount, setContentCount] = useState(10);
  const [saturationMode, setSaturationMode] = useState<'defensive' | 'aggressive' | 'nuclear'>('defensive');
  const [deploymentTargets, setDeploymentTargets] = useState(['github-pages']);
  const [deploymentTier, setDeploymentTier] = useState<'basic' | 'pro' | 'enterprise'>('basic');
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<SaturationCampaign | null>(null);
  const [campaigns, setCampaigns] = useState<SaturationCampaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [isLoadingSimon, setIsLoadingSimon] = useState(true);

  // Load most recent "Simon Lindsay" campaign on component mount
  useEffect(() => {
    loadRecentSimonLindsayCampaign();
  }, []);

  const loadRecentSimonLindsayCampaign = async () => {
    try {
      setIsLoadingSimon(true);
      console.log('🔍 Looking for recent Simon Lindsay campaign...');
      
      const { data, error } = await supabase
        .from('persona_saturation_campaigns')
        .select('*')
        .ilike('entity_name', '%simon lindsay%')
        .order('created_at', { ascending: false })
        .limit(1);

      console.log('📊 Database query result:', { data, error });

      if (error) {
        console.error('❌ Error fetching Simon Lindsay campaign:', error);
        toast.error(`Database error: ${error.message}`);
        return;
      }

      if (data && data.length > 0) {
        const campaignData = data[0];
        console.log('✅ Found Simon Lindsay campaign:', campaignData);
        
        // Safely cast and extract deployment URLs from campaign data
        const deploymentUrls: string[] = [];
        const platformResults: Record<string, { success: number; total: number; urls: string[] }> = {};
        
        const typedCampaignData = campaignData.campaign_data as CampaignData;
        console.log('📋 Parsed campaign data:', typedCampaignData);
        
        if (typedCampaignData?.deployments?.urls) {
          deploymentUrls.push(...typedCampaignData.deployments.urls);
          console.log('🔗 Found deployment URLs:', typedCampaignData.deployments.urls);
        }
        
        if (typedCampaignData?.platformResults) {
          Object.entries(typedCampaignData.platformResults).forEach(([platform, results]) => {
            platformResults[platform] = results;
            if (results.urls) {
              deploymentUrls.push(...results.urls);
              console.log(`🔗 Found ${platform} URLs:`, results.urls);
            }
          });
        }

        const formattedCampaign: SaturationCampaign = {
          id: campaignData.id,
          entityName: campaignData.entity_name,
          status: 'completed',
          progress: 100,
          contentGenerated: typedCampaignData?.contentGenerated || 0,
          deploymentsSuccessful: typedCampaignData?.deploymentsSuccessful || 0,
          serpPenetration: (typedCampaignData?.serpPenetration || 0) * 100,
          estimatedImpact: `${typedCampaignData?.deploymentsSuccessful || 0} articles deployed successfully`,
          createdAt: campaignData.created_at,
          deploymentUrls: [...new Set(deploymentUrls)], // Remove duplicates
          platformResults: platformResults
        };

        console.log('🎯 Setting campaign data:', formattedCampaign);
        setCurrentCampaign(formattedCampaign);
        setEntityName(campaignData.entity_name);
        
        // Switch to monitor tab to show the campaign
        setActiveTab('monitor');
        
        toast.success(`📊 Loaded Simon Lindsay campaign: ${deploymentUrls.length} URLs found`);
      } else {
        console.log('ℹ️ No Simon Lindsay campaigns found in database');
        toast.info('No Simon Lindsay campaigns found in the database');
      }
    } catch (error) {
      console.error('💥 Error loading Simon Lindsay campaign:', error);
      toast.error(`Failed to load campaign: ${error}`);
    } finally {
      setIsLoadingSimon(false);
    }
  };

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
        const formattedCampaigns = data.map((campaign: any) => {
          const typedCampaignData = campaign.campaign_data as CampaignData;
          return {
            id: campaign.id,
            entityName: campaign.entity_name,
            status: 'completed' as const,
            progress: 100,
            contentGenerated: typedCampaignData?.contentGenerated || 0,
            deploymentsSuccessful: typedCampaignData?.deploymentsSuccessful || 0,
            serpPenetration: (typedCampaignData?.serpPenetration || 0) * 100,
            estimatedImpact: `${typedCampaignData?.deploymentsSuccessful || 0} articles deployed`,
            createdAt: campaign.created_at
          };
        });
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

    if (deploymentTargets.length === 0) {
      toast.error('Please select at least one deployment platform');
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
      
      console.log(`🚀 Deploying ${contentCount} articles across ${deploymentTargets.length} platforms using ${deploymentTier} tier...`);
      
      const { data, error } = await supabase.functions.invoke('persona-saturation', {
        body: {
          entityName,
          targetKeywords: keywords,
          contentCount,
          deploymentTargets,
          saturationMode,
          deploymentTier,
          realDeployment: true
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

      // Update campaign with real results including URLs
      const deploymentUrls: string[] = [];
      const platformResults: Record<string, { success: number; total: number; urls: string[] }> = {};
      
      if (data.campaign.deployments.urls) {
        deploymentUrls.push(...data.campaign.deployments.urls);
      }
      
      if (data.platformResults) {
        Object.entries(data.platformResults).forEach(([platform, results]: [string, any]) => {
          platformResults[platform] = results;
          if (results.urls) {
            deploymentUrls.push(...results.urls);
          }
        });
      }

      setCurrentCampaign(prev => prev ? {
        ...prev,
        status: 'completed',
        progress: 100,
        contentGenerated: data.campaign.contentGenerated,
        deploymentsSuccessful: data.campaign.deployments.successful,
        serpPenetration: (data.campaign.serpPenetration || 0) * 100,
        estimatedImpact: data.estimatedSERPImpact,
        deploymentUrls: [...new Set(deploymentUrls)],
        platformResults: platformResults
      } : null);

      toast.success(`🎯 Multi-Platform Deployment Complete! ${data.campaign.deployments.successful}/${contentCount} articles deployed across ${deploymentTargets.length} platforms`);
      
      // Show platform-specific deployment URLs
      if (deploymentUrls.length > 0) {
        toast.success(`🌐 ${deploymentUrls.length} live articles created using ${deploymentTier} tier strategy.`);
      }
      
      // Refresh campaigns list if we're on that tab
      if (activeTab === 'campaigns') {
        fetchCampaigns();
      }
      
    } catch (error: any) {
      clearInterval(progressInterval);
      console.error('Multi-Platform Deployment error:', error);
      
      setCurrentCampaign(prev => prev ? { 
        ...prev, 
        status: 'completed', 
        progress: 0,
        estimatedImpact: 'Failed - See error details'
      } : null);
      
      const errorMessage = error.message || 'Unknown error occurred';
      toast.error(`❌ Multi-Platform Deployment failed: ${errorMessage}`);
      
      if (errorMessage.includes('GitHub token')) {
        toast.error('⚠️ GitHub token missing. Please configure GITHUB_TOKEN in edge function secrets.');
      }
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Rocket className="h-5 w-5 text-corporate-accent" />
          A.R.I.A™ Multi-Platform Article Deployment
        </CardTitle>
        <p className="text-sm corporate-subtext">
          Deploy SEO-optimized articles across multiple platforms using tiered scaling strategies
        </p>
        {isLoadingSimon && (
          <p className="text-sm text-blue-400">
            🔍 Loading recent Simon Lindsay campaign...
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger value="deploy" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">Deploy Campaign</TabsTrigger>
            <TabsTrigger value="monitor" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">Monitor Progress</TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">Campaign History</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">Live Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="deploy" className="space-y-4 mt-6">
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

          <TabsContent value="monitor" className="mt-6">
            <CampaignMonitor currentCampaign={currentCampaign} />
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6">
            <CampaignHistory campaigns={campaigns} loadingCampaigns={loadingCampaigns} />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <PersonaSaturationReports />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PersonaSaturationPanel;
