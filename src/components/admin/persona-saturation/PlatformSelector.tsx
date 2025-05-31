
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DEPLOYMENT_PLATFORMS, DeploymentPlatform } from '@/services/deployment/multiPlatformDeployer';
import { Github, Globe, Megaphone, Link } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformToggle: (platformId: string, enabled: boolean) => void;
  deploymentTier: 'basic' | 'pro' | 'enterprise';
}

const PlatformSelector = ({ selectedPlatforms, onPlatformToggle, deploymentTier }: PlatformSelectorProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core_seo': return <Github className="h-4 w-4" />;
      case 'amplifier': return <Megaphone className="h-4 w-4" />;
      case 'backlink_booster': return <Link className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'core_seo': return 'Core SEO Hosting';
      case 'amplifier': return 'Amplifier Platforms';
      case 'backlink_booster': return 'Backlink Boosters';
      default: return 'Other Platforms';
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'core_seo': return 'Primary hosting with strong SEO authority';
      case 'amplifier': return 'Social and professional engagement platforms';
      case 'backlink_booster': return 'Quick publishing for link building';
      default: return 'Additional deployment targets';
    }
  };

  const getTierMultiplier = () => {
    switch (deploymentTier) {
      case 'basic': return 0.2;
      case 'pro': return 0.6;
      case 'enterprise': return 1.0;
      default: return 0.2;
    }
  };

  const calculatePlatformLimit = (platform: DeploymentPlatform) => {
    return Math.floor(platform.maxArticles * getTierMultiplier());
  };

  const groupedPlatforms = DEPLOYMENT_PLATFORMS.reduce((acc, platform) => {
    if (!acc[platform.category]) {
      acc[platform.category] = [];
    }
    acc[platform.category].push(platform);
    return acc;
  }, {} as Record<string, DeploymentPlatform[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Platform Selection ({deploymentTier} tier)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose platforms for multi-channel deployment. Article limits are adjusted based on your selected tier.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedPlatforms).map(([category, platforms]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              {getCategoryIcon(category)}
              <h3 className="font-semibold">{getCategoryTitle(category)}</h3>
              <Badge variant="outline" className="text-xs">
                {getCategoryDescription(category)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {platforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                const isDisabled = !platform.enabled;
                const platformLimit = calculatePlatformLimit(platform);
                
                return (
                  <div
                    key={platform.id}
                    className={`p-3 border rounded-lg transition-all ${
                      isSelected && !isDisabled
                        ? 'border-blue-500 bg-blue-50' 
                        : isDisabled
                        ? 'border-gray-200 bg-gray-50 opacity-60'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={platform.id}
                        checked={isSelected}
                        disabled={isDisabled}
                        onCheckedChange={(checked) => 
                          onPlatformToggle(platform.id, !!checked)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={platform.id}
                          className={`text-sm font-medium cursor-pointer ${
                            isDisabled ? 'text-gray-400' : ''
                          }`}
                        >
                          {platform.name}
                        </label>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={isDisabled ? "outline" : "secondary"} 
                            className="text-xs"
                          >
                            {platformLimit} articles max
                          </Badge>
                          
                          {platform.requiresAuth && (
                            <Badge variant="outline" className="text-xs">
                              Auth Required
                            </Badge>
                          )}
                          
                          {isDisabled && (
                            <Badge variant="outline" className="text-xs text-orange-600">
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          Delay: {platform.delayMs}ms between articles
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">Multi-Platform Strategy</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>Core SEO:</strong> Primary hosting with maximum authority</p>
            <p>• <strong>Amplifiers:</strong> Social engagement and visibility boost</p>
            <p>• <strong>Backlink Boosters:</strong> Rapid link building and indexing</p>
            <p>• Articles are distributed intelligently across selected platforms</p>
          </div>
        </div>
        
        {selectedPlatforms.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800">
              <strong>Selected:</strong> {selectedPlatforms.length} platforms for multi-channel deployment
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlatformSelector;
