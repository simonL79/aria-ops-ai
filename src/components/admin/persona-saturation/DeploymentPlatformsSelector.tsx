
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, TrendingUp, Target, Shield, Zap, Cloud, Code, FileText, Radio } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: any;
  category: string;
}

interface DeploymentPlatformsSelectorProps {
  deploymentTargets: string[];
  setDeploymentTargets: (targets: string[]) => void;
}

const platforms: Platform[] = [
  { id: 'github-pages', name: 'GitHub Pages', icon: Globe, category: 'Git-based' },
  { id: 'netlify', name: 'Netlify', icon: TrendingUp, category: 'JAMstack' },
  { id: 'vercel', name: 'Vercel', icon: Zap, category: 'Edge' },
  { id: 'surge', name: 'Surge.sh', icon: Target, category: 'Static' },
  { id: 'firebase', name: 'Firebase', icon: Shield, category: 'Google' },
  { id: 'gitlab-pages', name: 'GitLab Pages', icon: Code, category: 'Git-based' },
  { id: 'render', name: 'Render', icon: Cloud, category: 'Static' },
  { id: 'telegraph', name: 'Telegraph', icon: FileText, category: 'Instant' },
  { id: 'pages-dev', name: 'Pages.dev', icon: Globe, category: 'Cloudflare' },
  { id: 'tiiny-host', name: 'Tiiny Host', icon: Target, category: 'Simple' },
  { id: 'neocities', name: 'Neocities', icon: Radio, category: 'Creative' },
  { id: 'google-sites', name: 'Google Sites', icon: Shield, category: 'Google' }
];

const DeploymentPlatformsSelector = ({ deploymentTargets, setDeploymentTargets }: DeploymentPlatformsSelectorProps) => {
  const handlePlatformToggle = (platformId: string) => {
    if (deploymentTargets.includes(platformId)) {
      setDeploymentTargets(deploymentTargets.filter(t => t !== platformId));
    } else {
      setDeploymentTargets([...deploymentTargets, platformId]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Free Hosting Platforms</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {platforms.map(platform => {
          const Icon = platform.icon;
          const isSelected = deploymentTargets.includes(platform.id);
          return (
            <Button
              key={platform.id}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              className="justify-start h-auto py-2 px-3"
              onClick={() => handlePlatformToggle(platform.id)}
            >
              <div className="flex flex-col items-start w-full">
                <div className="flex items-center gap-1 mb-1">
                  <Icon className="h-3 w-3" />
                  <span className="text-xs font-medium">{platform.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{platform.category}</span>
              </div>
            </Button>
          );
        })}
      </div>
      <div className="text-xs text-muted-foreground mt-2">
        Selected {deploymentTargets.length} platform{deploymentTargets.length !== 1 ? 's' : ''} • Each creates unique domains for maximum SERP coverage
      </div>
    </div>
  );
};

export default DeploymentPlatformsSelector;
