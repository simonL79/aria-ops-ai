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
      case 'core_seo': return <Github className="h-4 w-4 text-corporate-accent" />;
      case 'amplifier': return <Megaphone className="h-4 w-4 text-corporate-accent" />;
      case 'backlink_booster': return <Link className="h-4 w-4 text-corporate-accent" />;
      default: return <Globe className="h-4 w-4 text-corporate-accent" />;
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
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Globe className="h-5 w-5 text-corporate-accent" />
          Platform Selection ({deploymentTier} tier)
        </CardTitle>
        <p className="text-sm corporate-subtext">
          Choose platforms for multi-channel deployment. Article limits are adjusted based on your selected tier.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedPlatforms).map(([category, platforms]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              {getCategoryIcon(category)}
              <h3 className="font-semibold text-white">{getCategoryTitle(category)}</h3>
              <Badge variant="outline" className="text-xs border-corporate-border text-corporate-lightGray">
                {getCategoryDescription(category)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                const isDisabled = false; // All platforms are enabled
                const platformLimit = calculatePlatformLimit(platform);
                
                return (
                  <div
                    key={platform.id}
                    className={`p-4 border rounded-lg transition-all min-h-[120px] flex flex-col ${
                      isSelected
                        ? 'border-corporate-accent bg-corporate-darkSecondary shadow-lg' 
                        : 'border-corporate-border bg-corporate-darkTertiary hover:border-corporate-accent hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <Checkbox
                        id={platform.id}
                        checked={isSelected}
                        disabled={isDisabled}
                        onCheckedChange={(checked) => 
                          onPlatformToggle(platform.id, !!checked)
                        }
                        className="mt-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={platform.id}
                          className="text-sm font-medium cursor-pointer block mb-2 text-white"
                        >
                          {platform.name}
                        </label>
                        
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge 
                              variant="secondary" 
                              className="text-xs whitespace-nowrap bg-corporate-gray text-white"
                            >
                              {platformLimit} articles max
                            </Badge>
                            
                            {platform.requiresAuth && (
                              <Badge variant="outline" className="text-xs whitespace-nowrap border-corporate-accent text-corporate-accent">
                                Auth Required
                              </Badge>
                            )}
                            
                            <Badge className="text-xs text-black bg-corporate-accent hover:bg-corporate-accentDark whitespace-nowrap">
                              Available
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-corporate-lightGray">
                            Delay: {platform.delayMs}ms between articles
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        <div className="bg-corporate-darkSecondary border border-corporate-accent rounded-lg p-4">
          <h4 className="font-medium text-corporate-accent mb-2">Multi-Platform Strategy</h4>
          <div className="text-sm text-corporate-lightGray space-y-1">
            <p>• <strong className="text-white">Core SEO:</strong> Primary hosting with maximum authority</p>
            <p>• <strong className="text-white">Amplifiers:</strong> Social engagement and visibility boost</p>
            <p>• <strong className="text-white">Backlink Boosters:</strong> Rapid link building and indexing</p>
            <p>• Articles are distributed intelligently across selected platforms</p>
          </div>
        </div>
        
        {selectedPlatforms.length > 0 && (
          <div className="bg-corporate-darkSecondary border border-green-600 rounded-lg p-3">
            <p className="text-sm text-green-400">
              <strong>Selected:</strong> {selectedPlatforms.length} platforms for multi-channel deployment
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlatformSelector;
