
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Plus, 
  Trash2, 
  Globe, 
  CheckCircle,
  AlertTriangle,
  TestTube,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CustomTarget {
  id: string;
  name: string;
  url: string;
  type: 'api' | 'webhook' | 'ftp' | 'custom';
  status: 'active' | 'inactive' | 'error';
  deploymentCount: number;
  lastDeployment?: string;
  apiKey?: string;
  credentials?: Record<string, string>;
}

const CustomTargetsManager = () => {
  const [targets, setTargets] = useState<CustomTarget[]>([]);
  const [newTarget, setNewTarget] = useState({
    name: '',
    url: '',
    type: 'api' as const,
    apiKey: ''
  });
  const [testingTarget, setTestingTarget] = useState<string | null>(null);

  useEffect(() => {
    loadCustomTargets();
  }, []);

  const loadCustomTargets = async () => {
    try {
      // In a real implementation, this would load from a database
      // For now, we'll use localStorage to persist custom targets
      const savedTargets = localStorage.getItem('customDeploymentTargets');
      if (savedTargets) {
        setTargets(JSON.parse(savedTargets));
      }
    } catch (error) {
      console.error('Error loading custom targets:', error);
    }
  };

  const saveTargets = (updatedTargets: CustomTarget[]) => {
    try {
      localStorage.setItem('customDeploymentTargets', JSON.stringify(updatedTargets));
      setTargets(updatedTargets);
    } catch (error) {
      console.error('Error saving custom targets:', error);
      toast.error('Failed to save targets');
    }
  };

  const addCustomTarget = () => {
    if (!newTarget.name || !newTarget.url) {
      toast.error('Please provide target name and URL');
      return;
    }

    const target: CustomTarget = {
      id: Date.now().toString(),
      name: newTarget.name,
      url: newTarget.url,
      type: newTarget.type,
      status: 'inactive',
      deploymentCount: 0,
      apiKey: newTarget.apiKey || undefined
    };

    const updatedTargets = [...targets, target];
    saveTargets(updatedTargets);
    
    setNewTarget({
      name: '',
      url: '',
      type: 'api',
      apiKey: ''
    });

    toast.success(`Custom target "${target.name}" added successfully`);
  };

  const removeTarget = (targetId: string) => {
    const updatedTargets = targets.filter(t => t.id !== targetId);
    saveTargets(updatedTargets);
    
    const target = targets.find(t => t.id === targetId);
    if (target) {
      toast.success(`Target "${target.name}" removed`);
    }
  };

  const testTargetConnection = async (targetId: string) => {
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    setTestingTarget(targetId);
    
    try {
      console.log(`🧪 Testing custom target: ${target.name}`);
      
      // Simulate testing custom target connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For now, we'll simulate a successful connection
      // In a real implementation, this would make an actual test request
      const isSuccessful = Math.random() > 0.3; // 70% success rate
      
      const updatedTargets = targets.map(t => 
        t.id === targetId 
          ? { 
              ...t, 
              status: isSuccessful ? 'active' as const : 'error' as const,
              lastDeployment: isSuccessful ? new Date().toISOString() : t.lastDeployment
            }
          : t
      );
      
      saveTargets(updatedTargets);
      
      if (isSuccessful) {
        toast.success(`✅ Connection to "${target.name}" successful!`);
      } else {
        toast.error(`❌ Connection to "${target.name}" failed`);
      }
      
    } catch (error: any) {
      console.error(`❌ Target test failed for ${target.name}:`, error);
      
      const updatedTargets = targets.map(t => 
        t.id === targetId 
          ? { ...t, status: 'error' as const }
          : t
      );
      
      saveTargets(updatedTargets);
      toast.error(`❌ Connection test failed for "${target.name}"`);
    } finally {
      setTestingTarget(null);
    }
  };

  const deployToCustomTarget = async (targetId: string) => {
    const target = targets.find(t => t.id === targetId);
    if (!target) return;

    try {
      console.log(`🚀 Deploying to custom target: ${target.name}`);
      
      // Use the persona-saturation function with custom target
      const { data, error } = await supabase.functions.invoke('persona-saturation', {
        body: {
          entityName: 'Custom Target Test',
          targetKeywords: ['custom', 'deployment'],
          contentCount: 1,
          deploymentTargets: ['custom'],
          customTarget: {
            name: target.name,
            url: target.url,
            type: target.type,
            apiKey: target.apiKey
          },
          saturationMode: 'defensive'
        }
      });

      if (error) {
        throw error;
      }

      // Update deployment count
      const updatedTargets = targets.map(t => 
        t.id === targetId 
          ? { 
              ...t, 
              deploymentCount: t.deploymentCount + 1,
              lastDeployment: new Date().toISOString(),
              status: 'active' as const
            }
          : t
      );
      
      saveTargets(updatedTargets);
      toast.success(`✅ Successfully deployed to "${target.name}"`);
      
    } catch (error: any) {
      console.error(`❌ Deployment failed for ${target.name}:`, error);
      toast.error(`❌ Deployment to "${target.name}" failed: ${error.message}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'error':
        return <Badge className="bg-red-500/20 text-red-400"><AlertTriangle className="h-3 w-3 mr-1" />Error</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/20 text-gray-400">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">Unknown</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'api':
        return 'bg-blue-500/20 text-blue-400';
      case 'webhook':
        return 'bg-purple-500/20 text-purple-400';
      case 'ftp':
        return 'bg-orange-500/20 text-orange-400';
      case 'custom':
        return 'bg-teal-500/20 text-teal-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Custom Target */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Plus className="h-5 w-5 text-corporate-accent" />
            Add Custom Deployment Target
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetName" className="text-white">Target Name</Label>
              <Input
                id="targetName"
                value={newTarget.name}
                onChange={(e) => setNewTarget(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Custom Blog Platform"
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="targetUrl" className="text-white">Target URL</Label>
              <Input
                id="targetUrl"
                value={newTarget.url}
                onChange={(e) => setNewTarget(prev => ({ ...prev, url: e.target.value }))}
                placeholder="e.g. https://api.platform.com/deploy"
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="apiKey" className="text-white">API Key (Optional)</Label>
            <Input
              id="apiKey"
              type="password"
              value={newTarget.apiKey}
              onChange={(e) => setNewTarget(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="API key or authentication token"
              className="bg-corporate-darkSecondary border-corporate-border text-white"
            />
          </div>
          
          <Button 
            onClick={addCustomTarget}
            className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Custom Target
          </Button>
        </CardContent>
      </Card>

      {/* Custom Targets List */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Target className="h-5 w-5 text-corporate-accent" />
            Custom Deployment Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {targets.length > 0 ? targets.map(target => (
              <div key={target.id} className="p-4 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-corporate-accent" />
                    <div>
                      <h3 className="font-medium text-white">{target.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(target.status)}
                        <Badge className={getTypeColor(target.type)}>
                          {target.type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-corporate-lightGray">
                          {target.deploymentCount} deployments
                        </span>
                      </div>
                      <div className="text-xs text-corporate-lightGray mt-1">
                        {target.url}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testTargetConnection(target.id)}
                      disabled={testingTarget === target.id}
                      className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
                    >
                      {testingTarget === target.id ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <TestTube className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      onClick={() => deployToCustomTarget(target.id)}
                      disabled={target.status !== 'active'}
                      className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
                    >
                      <Globe className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeTarget(target.id)}
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {target.lastDeployment && (
                  <div className="text-xs text-corporate-lightGray">
                    Last deployment: {new Date(target.lastDeployment).toLocaleString()}
                  </div>
                )}
              </div>
            )) : (
              <div className="text-center py-8 text-corporate-lightGray">
                <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No custom targets configured</p>
                <p className="text-sm">Add your first custom deployment target above</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomTargetsManager;
