import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Rocket, Zap, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContentGenerationHub } from '@/components/content/ContentGenerationHub';

interface ContentGenerationModuleProps {
  selectedEntity: string;
  serviceStatus: any;
}

const ContentGenerationModule: React.FC<ContentGenerationModuleProps> = ({
  selectedEntity,
  serviceStatus
}) => {
  const navigate = useNavigate();
  const [isEmbedded, setIsEmbedded] = useState(false);

  if (isEmbedded) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-corporate-accent">
            A.R.I.A™ Content Generation Engine
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEmbedded(false)}
            className="text-corporate-accent border-corporate-accent"
          >
            Minimize
          </Button>
        </div>
        <ContentGenerationHub />
      </div>
    );
  }

  return (
    <Card className="bg-corporate-darkSecondary border-corporate-border">
      <CardHeader>
        <CardTitle className="text-corporate-accent flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Content Generation Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-corporate-accent">15</div>
            <div className="text-xs text-corporate-lightGray">Live Threats</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">3</div>
            <div className="text-xs text-corporate-lightGray">Generated</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">8</div>
            <div className="text-xs text-corporate-lightGray">Deployed</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-corporate-lightGray">Threat-Driven Generation</span>
            <Badge variant="outline" className="text-green-400 border-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1" />
              Active
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-corporate-lightGray">Multi-Platform Deploy</span>
            <Badge variant="outline" className="text-green-400 border-green-400">Ready</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-corporate-lightGray">Live Monitoring</span>
            <Badge variant="outline" className="text-green-400 border-green-400">Scanning</Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEmbedded(true)}
            className="text-corporate-accent border-corporate-accent hover:bg-corporate-accent hover:text-black"
          >
            <Zap className="h-3 w-3 mr-1" />
            Quick Access
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/content-generation')}
            className="text-corporate-accent border-corporate-accent hover:bg-corporate-accent hover:text-black"
          >
            <Rocket className="h-3 w-3 mr-1" />
            Full Console
          </Button>
        </div>

        {selectedEntity && (
          <div className="p-3 bg-corporate-dark rounded border border-corporate-border">
            <div className="text-xs text-corporate-lightGray mb-1">Active Context</div>
            <div className="text-sm text-white font-medium">{selectedEntity}</div>
            <div className="text-xs text-corporate-accent mt-1">
              Content generation ready for this entity
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentGenerationModule;
