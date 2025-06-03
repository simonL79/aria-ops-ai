
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Target, Brain, FileText } from 'lucide-react';

interface SystemStatus {
  keywordIntelligence: string;
  counterNarrative: string;
  articleGeneration: string;
}

interface SystemStatusPanelProps {
  systemStatus: SystemStatus;
}

const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ systemStatus }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50 animate-pulse">ACTIVE</Badge>;
      case 'COMPLETE':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">COMPLETE</Badge>;
      case 'READY':
        return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">READY</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/50">STANDBY</Badge>;
    }
  };

  return (
    <Card className="bg-corporate-darkSecondary border-corporate-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-corporate-accent" />
          Live Intelligence Pipeline Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          <div className="flex items-center justify-between p-4 bg-corporate-dark rounded-lg">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-corporate-accent" />
              <div>
                <div className="font-medium text-white">Live Keyword Intelligence</div>
                <div className="text-sm text-gray-400">OSINT Data Gathering</div>
              </div>
            </div>
            {getStatusBadge(systemStatus.keywordIntelligence)}
          </div>

          <div className="flex items-center justify-between p-4 bg-corporate-dark rounded-lg">
            <div className="flex items-center gap-3">
              <Brain className="h-6 w-6 text-blue-400" />
              <div>
                <div className="font-medium text-white">Counter-Narrative Generation</div>
                <div className="text-sm text-gray-400">Strategic Response Planning</div>
              </div>
            </div>
            {getStatusBadge(systemStatus.counterNarrative)}
          </div>

          <div className="flex items-center justify-between p-4 bg-corporate-dark rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-purple-400" />
              <div>
                <div className="font-medium text-white">Article Generation & Deployment</div>
                <div className="text-sm text-gray-400">Content Creation & Publishing</div>
              </div>
            </div>
            {getStatusBadge(systemStatus.articleGeneration)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusPanel;
