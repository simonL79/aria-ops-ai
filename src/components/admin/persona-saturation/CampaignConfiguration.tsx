import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Brain, Zap, Target, Globe, CheckCircle } from 'lucide-react';

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
    { id: 'github-pages', name: 'GitHub Pages (LIVE)', description: 'Real GitHub repositories with live deployment' }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setDeploymentTargets(
      deploymentTargets.includes(platformId) 
        ? deploymentTargets.filter(id => id !== platformId)
        : [...deploymentTargets, platformId]
    );
  };

  const getSaturationDescription = (mode: string) => {
    switch (mode) {
      case 'defensive':
        return 'Conservative approach - 10-25 LIVE articles across GitHub Pages';
      case 'aggressive':
        return 'Comprehensive deployment - 25-50 LIVE articles across GitHub Pages';
      case 'nuclear':
        return 'Maximum saturation - 50+ LIVE articles across GitHub Pages';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* LIVE Deployment Notice */}
      <Card className="corporate-card border-green-500/30 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-green-400">LIVE GitHub Deployment Active</h3>
              <p className="text-sm text-green-300">
                ✅ Real GitHub repositories will be created - NO SIMULATIONS
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entity Configuration */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Target className="h-5 w-5 text-corporate-accent" />
            Target Entity Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="entityName" className="text-white">Entity Name</Label>
            <Input
              id="entityName"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder="Enter entity name (person, company, brand)"
              className="bg-corporate-darkSecondary border-corporate-border text-white"
            />
          </div>

          <div>
            <Label htmlFor="keywords" className="text-white">Target Keywords</Label>
            <Textarea
              id="keywords"
              value={targetKeywords}
              onChange={(e) => setTargetKeywords(e.target.value)}
              placeholder="Enter comma-separated keywords (e.g., leadership, innovation, excellence)"
              className="bg-corporate-darkSecondary border-corporate-border text-white min-h-20"
            />
            <p className="text-xs text-corporate-lightGray mt-1">
              Keywords will be used for content generation and SEO optimization
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Saturation Mode */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Zap className="h-5 w-5 text-corporate-accent" />
            LIVE Saturation Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={saturationMode}
            onValueChange={(value: 'defensive' | 'aggressive' | 'nuclear') => setSaturationMode(value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 p-3 bg-corporate-darkSecondary rounded">
              <RadioGroupItem value="defensive" id="defensive" />
              <div className="flex-1">
                <Label htmlFor="defensive" className="text-white font-medium">Defensive (LIVE)</Label>
                <p className="text-sm text-corporate-lightGray">{getSaturationDescription('defensive')}</p>
              </div>
              <Badge variant="outline" className="text-green-400 border-green-400">Recommended</Badge>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-corporate-darkSecondary rounded">
              <RadioGroupItem value="aggressive" id="aggressive" />
              <div className="flex-1">
                <Label htmlFor="aggressive" className="text-white font-medium">Aggressive (LIVE)</Label>
                <p className="text-sm text-corporate-lightGray">{getSaturationDescription('aggressive')}</p>
              </div>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">Advanced</Badge>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-corporate-darkSecondary rounded">
              <RadioGroupItem value="nuclear" id="nuclear" />
              <div className="flex-1">
                <Label htmlFor="nuclear" className="text-white font-medium">Nuclear (LIVE)</Label>
                <p className="text-sm text-corporate-lightGray">{getSaturationDescription('nuclear')}</p>
              </div>
              <Badge variant="outline" className="text-red-400 border-red-400">Maximum</Badge>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Content Configuration */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="corporate-heading">Content Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="contentCount" className="text-white">
              Article Count: {contentCount}
            </Label>
            <input
              type="range"
              id="contentCount"
              min="5"
              max="100"
              value={contentCount}
              onChange={(e) => setContentCount(parseInt(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-xs text-corporate-lightGray mt-1">
              <span>5 articles</span>
              <span>100 articles</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Selection */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Globe className="h-5 w-5 text-corporate-accent" />
            LIVE Deployment Platforms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {platforms.map(platform => (
              <div key={platform.id} className="flex items-center space-x-3 p-3 bg-corporate-darkSecondary rounded">
                <Checkbox
                  checked={deploymentTargets.includes(platform.id)}
                  onCheckedChange={() => handlePlatformToggle(platform.id)}
                />
                <div className="flex-1">
                  <div className="text-white font-medium">{platform.name}</div>
                  <div className="text-xs text-corporate-lightGray">{platform.description}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-corporate-lightGray mt-3">
            Selected: {deploymentTargets.length} LIVE platform{deploymentTargets.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Execute Button */}
      <Card className="corporate-card">
        <CardContent className="pt-6">
          <Button
            onClick={onExecute}
            disabled={isExecuting || !entityName.trim() || !targetKeywords.trim() || deploymentTargets.length === 0}
            className="w-full bg-corporate-accent text-black hover:bg-corporate-accentDark font-semibold py-3"
            size="lg"
          >
            {isExecuting ? (
              <>
                <Brain className="h-5 w-5 mr-2 animate-pulse" />
                Executing LIVE Deployment...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Execute LIVE Persona Saturation
              </>
            )}
          </Button>
          <p className="text-xs text-center text-corporate-lightGray mt-2">
            ✅ LIVE GitHub deployment - Real repositories will be created
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignConfiguration;
