
import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Rocket, Globe, Shield } from 'lucide-react';
import DeploymentPlatformsSelector from './DeploymentPlatformsSelector';

interface CampaignConfigurationProps {
  entityName: string;
  setEntityName: (name: string) => void;
  targetKeywords: string;
  setTargetKeywords: (keywords: string) => void;
  contentCount: number;
  setContentCount: (count: number) => void;
  saturationMode: 'defensive' | 'aggressive' | 'nuclear';
  setSaturationMode: (mode: 'defensive' | 'aggressive' | 'nuclear') => void;
  deploymentTargets: string[];
  setDeploymentTargets: (targets: string[]) => void;
  isExecuting: boolean;
  onExecute: () => void;
}

const getSaturationModeColor = (mode: string) => {
  switch (mode) {
    case 'defensive': return 'bg-blue-100 text-blue-800';
    case 'aggressive': return 'bg-orange-100 text-orange-800';
    case 'nuclear': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const CampaignConfiguration = ({
  entityName,
  setEntityName,
  targetKeywords,
  setTargetKeywords,
  contentCount,
  setContentCount,
  saturationMode,
  setSaturationMode,
  deploymentTargets,
  setDeploymentTargets,
  isExecuting,
  onExecute
}: CampaignConfigurationProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Entity</label>
          <Input
            placeholder="Enter entity name (e.g., Company Name, Person)"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Keywords</label>
          <Input
            placeholder="Enter keywords (comma-separated)"
            value={targetKeywords}
            onChange={(e) => setTargetKeywords(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Content Count</label>
          <Select value={contentCount.toString()} onValueChange={(v) => setContentCount(parseInt(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 Articles (Test)</SelectItem>
              <SelectItem value="25">25 Articles (Light)</SelectItem>
              <SelectItem value="50">50 Articles (Standard)</SelectItem>
              <SelectItem value="100">100 Articles (Heavy)</SelectItem>
              <SelectItem value="250">250 Articles (Saturation)</SelectItem>
              <SelectItem value="500">500 Articles (Dominance)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Saturation Mode</label>
          <Select value={saturationMode} onValueChange={(v) => setSaturationMode(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="defensive">Defensive (Balanced)</SelectItem>
              <SelectItem value="aggressive">Aggressive (Promotional)</SelectItem>
              <SelectItem value="nuclear">Nuclear (Maximum Impact)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DeploymentPlatformsSelector 
        deploymentTargets={deploymentTargets}
        setDeploymentTargets={setDeploymentTargets}
      />

      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-green-600" />
          <div>
            <h4 className="font-medium text-green-800">Multi-Platform SERP Saturation</h4>
            <p className="text-sm text-green-700">
              ✅ Deploy across {deploymentTargets.length} free hosting platform{deploymentTargets.length !== 1 ? 's' : ''}<br/>
              ✅ Creates diverse domain portfolio for SEO<br/>
              ✅ Strategic backlinks between all articles<br/>
              ✅ Central hub repository with sitemap<br/>
              ✅ Automatic search engine pinging
            </p>
          </div>
        </div>
        <Badge className={getSaturationModeColor(saturationMode)}>
          {saturationMode.toUpperCase()}
        </Badge>
      </div>

      <Button 
        onClick={onExecute}
        disabled={isExecuting || !entityName.trim() || !targetKeywords.trim() || deploymentTargets.length === 0}
        className="w-full"
        size="lg"
      >
        {isExecuting ? (
          <>
            <Shield className="h-4 w-4 mr-2 animate-spin" />
            Deploying {contentCount} Articles to {deploymentTargets.length} Platform{deploymentTargets.length !== 1 ? 's' : ''}...
          </>
        ) : (
          <>
            <Rocket className="h-4 w-4 mr-2" />
            🚀 Deploy {contentCount} Articles to {deploymentTargets.length} Platform{deploymentTargets.length !== 1 ? 's' : ''}
          </>
        )}
      </Button>
    </div>
  );
};

export default CampaignConfiguration;
