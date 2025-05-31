
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Rocket, Github, Crown, Zap } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PlatformSelector from './PlatformSelector';

interface CampaignConfigurationProps {
  entityName: string;
  setEntityName: (value: string) => void;
  targetKeywords: string;
  setTargetKeywords: (value: string) => void;
  contentCount: number;
  setContentCount: (value: number) => void;
  saturationMode: 'defensive' | 'aggressive' | 'nuclear';
  setSaturationMode: (value: 'defensive' | 'aggressive' | 'nuclear') => void;
  deploymentTargets: string[];
  setDeploymentTargets: (value: string[]) => void;
  isExecuting: boolean;
  onExecute: () => void;
}

type DeploymentTier = 'basic' | 'pro' | 'enterprise';

const DEPLOYMENT_TIERS = {
  basic: { max: 10, label: 'Basic', description: 'Safe deployment mode' },
  pro: { max: 100, label: 'Pro', description: 'Multi-platform deployment' },
  enterprise: { max: 500, label: 'Enterprise', description: 'Full-scale distributed deployment' }
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
  const [deploymentTier, setDeploymentTier] = React.useState<DeploymentTier>('basic');
  const maxArticles = DEPLOYMENT_TIERS[deploymentTier].max;

  const handleContentCountChange = (value: number) => {
    const clampedValue = Math.min(Math.max(1, value), maxArticles);
    setContentCount(clampedValue);
  };

  const handleTierChange = (tier: DeploymentTier) => {
    setDeploymentTier(tier);
    // Adjust content count if it exceeds new tier limit
    if (contentCount > DEPLOYMENT_TIERS[tier].max) {
      setContentCount(DEPLOYMENT_TIERS[tier].max);
    }
  };

  const handlePlatformToggle = (platformId: string, enabled: boolean) => {
    if (enabled) {
      setDeploymentTargets([...deploymentTargets, platformId]);
    } else {
      setDeploymentTargets(deploymentTargets.filter(p => p !== platformId));
    }
  };

  const getEstimatedTime = () => {
    const platformCount = deploymentTargets.length || 1;
    const articlesPerPlatform = Math.ceil(contentCount / platformCount);
    const baseDelayMs = 750;
    const estimatedMinutes = Math.ceil((articlesPerPlatform * baseDelayMs * platformCount) / 60000);
    return estimatedMinutes;
  };

  return (
    <div className="space-y-6">
      {/* Live Deployment Notice */}
      <Alert className="border-corporate-accent bg-corporate-darkSecondary">
        <Github className="h-4 w-4 text-corporate-accent" />
        <AlertDescription className="text-corporate-lightGray">
          <strong className="text-corporate-accent">Multi-Platform Live Deployment:</strong> Articles will be deployed across selected platforms with permanent URLs and SEO optimization.
        </AlertDescription>
      </Alert>

      {/* Deployment Tier Selection */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="corporate-heading">Deployment Tier Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(DEPLOYMENT_TIERS).map(([key, tier]) => (
              <div
                key={key}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  deploymentTier === key 
                    ? 'border-corporate-accent bg-corporate-darkSecondary shadow-lg' 
                    : 'border-corporate-border bg-corporate-darkTertiary hover:border-corporate-accent hover:shadow-md'
                }`}
                onClick={() => handleTierChange(key as DeploymentTier)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {key === 'basic' && <Zap className="h-4 w-4 text-corporate-accent" />}
                  {key === 'pro' && <Rocket className="h-4 w-4 text-corporate-accent" />}
                  {key === 'enterprise' && <Crown className="h-4 w-4 text-corporate-accent" />}
                  <h3 className="font-semibold text-white">{tier.label}</h3>
                </div>
                <p className="text-sm text-corporate-lightGray mb-2">{tier.description}</p>
                <Badge variant="outline" className="border-corporate-accent text-corporate-accent">
                  Up to {tier.max} articles
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Selection */}
      <PlatformSelector
        selectedPlatforms={deploymentTargets}
        onPlatformToggle={handlePlatformToggle}
        deploymentTier={deploymentTier}
      />

      {/* Configuration Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="corporate-card">
          <CardHeader>
            <CardTitle className="corporate-heading">Target Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="entityName" className="text-corporate-lightGray">Entity/Person Name</Label>
              <Input
                id="entityName"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="e.g., John Smith, Acme Corp"
                className="mt-1 bg-corporate-darkTertiary border-corporate-border text-white placeholder-corporate-gray"
              />
            </div>

            <div>
              <Label htmlFor="keywords" className="text-corporate-lightGray">Target Keywords</Label>
              <Textarea
                id="keywords"
                value={targetKeywords}
                onChange={(e) => setTargetKeywords(e.target.value)}
                placeholder="e.g., CEO, entrepreneur, technology leader, innovation"
                className="mt-1 bg-corporate-darkTertiary border-corporate-border text-white placeholder-corporate-gray"
                rows={3}
              />
              <p className="text-xs text-corporate-gray mt-1">
                Separate keywords with commas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardHeader>
            <CardTitle className="corporate-heading">Campaign Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contentCount" className="text-corporate-lightGray">Number of Articles</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="contentCount"
                  type="number"
                  min="1"
                  max={maxArticles}
                  value={contentCount}
                  onChange={(e) => handleContentCountChange(parseInt(e.target.value) || 1)}
                  className="w-24 bg-corporate-darkTertiary border-corporate-border text-white"
                />
                <Badge variant="outline" className="text-xs border-corporate-accent text-corporate-accent">
                  Max {maxArticles} articles ({DEPLOYMENT_TIERS[deploymentTier].label})
                </Badge>
              </div>
              <p className="text-xs text-corporate-gray mt-1">
                {deploymentTier === 'enterprise' ? 
                  'Full-scale multi-platform deployment with intelligent distribution' :
                  deploymentTier === 'pro' ?
                  'Multi-platform deployment with optimized scheduling' :
                  'Safe deployment with basic platform support'
                }
              </p>
            </div>

            <div>
              <Label htmlFor="saturationMode" className="text-corporate-lightGray">Campaign Intensity</Label>
              <Select value={saturationMode} onValueChange={setSaturationMode}>
                <SelectTrigger className="mt-1 bg-corporate-darkTertiary border-corporate-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-corporate-darkTertiary border-corporate-border">
                  <SelectItem value="defensive" className="text-white hover:bg-corporate-darkSecondary">
                    <div className="flex flex-col">
                      <span>Defensive</span>
                      <span className="text-xs text-corporate-gray">Conservative content approach</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="aggressive" className="text-white hover:bg-corporate-darkSecondary">
                    <div className="flex flex-col">
                      <span>Aggressive</span>
                      <span className="text-xs text-corporate-gray">Strong positive positioning</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="nuclear" className="text-white hover:bg-corporate-darkSecondary">
                    <div className="flex flex-col">
                      <span>Nuclear</span>
                      <span className="text-xs text-corporate-gray">Maximum impact content</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deployment Info */}
      <Alert className="border-corporate-accent bg-corporate-darkSecondary">
        <AlertCircle className="h-4 w-4 text-corporate-accent" />
        <AlertDescription className="text-corporate-lightGray">
          <strong className="text-corporate-accent">Multi-Platform Deployment:</strong> {contentCount} articles across {deploymentTargets.length || 1} platform(s). 
          Estimated time: {getEstimatedTime()} minutes with intelligent distribution and rate limiting.
          {deploymentTier === 'enterprise' && ' Enterprise mode includes advanced load balancing and distributed deployment.'}
        </AlertDescription>
      </Alert>

      {/* Execute Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => onExecute()}
          disabled={isExecuting || !entityName.trim() || !targetKeywords.trim() || deploymentTargets.length === 0}
          size="lg"
          className="min-w-48 bg-corporate-accent text-black hover:bg-corporate-accentDark font-semibold"
        >
          <Rocket className="h-4 w-4 mr-2" />
          {isExecuting ? 'Deploying Across Platforms...' : `Deploy ${contentCount} Articles (${deploymentTargets.length} Platform${deploymentTargets.length !== 1 ? 's' : ''})`}
        </Button>
      </div>
    </div>
  );
};

export default CampaignConfiguration;
