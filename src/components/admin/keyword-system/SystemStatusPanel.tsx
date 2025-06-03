
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
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'TESTING':
        return <Target className="h-5 w-5 text-blue-600 animate-pulse" />;
      case 'FAILED':
      case 'ERROR':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'READY':
        return <Zap className="h-5 w-5 text-purple-600" />;
      case 'STANDBY':
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TESTING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'READY':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'FAILED':
      case 'ERROR':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'STANDBY':
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          A.R.I.A vX™ System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid grid-cols-1 md:grid-cols-${ciaPrecisionEnabled ? '4' : '3'} gap-4`}>
          {ciaPrecisionEnabled && (
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(systemStatus.ciaPrecision || 'STANDBY')}
                <div>
                  <h3 className="font-medium">CIA Precision Engine</h3>
                  <p className="text-sm text-muted-foreground">Entity disambiguation</p>
                </div>
              </div>
              <Badge className={getStatusColor(systemStatus.ciaPrecision || 'STANDBY')}>
                {systemStatus.ciaPrecision || 'STANDBY'}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(systemStatus.keywordIntelligence)}
              <div>
                <h3 className="font-medium">Keyword Intelligence</h3>
                <p className="text-sm text-muted-foreground">Live OSINT gathering</p>
              </div>
            </div>
            <Badge className={getStatusColor(systemStatus.keywordIntelligence)}>
              {systemStatus.keywordIntelligence}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(systemStatus.counterNarrative)}
              <div>
                <h3 className="font-medium">Counter-Narrative</h3>
                <p className="text-sm text-muted-foreground">Strategic messaging</p>
              </div>
            </div>
            <Badge className={getStatusColor(systemStatus.counterNarrative)}>
              {systemStatus.counterNarrative}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(systemStatus.articleGeneration)}
              <div>
                <h3 className="font-medium">Article Generation</h3>
                <p className="text-sm text-muted-foreground">Content deployment</p>
              </div>
            </div>
            <Badge className={getStatusColor(systemStatus.articleGeneration)}>
              {systemStatus.articleGeneration}
            </Badge>
          </div>
        </div>

        {ciaPrecisionEnabled && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">CIA-Level Precision Active</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Advanced entity recognition eliminates false positives like "Lindsay Lohan" for "Simon Lindsay"
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemStatusPanel;
