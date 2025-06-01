import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  Globe, 
  Key, 
  TestTube,
  CheckCircle,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';

const CustomTargetsManager = () => {
  const [targets, setTargets] = useState([
    {
      id: 1,
      name: 'Custom Blog Platform',
      url: 'https://my-blog.com',
      type: 'webhook',
      status: 'active',
      apiKey: '***********',
      lastTest: '2024-01-14 10:30:00',
      deploymentCount: 45,
      successRate: 96.8
    },
    {
      id: 2,
      name: 'WordPress Instance',
      url: 'https://wordpress-site.com',
      type: 'wordpress-api',
      status: 'warning',
      apiKey: '***********',
      lastTest: '2024-01-13 14:20:00',
      deploymentCount: 23,
      successRate: 89.2
    },
    {
      id: 3,
      name: 'Custom CMS',
      url: 'https://custom-cms.com/api',
      type: 'rest-api',
      status: 'error',
      apiKey: 'Invalid',
      lastTest: '2024-01-12 08:15:00',
      deploymentCount: 12,
      successRate: 45.1
    }
  ]);

  const [editingTarget, setEditingTarget] = useState<number | null>(null);
  const [newTarget, setNewTarget] = useState({
    name: '',
    url: '',
    type: 'webhook',
    apiKey: '',
    customHeaders: ''
  });

  const targetTypes = [
    { value: 'webhook', label: 'Webhook' },
    { value: 'rest-api', label: 'REST API' },
    { value: 'wordpress-api', label: 'WordPress API' },
    { value: 'ftp', label: 'FTP Upload' },
    { value: 'custom', label: 'Custom Script' }
  ];

  const addTarget = () => {
    if (!newTarget.name || !newTarget.url) return;
    
    const target = {
      id: Date.now(),
      ...newTarget,
      status: 'pending',
      lastTest: 'Never',
      deploymentCount: 0,
      successRate: 0
    };
    
    setTargets(prev => [...prev, target]);
    setNewTarget({
      name: '',
      url: '',
      type: 'webhook',
      apiKey: '',
      customHeaders: ''
    });
  };

  const deleteTarget = (id: number) => {
    setTargets(prev => prev.filter(target => target.id !== id));
  };

  const testConnection = async (id: number) => {
    // Simulate connection test
    setTargets(prev => prev.map(target => 
      target.id === id 
        ? { ...target, status: 'active', lastTest: new Date().toISOString() }
        : target
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add New Target */}
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
                placeholder="My Custom Platform"
                className="bg-corporate-darkSecondary border-corporate-border text-white"
              />
            </div>
            
            <div>
              <Label className="text-white">Type</Label>
              <Select value={newTarget.type} onValueChange={(value) => setNewTarget(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="bg-corporate-darkSecondary border-corporate-border text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {targetTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="targetUrl" className="text-white">URL/Endpoint</Label>
            <Input
              id="targetUrl"
              value={newTarget.url}
              onChange={(e) => setNewTarget(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://api.example.com/deploy"
              className="bg-corporate-darkSecondary border-corporate-border text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="targetApiKey" className="text-white">API Key/Token</Label>
            <Input
              id="targetApiKey"
              type="password"
              value={newTarget.apiKey}
              onChange={(e) => setNewTarget(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Your API key or authentication token"
              className="bg-corporate-darkSecondary border-corporate-border text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="customHeaders" className="text-white">Custom Headers (JSON)</Label>
            <Textarea
              id="customHeaders"
              value={newTarget.customHeaders}
              onChange={(e) => setNewTarget(prev => ({ ...prev, customHeaders: e.target.value }))}
              placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
              className="bg-corporate-darkSecondary border-corporate-border text-white"
              rows={3}
            />
          </div>
          
          <Button 
            onClick={addTarget}
            className="bg-corporate-accent text-black hover:bg-corporate-accentDark"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Target
          </Button>
        </CardContent>
      </Card>

      {/* Existing Targets */}
      <Card className="corporate-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Target className="h-5 w-5 text-corporate-accent" />
            Custom Deployment Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {targets.map(target => (
              <div key={target.id} className="p-4 bg-corporate-darkSecondary rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-corporate-accent" />
                    <div>
                      <h3 className="font-medium text-white">{target.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(target.status)}
                        <Badge className={getStatusColor(target.status)}>
                          {target.status}
                        </Badge>
                        <span className="text-xs text-corporate-lightGray">
                          {target.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testConnection(target.id)}
                    >
                      <TestTube className="h-4 w-4" />
                      Test
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingTarget(editingTarget === target.id ? null : target.id)}
                    >
                      {editingTarget === target.id ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteTarget(target.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <div className="text-corporate-lightGray">URL</div>
                    <div className="text-white font-medium truncate">{target.url}</div>
                  </div>
                  <div>
                    <div className="text-corporate-lightGray">Deployments</div>
                    <div className="text-white font-medium">{target.deploymentCount}</div>
                  </div>
                  <div>
                    <div className="text-corporate-lightGray">Success Rate</div>
                    <div className="text-white font-medium">{target.successRate}%</div>
                  </div>
                  <div>
                    <div className="text-corporate-lightGray">Last Test</div>
                    <div className="text-white font-medium">
                      {target.lastTest === 'Never' ? target.lastTest : new Date(target.lastTest).toLocaleString()}
                    </div>
                  </div>
                </div>

                {editingTarget === target.id && (
                  <div className="space-y-3 p-3 bg-corporate-darkPrimary rounded border border-corporate-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white text-xs">API Key</Label>
                        <Input 
                          type="password"
                          defaultValue={target.apiKey}
                          className="bg-corporate-darkSecondary border-corporate-border text-white text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-white text-xs">URL</Label>
                        <Input 
                          defaultValue={target.url}
                          className="bg-corporate-darkSecondary border-corporate-border text-white text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-corporate-accent text-black hover:bg-corporate-accentDark">
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomTargetsManager;
