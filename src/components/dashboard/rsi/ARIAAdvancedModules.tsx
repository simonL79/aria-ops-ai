
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  Brain, 
  Eye, 
  Zap,
  Lock,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import ARIASecurityPanel from './ARIASecurityPanel';
import { logModuleUsage } from '@/services/aria/securityService';
import { toast } from 'sonner';

const ARIAAdvancedModules = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const modules = [
    {
      id: 'rsi',
      name: 'RSI™ Counter-Narrative Engine',
      description: 'Reputation Surface Inversion - Never-Stop Autonomous Protection',
      icon: Shield,
      status: 'active',
      classification: 'confidential',
      features: [
        'Auto-triggered threat response',
        'Narrative surface manipulation',
        'Real-time counter-deployment',
        'Autonomous protection protocols'
      ]
    },
    {
      id: 'eidetic',
      name: 'EIDETIC™ Digital Memory Firewall',
      description: 'Persistent memory management and decay control',
      icon: Brain,
      status: 'active',
      classification: 'confidential',
      features: [
        'Memory decay algorithms',
        'Digital footprint management',
        'Persistence scoring',
        'Automated memory routing'
      ]
    },
    {
      id: 'graveyard',
      name: 'GRAVEYARD™ Legacy Signal Suppressor',
      description: 'Historical content suppression and rank manipulation',
      icon: Eye,
      status: 'development',
      classification: 'restricted',
      features: [
        'Legacy content identification',
        'Search rank suppression',
        'Historical signal decay',
        'Content burial protocols'
      ]
    },
    {
      id: 'pulse',
      name: 'Threat Pulse Prospect Engine',
      description: 'Advanced threat detection and prospect intelligence',
      icon: Zap,
      status: 'active',
      classification: 'confidential',
      features: [
        'Real-time threat detection',
        'Prospect entity tracking',
        'Risk score calculation',
        'Automated escalation triggers'
      ]
    }
  ];

  const handleModuleAccess = async (moduleName: string) => {
    setActiveModule(moduleName);
    await logModuleUsage(moduleName, 'module_accessed', 'User accessed module from advanced panel');
    toast.success(`Accessing ${moduleName}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'development': return 'text-yellow-600 bg-yellow-100';
      case 'maintenance': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'confidential': return 'text-red-600 bg-red-100';
      case 'restricted': return 'text-orange-600 bg-orange-100';
      case 'internal': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            A.R.I.A™ Advanced Modules & Security
          </h3>
          <p className="text-sm text-muted-foreground">
            Access protected modules and monitor security protocols
          </p>
        </div>
      </div>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="modules">Protected Modules</TabsTrigger>
          <TabsTrigger value="security">Security Control</TabsTrigger>
        </TabsList>

        <TabsContent value="modules">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Card key={module.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg">{module.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {module.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(module.status)}>
                          {module.status.toUpperCase()}
                        </Badge>
                        <Badge className={getClassificationColor(module.classification)}>
                          <Lock className="h-3 w-3 mr-1" />
                          {module.classification.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Core Features:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {module.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleModuleAccess(module.name)}
                          disabled={module.status !== 'active'}
                          className="flex-1"
                        >
                          {module.status === 'active' ? 'Access Module' : 'Under Development'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => logModuleUsage(module.name, 'status_check', 'User checked module status')}
                        >
                          <Activity className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {activeModule && (
            <Card className="mt-6 border-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Module Access Granted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border border-green-200 rounded p-4">
                  <p className="text-green-800">
                    <strong>{activeModule}</strong> access has been logged and granted. 
                    Module functionality is now available through the respective dashboard tabs.
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    All access attempts are monitored and logged for security compliance.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="security">
          <ARIASecurityPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ARIAAdvancedModules;
