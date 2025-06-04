
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Zap, FileText, Shield, Target, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

interface QuickCommandConsoleProps {
  selectedEntity: string;
  onClose: () => void;
  serviceStatus: any;
}

const QuickCommandConsole: React.FC<QuickCommandConsoleProps> = ({
  selectedEntity,
  onClose,
  serviceStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState<string | null>(null);

  const quickActions = [
    {
      id: 'scan-now',
      label: 'Scan Now',
      icon: Search,
      description: 'Instant entity scan across all platforms',
      action: 'scan'
    },
    {
      id: 'generate-article',
      label: 'Generate Article',
      icon: FileText,
      description: 'AI-powered content generation',
      action: 'generate'
    },
    {
      id: 'run-forecast',
      label: 'Run Forecast',
      icon: AlertTriangle,
      description: 'Threat prediction and viral risk audit',
      action: 'forecast'
    },
    {
      id: 'deploy-legal',
      label: 'Deploy Legal Notice',
      icon: Shield,
      description: 'Generate DMCA, cease & desist, or press doc',
      action: 'legal'
    },
    {
      id: 'view-strategy',
      label: 'Strategy Snapshot',
      icon: Target,
      description: 'View pattern memory and effectiveness',
      action: 'strategy'
    },
    {
      id: 'resaturation-push',
      label: 'Resaturation Push',
      icon: Zap,
      description: 'Deploy counter-narrative saturation',
      action: 'resaturate'
    }
  ];

  const executeQuickAction = async (action: string, actionId: string) => {
    if (!selectedEntity) {
      toast.error('Please select an entity first');
      return;
    }

    setIsExecuting(actionId);
    
    try {
      switch (action) {
        case 'scan':
          toast.info(`🔍 Initiating live scan for ${selectedEntity}...`);
          // Trigger scan via service orchestrator
          break;
        
        case 'generate':
          toast.info(`📝 Generating content for ${selectedEntity}...`);
          // Trigger article generation
          break;
        
        case 'forecast':
          toast.info(`🔮 Running threat forecast for ${selectedEntity}...`);
          // Trigger prediction engine
          break;
        
        case 'legal':
          toast.info(`⚖️ Preparing legal documents for ${selectedEntity}...`);
          // Trigger legal document generator
          break;
        
        case 'strategy':
          toast.info(`🧠 Loading strategy memory for ${selectedEntity}...`);
          // Load strategy snapshot
          break;
        
        case 'resaturate':
          toast.info(`💥 Deploying resaturation push for ${selectedEntity}...`);
          // Trigger resaturation
          break;
      }
      
      // Simulate execution time
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`✅ ${actionId} completed successfully`);
      
    } catch (error) {
      toast.error(`❌ ${actionId} failed to execute`);
      console.error(`Quick action ${actionId} failed:`, error);
    } finally {
      setIsExecuting(null);
    }
  };

  return (
    <Card className="bg-corporate-darkSecondary border-corporate-border mx-6 mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-corporate-accent" />
            Quick Command Console
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-corporate-lightGray hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Entity Search */}
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search entity or quick command..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-corporate-dark border-corporate-border text-white"
          />
          {selectedEntity && (
            <Badge className="bg-corporate-accent text-black">
              Target: {selectedEntity}
            </Badge>
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const isExecuting = isExecuting === action.id;
            
            return (
              <Button
                key={action.id}
                onClick={() => executeQuickAction(action.action, action.id)}
                disabled={isExecuting || !selectedEntity}
                className="flex flex-col items-center gap-2 h-20 bg-corporate-dark hover:bg-corporate-accent hover:text-black border border-corporate-border"
              >
                <Icon className={`h-5 w-5 ${isExecuting ? 'animate-spin' : ''}`} />
                <span className="text-xs">{action.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Service Status Indicators */}
        <div className="flex items-center gap-2 pt-2 border-t border-corporate-border">
          <span className="text-sm text-corporate-lightGray">Services:</span>
          {Object.entries(serviceStatus).map(([service, status]) => (
            <Badge
              key={service}
              className={`text-xs ${
                status === 'active' 
                  ? 'bg-green-500/20 text-green-400 border-green-500/50'
                  : status === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                  : 'bg-red-500/20 text-red-400 border-red-500/50'
              }`}
            >
              {service.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickCommandConsole;
