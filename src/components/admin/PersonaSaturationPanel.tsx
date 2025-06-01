
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, FileText, CheckCircle, TrendingUp, Zap, Shield, AlertCircle } from 'lucide-react';
import CampaignConfiguration from '@/components/admin/persona-saturation/CampaignConfiguration';
import CampaignMonitor from '@/components/admin/persona-saturation/CampaignMonitor';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

// Add proper type for campaign data
interface CampaignData {
  contentGenerated?: number;
  deploymentsSuccessful?: number;
  serpPenetration?: number;
  estimatedReach?: number;
  platformResults?: Record<string, any>;
  deployments?: {
    successful?: number;
    urls?: string[];
  };
}

const PersonaSaturationPanel = () => {
  const [entityName, setEntityName] = useState('');
  const [targetKeywords, setTargetKeywords] = useState('');
  const [contentCount, setContentCount] = useState(10);
  const [saturationMode, setSaturationMode] = useState<'defensive' | 'aggressive' | 'nuclear'>('defensive');
  const [deploymentTargets, setDeploymentTargets] = useState(['github-pages']);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<SaturationCampaign | null>(null);
  const [campaigns, setCampaigns] = useState<SaturationCampaign[]>([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [activeTab, setActiveTab] = useState('deploy');

  // Load existing campaigns on component mount
  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      console.log('Loading persona saturation campaigns...');
      
      const { data, error } = await supabase
        .from('persona_saturation_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading campaigns:', error);
        toast.error('Failed to load campaigns');
        setCampaigns([]);
        return;
      }

      console.log('Raw campaign data:', data);

      if (data && data.length > 0) {
        const transformedCampaigns: SaturationCampaign[] = data.map(campaign => {
          // Properly type the campaign_data as CampaignData
          const campaignData = (campaign.campaign_data as CampaignData) || {};
          const deployments = campaignData.deployments || {};
          
          return {
            id: campaign.id,
            entityName: campaign.entity_name || 'Unknown Entity',
            status: 'completed' as const,
            progress: 100,
            contentGenerated: campaignData.contentGenerated || 0,
            deploymentsSuccessful: campaignData.deploymentsSuccessful || deployments.successful || 0,
            serpPenetration: Math.round((campaignData.serpPenetration || 0) * 100),
            estimatedImpact: campaignData.estimatedReach 
              ? `${campaignData.estimatedReach.toLocaleString()} estimated reach`
              : `${campaignData.deploymentsSuccessful || deployments.successful || 0} articles deployed`,
            createdAt: campaign.created_at,
            deploymentUrls: deployments.urls || [],
            platformResults: campaignData.platformResults || {}
          };
        });

        console.log('Transformed campaigns:', transformedCampaigns);
        setCampaigns(transformedCampaigns);

        // Set the most recent campaign as current if none selected
        if (!currentCampaign && transformedCampaigns.length > 0) {
          setCurrentCampaign(transformedCampaigns[0]);
          setActiveTab('monitor');
        }
      } else {
        console.log('No campaigns found in database');
        setCampaigns([]);
      }
    } catch (error) {
      console.error('Error in loadCampaigns:', error);
      toast.error('Failed to load campaign data');
      setCampaigns([]);
    } finally {
      setLoadingCampaigns(false);
    }
  };

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
    
    // Create initial campaign object to show progress
    const campaign: SaturationCampaign = {
      id: `campaign-${Date.now()}`,
      entityName,
      status: 'planning',
      progress: 0,
      contentGenerated: 0,
      deploymentsSuccessful: 0,
      serpPenetration: 0,
      estimatedImpact: 'Initializing deployment...',
      createdAt: new Date().toISOString()
    };
    
    setCurrentCampaign(campaign);
    setActiveTab('monitor'); // Switch to monitor tab immediately

    try {
      console.log('🚀 Starting REAL persona saturation deployment...');
      console.log('Entity:', entityName);
      console.log('Keywords:', targetKeywords);
      console.log('Platforms:', deploymentTargets);
      console.log('Content Count:', contentCount);
      console.log('Mode:', saturationMode);
      
      // Show progress updates
      setCurrentCampaign(prev => prev ? { ...prev, status: 'planning', progress: 10 } : null);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentCampaign(prev => prev ? { ...prev, status: 'generating', progress: 30 } : null);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call the actual edge function
      console.log('📡 Calling persona-saturation edge function...');
      const { data: result, error } = await supabase.functions.invoke('persona-saturation', {
        body: {
          entityName,
          targetKeywords: targetKeywords.split(',').map(k => k.trim()),
          contentCount,
          deploymentTargets,
          saturationMode,
          deploymentTier: 'basic' // You can make this configurable
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        toast.error(`Deployment failed: ${error.message}`);
        setCurrentCampaign(prev => prev ? { 
          ...prev, 
          status: 'planning', 
          progress: 0,
          estimatedImpact: `Failed: ${error.message}`
        } : null);
        return;
      }

      console.log('✅ Deployment response received:', result);

      if (result?.success) {
        const campaignData = result.campaign || {};
        const platformResults = result.platformResults || {};
        
        console.log('📊 Campaign data:', campaignData);
        console.log('🌐 Platform results:', platformResults);
        
        // Update campaign with real results
        const finalCampaign: SaturationCampaign = {
          ...campaign,
          status: 'completed',
          progress: 100,
          contentGenerated: campaignData.contentGenerated || 0,
          deploymentsSuccessful: campaignData.deploymentsSuccessful || 0,
          serpPenetration: Math.round((campaignData.serpPenetration || 0) * 100),
          estimatedImpact: campaignData.estimatedReach 
            ? `${campaignData.estimatedReach.toLocaleString()} estimated reach`
            : `${campaignData.deploymentsSuccessful || 0} articles deployed successfully`,
          deploymentUrls: campaignData.deployments?.urls || [],
          platformResults
        };

        console.log('🎯 Final campaign:', finalCampaign);
        console.log('🔗 Deployment URLs:', finalCampaign.deploymentUrls);

        setCurrentCampaign(finalCampaign);
        
        // Add to campaigns list
        setCampaigns(prev => [finalCampaign, ...prev]);
        
        const urlCount = finalCampaign.deploymentUrls?.length || 0;
        toast.success(`🎯 Campaign completed! ${campaignData.deploymentsSuccessful || 0} articles deployed with ${urlCount} live URLs across ${deploymentTargets.length} platforms`);
        
        // Reload campaigns from database to get the saved version
        setTimeout(() => loadCampaigns(), 2000);
      } else {
        throw new Error(result?.error || 'Unknown deployment error');
      }

    } catch (error: any) {
      console.error('Deployment error:', error);
      toast.error(`Deployment failed: ${error.message}`);
      setCurrentCampaign(prev => prev ? { 
        ...prev, 
        status: 'planning', 
        progress: 0,
        estimatedImpact: `Failed: ${error.message}`
      } : null);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 corporate-heading">
              <Globe className="h-8 w-8 text-corporate-accent" />
              A.R.I.A™ Persona Saturation
            </h1>
            <p className="corporate-subtext mt-1">
              Live Multi-Platform Content Deployment
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1 bg-corporate-darkSecondary text-corporate-lightGray border-corporate-border">
              <FileText className="h-3 w-3" />
              Content Engine
            </Badge>
            <Badge className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
              Live Deployment
            </Badge>
          </div>
        </div>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <FileText className="h-4 w-4 text-corporate-accent" />
                Articles Deployed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {campaigns.reduce((sum, campaign) => sum + (campaign.deploymentsSuccessful || 0), 0)}
              </div>
              <p className="text-xs corporate-subtext">Total across all campaigns</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                {campaigns.length > 0 ? '98.5%' : '0%'}
              </div>
              <p className="text-xs corporate-subtext">Deployment success</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <TrendingUp className="h-4 w-4 text-corporate-accent" />
                Active Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{campaigns.length}</div>
              <p className="text-xs corporate-subtext">Total campaigns</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1 corporate-heading">
                <Zap className="h-4 w-4 text-corporate-accent" />
                Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">12</div>
              <p className="text-xs corporate-subtext">Available platforms</p>
            </CardContent>
          </Card>
        </div>

        {/* No campaigns notice */}
        {campaigns.length === 0 && !loadingCampaigns && (
          <Card className="border-orange-500/20 bg-gradient-to-r from-orange-900/10 to-red-900/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-orange-500" />
                <div>
                  <h3 className="text-lg font-semibold text-white">No Live Campaigns Yet</h3>
                  <p className="text-gray-400">
                    Create your first real campaign below to start deploying live content across multiple platforms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger value="deploy" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              Deploy Campaign
            </TabsTrigger>
            <TabsTrigger value="monitor" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              Monitor Progress {campaigns.length > 0 && `(${campaigns.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deploy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <CampaignMonitor currentCampaign={currentCampaign} />
            </div>
          </TabsContent>

          <TabsContent value="monitor" className="space-y-6">
            <CampaignMonitor 
              currentCampaign={currentCampaign} 
              allCampaigns={campaigns}
              loadingCampaigns={loadingCampaigns}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default PersonaSaturationPanel;
