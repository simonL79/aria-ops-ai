
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, FileText, Gavel } from 'lucide-react';

interface ShieldhLegalProps {
  selectedEntity: string;
}

const ShieldhLegal: React.FC<ShieldhLegalProps> = ({
  selectedEntity
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-corporate-accent" />
              Legal Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Automated legal document generation for {selectedEntity || 'No entity selected'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-corporate-accent" />
              Compliance Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Legal compliance monitoring and validation
            </p>
          </CardContent>
        </Card>

        <Card className="bg-corporate-darkSecondary border-corporate-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gavel className="h-5 w-5 text-corporate-accent" />
              Strike Commands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-corporate-lightGray">
              Strategic legal action management
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShieldhLegal;
