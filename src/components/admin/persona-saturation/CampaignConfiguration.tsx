
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
  pro: { max: 100, label: 'Pro', description: 'Staggered single-repo deploy' },
  enterprise: { max: 500, label: 'Enterprise', description: 'Multi-repo distributed deployment' }
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

  const getEstimatedTime = () => {
    const baseDelayMs = 750;
    const estimatedMinutes = Math.ceil((contentCount * baseDelayMs) / 60000);
    return estimatedMinutes;
  };

  return (
    <div className="space-y-6">
      {/* Live Deployment Notice */}
      <Alert className="border-green-200 bg-green-50">
        <Github className="h-4 w-4" />
        <AlertDescription className="text-green-800">
          <strong>Live GitHub Pages Deployment:</strong> All articles will be deployed to real GitHub Pages websites with permanent URLs.
        </AlertDescription>
      </Alert>

      {/* Deployment Tier Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Tier Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(DEPLOYMENT_TIERS).map(([key, tier]) => (
              <div
                key={key}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  deploymentTier === key 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTierChange(key as DeploymentTier)}
              >
                <div className="flex items-center gap-2 mb-2">
                  {key === 'basic' && <Zap className="h-4 w-4 text-green-600" />}
                  {key === 'pro' && <Rocket className="h-4 w-4 text-blue-600" />}
                  {key === 'enterprise' && <Crown className="h-4 w-4 text-purple-600" />}
                  <h3 className="font-semibold">{tier.label}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{tier.description}</p>
                <Badge variant="outline">Up to {tier.max} articles</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Target Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="entityName">Entity/Person Name</Label>
              <Input
                id="entityName"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                placeholder="e.g., John Smith, Acme Corp"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="keywords">Target Keywords</Label>
              <Textarea
                id="keywords"
                value={targetKeywords}
                onChange={(e) => setTargetKeywords(e.target.value)}
                placeholder="e.g., CEO, entrepreneur, technology leader, innovation"
                className="mt-1"
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate keywords with commas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contentCount">Number of Articles</Label>
              <div className="flex items-center space-x-2 mt-1">
                <Input
                  id="contentCount"
                  type="number"
                  min="1"
                  max={maxArticles}
                  value={contentCount}
                  onChange={(e) => handleContentCountChange(parseInt(e.target.value) || 1)}
                  className="w-24"
                />
                <Badge variant="outline" className="text-xs">
                  Max {maxArticles} articles ({DEPLOYMENT_TIERS[deploymentTier].label})
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {deploymentTier === 'enterprise' ? 
                  'Multi-repository distributed deployment with smart load balancing' :
                  deploymentTier === 'pro' ?
                  'Staggered deployment with 750ms intervals for optimal performance' :
                  'Safe deployment mode with rate limiting protection'
                }
              </p>
            </div>

            <div>
              <Label htmlFor="saturationMode">Campaign Intensity</Label>
              <Select value={saturationMode} onValueChange={setSaturationMode}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defensive">
                    <div className="flex flex-col">
                      <span>Defensive</span>
                      <span className="text-xs text-muted-foreground">Conservative content approach</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="aggressive">
                    <div className="flex flex-col">
                      <span>Aggressive</span>
                      <span className="text-xs text-muted-foreground">Strong positive positioning</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="nuclear">
                    <div className="flex flex-col">
                      <span>Nuclear</span>
                      <span className="text-xs text-muted-foreground">Maximum impact content</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deployment Platform */}
      <Card>
        <CardHeader>
          <CardTitle>Deployment Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge className="bg-gray-900 text-white">
                <Github className="h-3 w-3 mr-1" />
                GitHub Pages
              </Badge>
              <span className="text-sm text-muted-foreground">
                {deploymentTier === 'enterprise' ? 'Multi-repository deployment' : 'Single repository deployment'}
              </span>
            </div>
            
            {deploymentTier === 'enterprise' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-sm text-purple-800">
                  <Crown className="inline h-4 w-4 mr-1" />
                  Enterprise deployment will distribute articles across multiple repositories for maximum scale and reliability.
                </p>
              </div>
            )}
            
            <div className="text-xs text-muted-foreground">
              <p>Deployment features:</p>
              <ul className="list-disc list-inside ml-2 space-y-1">
                <li>SEO-optimized metadata and structure</li>
                <li>Unique content titles and descriptions</li>
                <li>Auto-indexing via search engines</li>
                <li>Real-time deployment logging</li>
                {deploymentTier !== 'basic' && <li>Advanced rate limiting protection</li>}
                {deploymentTier === 'enterprise' && <li>Smart load balancing across repositories</li>}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Deployment Info:</strong> Articles deployed with {deploymentTier === 'basic' ? '1-second' : '750ms'} intervals. 
          Estimated deployment time: {getEstimatedTime()} minutes for {contentCount} articles.
          {deploymentTier === 'enterprise' && ' Enterprise mode includes distributed deployment across multiple repositories.'}
        </AlertDescription>
      </Alert>

      {/* Execute Button */}
      <div className="flex justify-center">
        <Button
          onClick={() => onExecute()}
          disabled={isExecuting || !entityName.trim() || !targetKeywords.trim()}
          size="lg"
          className="min-w-48"
        >
          <Rocket className="h-4 w-4 mr-2" />
          {isExecuting ? 'Deploying Live Articles...' : `Deploy ${contentCount} Live Articles (${DEPLOYMENT_TIERS[deploymentTier].label})`}
        </Button>
      </div>
    </div>
  );
};

export default CampaignConfiguration;
