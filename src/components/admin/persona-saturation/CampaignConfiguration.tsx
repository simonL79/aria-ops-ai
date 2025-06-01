
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Zap, Shield, Target, Globe, GitBranch, Cloud, Database, Server } from 'lucide-react';

interface CampaignConfigurationProps {
  entityName: string;
  setEntityName: (value: string) => void;
  targetKeywords: string;
  setTargetKeywords: (value: string) => void;
  contentCount: number;
  setContentCount: (value: number) => void;
  saturationMode: 'defensive' | 'aggressive' | 'nuclear';
  setSaturationMode: (mode: 'defensive' | 'aggressive' | 'nuclear') => void;
  deploymentTargets: string[];
  setDeploymentTargets: (targets: string[]) => void;
  isExecuting: boolean;
  onExecute: () => void;
}

const PLATFORM_OPTIONS = [
  { 
    id: 'github-pages', 
    name: 'GitHub Pages', 
    icon: GitBranch, 
    type: 'Git-based',
    description: 'Direct Git push deployment - Real URLs',
    noApiKey: true,
    maxArticles: 500
  },
  { 
    id: 'cloudflare-pages', 
    name: 'Cloudflare Pages', 
    icon: Cloud, 
    type: 'Git/CLI',
    description: 'Wrangler CLI or Git deployment',
    noApiKey: true,
    maxArticles: 300
  },
  { 
    id: 'netlify', 
    name: 'Netlify', 
    icon: Globe, 
    type: 'CLI-based',
    description: 'Netlify CLI deployment',
    noApiKey: true,
    maxArticles: 200
  },
  { 
    id: 'ipfs-pinata', 
    name: 'IPFS/Pinata', 
    icon: Database, 
    type: 'Upload',
    description: 'IPFS static deployment via gateway',
    noApiKey: true,
    maxArticles: 100
  },
  { 
    id: 's3-static', 
    name: 'S3 Static', 
    icon: Server, 
    type: 'Upload',
    description: 'S3 public bucket static hosting',
    noApiKey: true,
    maxArticles: 400
  },
  { 
    id: 'arweave', 
    name: 'Arweave', 
    icon: Database, 
    type: 'Permanent',
    description: 'Permanent static deploy via CLI',
    noApiKey: true,
    maxArticles: 50
  },
  { 
    id: 'local-static', 
    name: 'Local Static', 
    icon: Server, 
    type: 'Local',
    description: 'Local NGINX or Supabase Storage',
    noApiKey: true,
    maxArticles: 1000
  }
];

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
  const handlePlatformToggle = (platformId: string) => {
    if (deploymentTargets.includes(platformId)) {
      setDeploymentTargets(deploymentTargets.filter(id => id !== platformId));
    } else {
      setDeploymentTargets([...deploymentTargets, platformId]);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'defensive': return Shield;
      case 'aggressive': return Target;
      case 'nuclear': return Zap;
      default: return Shield;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'defensive': return 'text-blue-400';
      case 'aggressive': return 'text-orange-400';
      case 'nuclear': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Globe className="h-5 w-5 text-corporate-accent" />
          Campaign Configuration
        </CardTitle>
        <div className="text-sm text-corporate-lightGray">
          No-API-Key Static Deployment Strategy
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Entity Configuration */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="entityName" className="text-corporate-lightGray">Entity Name</Label>
            <Input
              id="entityName"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder="Enter entity name..."
              className="bg-corporate-darkSecondary border-corporate-border text-white"
            />
          </div>

          <div>
            <Label htmlFor="targetKeywords" className="text-corporate-lightGray">Target Keywords</Label>
            <Textarea
              id="targetKeywords"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              placeholder="Enter keywords separated by commas..."
              className="bg-corporate-darkSecondary border-corporate-border text-white"
              rows={3}
            />
          </div>
        </div>

        {/* Content Count */}
        <div className="space-y-3">
          <Label className="text-corporate-lightGray">Content Count: {contentCount}</Label>
          <Slider
            value={[contentCount]}
            onValueChange={(value) => setContentCount(value[0])}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="text-xs text-corporate-lightGray">
            Articles will be distributed across selected platforms
          </div>
        </div>

        {/* Saturation Mode */}
        <div className="space-y-3">
          <Label className="text-corporate-lightGray">Saturation Mode</Label>
          <div className="grid grid-cols-3 gap-2">
            {(['defensive', 'aggressive', 'nuclear'] as const).map((mode) => {
              const Icon = getModeIcon(mode);
              const isSelected = saturationMode === mode;
              return (
                <Button
                  key={mode}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => setSaturationMode(mode)}
                  className={`flex items-center gap-2 ${isSelected ? 'bg-corporate-accent text-black' : 'border-corporate-border text-corporate-lightGray hover:bg-corporate-darkSecondary'}`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-black' : getModeColor(mode)}`} />
                  <span className="capitalize">{mode}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Deployment Platforms */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-corporate-lightGray">Static Deployment Platforms</Label>
            <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400 border-green-500/50">
              No API Keys Required
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {PLATFORM_OPTIONS.map((platform) => {
              const Icon = platform.icon;
              const isSelected = deploymentTargets.includes(platform.id);
              
              return (
                <div
                  key={platform.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected 
                      ? 'border-corporate-accent bg-corporate-accent/10' 
                      : 'border-corporate-border bg-corporate-darkSecondary/50 hover:bg-corporate-darkSecondary'
                  }`}
                  onClick={() => handlePlatformToggle(platform.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox 
                        checked={isSelected}
                        onChange={() => handlePlatformToggle(platform.id)}
                      />
                      <Icon className="h-5 w-5 text-corporate-accent" />
                      <div>
                        <div className="font-medium text-white">{platform.name}</div>
                        <div className="text-xs text-corporate-lightGray">{platform.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs mb-1">
                        {platform.type}
                      </Badge>
                      <div className="text-xs text-corporate-lightGray">
                        Max: {platform.maxArticles}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {deploymentTargets.length === 0 && (
            <div className="text-sm text-orange-400 p-3 bg-orange-500/10 rounded-lg border border-orange-500/30">
              Please select at least one deployment platform
            </div>
          )}
        </div>

        {/* Deployment Summary */}
        {deploymentTargets.length > 0 && (
          <div className="p-3 bg-corporate-darkSecondary rounded-lg">
            <div className="text-sm font-medium text-white mb-2">Deployment Summary</div>
            <div className="text-xs text-corporate-lightGray space-y-1">
              <div>Selected Platforms: {deploymentTargets.length}</div>
              <div>Articles per Platform: ~{Math.ceil(contentCount / deploymentTargets.length)}</div>
              <div>Strategy: Static HTML, No API Keys</div>
              <div>Mode: {saturationMode.charAt(0).toUpperCase() + saturationMode.slice(1)}</div>
            </div>
          </div>
        )}

        {/* Execute Button */}
        <Button
          onClick={onExecute}
          disabled={isExecuting || !entityName.trim() || !targetKeywords.trim() || deploymentTargets.length === 0}
          className="w-full bg-corporate-accent text-black hover:bg-corporate-accentDark disabled:opacity-50"
        >
          {isExecuting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              Deploying Static Content...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Deploy Static Campaign
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CampaignConfiguration;
