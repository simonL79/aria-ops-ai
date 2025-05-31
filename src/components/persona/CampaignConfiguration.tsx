
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Rocket, Settings } from 'lucide-react';

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

const CampaignConfiguration: React.FC<CampaignConfigurationProps> = ({
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
}) => {
  const platforms = [
    { id: 'github-pages', name: 'GitHub Pages', description: 'Static site hosting' },
    { id: 'medium', name: 'Medium', description: 'Blog platform' },
    { id: 'linkedin', name: 'LinkedIn', description: 'Professional network' },
    { id: 'wordpress', name: 'WordPress', description: 'Content management' }
  ];

  const handlePlatformToggle = (platformId: string, checked: boolean) => {
    if (checked) {
      setDeploymentTargets([...deploymentTargets, platformId]);
    } else {
      setDeploymentTargets(deploymentTargets.filter(id => id !== platformId));
    }
  };

  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Settings className="h-5 w-5 text-corporate-accent" />
          Campaign Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="entityName">Entity Name</Label>
            <Input
              id="entityName"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder="Enter entity name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contentCount">Content Count</Label>
            <Input
              id="contentCount"
              type="number"
              value={contentCount}
              onChange={(e) => setContentCount(parseInt(e.target.value) || 10)}
              min={1}
              max={500}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetKeywords">Target Keywords</Label>
          <Input
            id="targetKeywords"
            value={targetKeywords}
            onChange={(e) => setTargetKeywords(e.target.value)}
            placeholder="Enter keywords separated by commas"
          />
        </div>

        <div className="space-y-2">
          <Label>Saturation Mode</Label>
          <Select value={saturationMode} onValueChange={setSaturationMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="defensive">Defensive - Measured approach</SelectItem>
              <SelectItem value="aggressive">Aggressive - High-impact deployment</SelectItem>
              <SelectItem value="nuclear">Nuclear - Maximum saturation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Deployment Platforms</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {platforms.map(platform => (
              <div key={platform.id} className="flex items-center space-x-2 p-3 border border-corporate-border rounded-lg">
                <Checkbox
                  id={platform.id}
                  checked={deploymentTargets.includes(platform.id)}
                  onCheckedChange={(checked) => handlePlatformToggle(platform.id, checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor={platform.id} className="text-white font-medium cursor-pointer">
                    {platform.name}
                  </Label>
                  <p className="text-xs text-corporate-lightGray">{platform.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={onExecute} 
          disabled={isExecuting || !entityName || !targetKeywords || deploymentTargets.length === 0}
          className="w-full bg-corporate-accent hover:bg-corporate-accentDark text-black"
        >
          <Rocket className="h-4 w-4 mr-2" />
          {isExecuting ? 'Deploying Campaign...' : 'Deploy Persona Saturation Campaign'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CampaignConfiguration;
