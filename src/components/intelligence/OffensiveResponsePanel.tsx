
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Shield, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OffensiveResponsePanelProps {
  selectedThreats?: string[];
  threatId?: string;
}

const OffensiveResponsePanel = ({ selectedThreats = [], threatId }: OffensiveResponsePanelProps) => {
  const navigate = useNavigate();

  const capabilities = [
    {
      title: 'Counter-Narrative Deployment',
      description: 'Deploy strategic counter-narratives to neutralize harmful content',
      icon: Shield,
      color: 'bg-blue-100 text-blue-800',
      count: 0
    },
    {
      title: 'Diversion Campaigns',
      description: 'Create positive content campaigns to redirect attention',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-800',
      count: 0
    },
    {
      title: 'Actor Disruption',
      description: 'Report and disrupt malicious threat actors',
      icon: Target,
      color: 'bg-red-100 text-red-800',
      count: 0
    },
    {
      title: 'Influence Simulation',
      description: 'Model response outcomes before deployment',
      icon: AlertTriangle,
      color: 'bg-yellow-100 text-yellow-800',
      count: 0
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Offensive Response Capabilities
            </CardTitle>
            <CardDescription>
              Advanced counter-operations and threat neutralization tools
            </CardDescription>
          </div>
          
          <Button 
            onClick={() => navigate('/intelligence/offensive-operations')}
            className="bg-red-600 hover:bg-red-700"
          >
            <Target className="h-4 w-4 mr-2" />
            Open Operations Center
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {capabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <h4 className="font-medium">{capability.title}</h4>
                  </div>
                  <Badge className={capability.color}>
                    {capability.count}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{capability.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Compliance Notice</h4>
              <p className="text-sm text-yellow-700 mt-1">
                All offensive operations are subject to ethical guidelines, legal compliance, and platform terms of service. 
                Actions are logged for transparency and audit purposes.
              </p>
            </div>
          </div>
        </div>

        {(selectedThreats.length > 0 || threatId) && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Ready for deployment:</strong> {selectedThreats.length || 1} threat(s) selected for offensive response operations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OffensiveResponsePanel;
