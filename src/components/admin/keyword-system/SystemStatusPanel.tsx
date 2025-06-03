
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, Target, Zap, Bot, XCircle } from 'lucide-react';

interface SystemStatusPanelProps {
  systemStatus: {
    keywordIntelligence: string;
    counterNarrative: string;
    articleGeneration: string;
    ciaPrecision?: string;
  };
  ciaPrecisionEnabled?: boolean;
}

const SystemStatusPanel = ({ systemStatus, ciaPrecisionEnabled = false }: SystemStatusPanelProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'COMPLETE':
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'TESTING':
        return <Target className="h-6 w-6 text-blue-400 animate-pulse" />;
      case 'FAILED':
      case 'ERROR':
        return <XCircle className="h-6 w-6 text-red-400" />;
      case 'READY':
        return <Zap className="h-6 w-6 text-corporate-accent" />;
      case 'STANDBY':
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-900/20 text-green-300 border-green-500/30';
      case 'COMPLETE':
        return 'bg-blue-900/20 text-blue-300 border-blue-500/30';
      case 'TESTING':
        return 'bg-yellow-900/20 text-yellow-300 border-yellow-500/30';
      case 'READY':
        return 'bg-purple-900/20 text-purple-300 border-purple-500/30';
      case 'FAILED':
      case 'ERROR':
        return 'bg-red-900/20 text-red-300 border-red-500/30';
      case 'STANDBY':
      default:
        return 'bg-gray-900/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="corporate-card mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold text-white">
          <Bot className="h-7 w-7 text-corporate-accent" />
          A.R.I.A vX™ System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-1 ${ciaPrecisionEnabled ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
          {ciaPrecisionEnabled && (
            <div className="flex flex-col justify-between p-6 border border-corporate-border rounded-lg bg-corporate-darkTertiary hover:bg-corporate-darkSecondary transition-colors">
              <div className="flex items-center gap-4 mb-4">
                {getStatusIcon(systemStatus.ciaPrecision || 'STANDBY')}
                <div>
                  <h3 className="font-semibold text-lg text-white">CIA Precision Engine</h3>
                  <p className="text-sm text-corporate-lightGray">Entity disambiguation</p>
                </div>
              </div>
              <Badge className={`${getStatusColor(systemStatus.ciaPrecision || 'STANDBY')} text-sm font-medium`}>
                {systemStatus.ciaPrecision || 'STANDBY'}
              </Badge>
            </div>
          )}

          <div className="flex flex-col justify-between p-6 border border-corporate-border rounded-lg bg-corporate-darkTertiary hover:bg-corporate-darkSecondary transition-colors">
            <div className="flex items-center gap-4 mb-4">
              {getStatusIcon(systemStatus.keywordIntelligence)}
              <div>
                <h3 className="font-semibold text-lg text-white">Keyword Intelligence</h3>
                <p className="text-sm text-corporate-lightGray">Live OSINT gathering</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(systemStatus.keywordIntelligence)} text-sm font-medium`}>
              {systemStatus.keywordIntelligence}
            </Badge>
          </div>

          <div className="flex flex-col justify-between p-6 border border-corporate-border rounded-lg bg-corporate-darkTertiary hover:bg-corporate-darkSecondary transition-colors">
            <div className="flex items-center gap-4 mb-4">
              {getStatusIcon(systemStatus.counterNarrative)}
              <div>
                <h3 className="font-semibold text-lg text-white">Counter-Narrative</h3>
                <p className="text-sm text-corporate-lightGray">Strategic messaging</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(systemStatus.counterNarrative)} text-sm font-medium`}>
              {systemStatus.counterNarrative}
            </Badge>
          </div>

          <div className="flex flex-col justify-between p-6 border border-corporate-border rounded-lg bg-corporate-darkTertiary hover:bg-corporate-darkSecondary transition-colors">
            <div className="flex items-center gap-4 mb-4">
              {getStatusIcon(systemStatus.articleGeneration)}
              <div>
                <h3 className="font-semibold text-lg text-white">Article Generation</h3>
                <p className="text-sm text-corporate-lightGray">Content deployment</p>
              </div>
            </div>
            <Badge className={`${getStatusColor(systemStatus.articleGeneration)} text-sm font-medium`}>
              {systemStatus.articleGeneration}
            </Badge>
          </div>
        </div>

        {ciaPrecisionEnabled && (
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-400" />
              <span className="text-base font-semibold text-blue-300">CIA-Level Precision Active</span>
            </div>
            <p className="text-sm text-blue-200 mt-2 leading-relaxed">
              Advanced entity recognition eliminates false positives like "Lindsay Lohan" for "Simon Lindsay"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemStatusPanel;
