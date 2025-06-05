
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Server, Activity, Zap, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { ServerHealth, ModelStatus, checkServerHealth, getModelStatuses, startServerMonitoring } from "@/services/localInference/serverMonitor";
import { toast } from "sonner";

const LocalServerMonitor = () => {
  const [serverHealth, setServerHealth] = useState<ServerHealth | null>(null);
  const [models, setModels] = useState<ModelStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    // Start continuous monitoring
    const stopMonitoring = startServerMonitoring((health) => {
      setServerHealth(health);
      setLastUpdate(new Date().toLocaleTimeString());
    });

    // Load initial model data
    loadModelData();

    return () => {
      clearInterval(stopMonitoring);
    };
  }, []);

  const loadModelData = async () => {
    try {
      const modelData = await getModelStatuses();
      setModels(modelData);
    } catch (error) {
      console.error('Failed to load model data:', error);
    }
  };

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      const health = await checkServerHealth();
      setServerHealth(health);
      await loadModelData();
      setLastUpdate(new Date().toLocaleTimeString());
      
      if (health.isOnline) {
        toast.success('Local AI server is healthy');
      } else {
        toast.error('Local AI server is offline or unreachable');
      }
    } catch (error) {
      toast.error('Health check failed');
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'text-green-600' : 'text-red-600';
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 500) return 'text-green-600';
    if (responseTime < 1000) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Server className="h-6 w-6 text-blue-600" />
            Local AI Server Monitor
          </h2>
          <p className="text-muted-foreground">Real-time monitoring of localhost:3001</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last update: {lastUpdate}
          </span>
          <Button onClick={handleManualCheck} disabled={isChecking} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Check Now
          </Button>
        </div>
      </div>

      {/* Server Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server Status</CardTitle>
            {serverHealth?.isOnline ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(serverHealth?.isOnline || false)}`}>
              {serverHealth?.isOnline ? 'ONLINE' : 'OFFLINE'}
            </div>
            <p className="text-xs text-muted-foreground">
              Port 3001 • {serverHealth?.modelsLoaded || 0} models loaded
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getResponseTimeColor(serverHealth?.responseTime || 0)}`}>
              {serverHealth?.responseTime || 0}ms
            </div>
            <p className="text-xs text-muted-foreground">
              {serverHealth?.responseTime && serverHealth.responseTime < 500 ? 'Excellent' : 
               serverHealth?.responseTime && serverHealth.responseTime < 1000 ? 'Good' : 'Slow'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serverHealth?.memoryUsage?.toFixed(1) || 0}%</div>
            <Progress value={serverHealth?.memoryUsage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{models.length}</div>
            <p className="text-xs text-muted-foreground">
              {models.filter(m => m.loaded).length} loaded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Endpoint Status */}
      <Card>
        <CardHeader>
          <CardTitle>AI Endpoints Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Badge className={serverHealth?.endpoints.threatClassify ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                {serverHealth?.endpoints.threatClassify ? '✅' : '❌'} Threat Classify
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={serverHealth?.endpoints.summarize ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                {serverHealth?.endpoints.summarize ? '✅' : '❌'} Summarize
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={serverHealth?.endpoints.legalDraft ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                {serverHealth?.endpoints.legalDraft ? '✅' : '❌'} Legal Draft
              </Badge>
            </div>
            <div className="text-center">
              <Badge className={serverHealth?.endpoints.memorySearch ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                {serverHealth?.endpoints.memorySearch ? '✅' : '❌'} Memory Search
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Models List */}
      <Card>
        <CardHeader>
          <CardTitle>Loaded AI Models</CardTitle>
        </CardHeader>
        <CardContent>
          {models.length === 0 ? (
            <div className="text-center py-8">
              <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">No models detected</p>
              <p className="text-sm text-muted-foreground">Make sure the local AI server is running</p>
            </div>
          ) : (
            <div className="space-y-4">
              {models.map((model, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <div>
                      <h4 className="font-medium">{model.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Size: {model.size} • {model.inferences} inferences
                      </p>
                    </div>
                  </div>
                  <Badge className={model.loaded ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>
                    {model.loaded ? 'LOADED' : 'UNLOADED'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalServerMonitor;
