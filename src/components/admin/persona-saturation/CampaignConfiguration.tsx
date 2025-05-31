
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Rocket, Github } from 'lucide-react';
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
  const maxArticles = 10;

  const handleContentCountChange = (value: number) => {
    // Enforce maximum of 10 articles
    const clampedValue = Math.min(Math.max(1, value), maxArticles);
    setContentCount(clampedValue);
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
                  Max {maxArticles} articles
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Limited to {maxArticles} articles per campaign to ensure reliable deployment
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
          <CardTitle>Deployment Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Badge className="bg-gray-900 text-white">
              <Github className="h-3 w-3 mr-1" />
              GitHub Pages
            </Badge>
            <span className="text-sm text-muted-foreground">
              Free hosting with permanent URLs
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            All articles will be deployed to individual GitHub Pages repositories
          </p>
        </CardContent>
      </Card>

      {/* Rate Limiting Warning */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Deployment Info:</strong> Articles are deployed with rate limiting protection. 
          Each deployment includes a 1-second delay to prevent GitHub API limits. 
          Estimated deployment time: {contentCount} minutes.
        </AlertDescription>
      </Alert>

      {/* Execute Button */}
      <div className="flex justify-center">
        <Button
          onClick={onExecute}
          disabled={isExecuting || !entityName.trim() || !targetKeywords.trim()}
          size="lg"
          className="min-w-48"
        >
          <Rocket className="h-4 w-4 mr-2" />
          {isExecuting ? 'Deploying Live Articles...' : `Deploy ${contentCount} Live Articles`}
        </Button>
      </div>
    </div>
  );
};

export default CampaignConfiguration;
