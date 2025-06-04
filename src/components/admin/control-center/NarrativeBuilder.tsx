
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Zap, Target } from 'lucide-react';

interface NarrativeBuilderProps {
  selectedEntity: string;
  serviceStatus: any;
}

const NarrativeBuilder: React.FC<NarrativeBuilderProps> = ({
  selectedEntity,
  serviceStatus
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-corporate-accent" />
              Keyword Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Auto-loads keywords and themes for {selectedEntity || 'No entity selected'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-corporate-accent" />
              AI Theme Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              AI-powered content theme generation
            </p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-corporate-accent" />
              Saturation Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Content saturation and deployment tools
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NarrativeBuilder;
