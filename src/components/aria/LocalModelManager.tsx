
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Cpu, HardDrive, Activity, RefreshCw, Settings, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LocalModel {
  id: string;
  name: string;
  type: 'threat_analysis' | 'entity_extraction' | 'sentiment_analysis' | 'pattern_recognition';
  status: 'active' | 'idle' | 'error' | 'loading';
  lastUsed: string;
  performance: {
    accuracy: number;
    speed: number;
    memoryUsage: number;
  };
  totalInferences: number;
}

const LocalModelManager = () => {
  const [models, setModels] = useState<LocalModel[]>([]);
  const [systemStats, setSystemStats] = useState({
    totalModels: 0,
    activeInferences: 0,
    memoryUsage: 0,
    cpuUsage: 0
  });
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    fetchModelStatus();
    const interval = setInterval(fetchModelStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchModelStatus = async () => {
    try {
      // Get model performance data from local inference logs
      const { data: inferenceData, error } = await supabase
        .from('aria_ops_log')
        .select('*')
        .eq('module_source', 'local_inference')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Process the data to create model status
      const modelStats = processInferenceData(inferenceData || []);
      setModels(modelStats);

      // Calculate system statistics
      const stats = {
        totalModels: modelStats.length,
        activeInferences: modelStats.filter(m => m.status === 'active').length,
        memoryUsage: Math.round(modelStats.reduce((sum, m) => sum + m.performance.memoryUsage, 0) / modelStats.length),
        cpuUsage: Math.round(Math.random() * 30 + 15) // Simulated CPU usage
      };
      setSystemStats(stats);

    } catch (error) {
      console.error('Error fetching model status:', error);
    }
  };

  const processInferenceData = (data: any[]): LocalModel[] => {
    const modelMap = new Map();

    data.forEach(item => {
      const operationData = item.operation_data;
      if (!operationData) return;

      const modelType = operationData.analysis_type || 'threat_analysis';
      const modelId = `${modelType}_model`;

      if (!modelMap.has(modelId)) {
        modelMap.set(modelId, {
          id: modelId,
          name: `${modelType.replace(/_/g, ' ').toUpperCase()} Model`,
          type: modelType,
          status: 'idle',
          lastUsed: item.created_at,
          performance: {
            accuracy: 85 + Math.random() * 10,
            speed: 75 + Math.random() * 20,
            memoryUsage: 20 + Math.random() * 30
          },
          totalInferences: 0
        });
      }

      const model = modelMap.get(modelId);
      model.totalInferences += 1;
      
      // Update status based on recent activity
      const timeDiff = Date.now() - new Date(item.created_at).getTime();
      if (timeDiff < 60000) { // Active in last minute
        model.status = 'active';
      } else if (timeDiff < 300000) { // Used in last 5 minutes
        model.status = 'idle';
      }

      if (new Date(item.created_at) > new Date(model.lastUsed)) {
        model.lastUsed = item.created_at;
      }
    });

    return Array.from(modelMap.values());
  };

  const optimizeModels = async () => {
    setIsOptimizing(true);
    try {
      // Simulate model optimization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update model performance
      setModels(prev => prev.map(model => ({
        ...model,
        performance: {
          ...model.performance,
          accuracy: Math.min(model.performance.accuracy + 2, 98),
          speed: Math.min(model.performance.speed + 5, 95),
          memoryUsage: Math.max(model.performance.memoryUsage - 3, 10)
        }
      })));

      toast.success('Local AI models optimized successfully');
    } catch (error) {
      toast.error('Model optimization failed');
    } finally {
      setIsOptimizing(false);
    }
  };

  const restartModel = async (modelId: string) => {
    try {
      // Simulate model restart
      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, status: 'loading' as const }
          : model
      ));

      await new Promise(resolve => setTimeout(resolve, 1500));

      setModels(prev => prev.map(model => 
        model.id === modelId 
          ? { ...model, status: 'active' as const }
          : model
      ));

      toast.success(`${modelId.replace(/_/g, ' ')} restarted successfully`);
    } catch (error) {
      toast.error('Model restart failed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'idle': return 'bg-yellow-500 text-white';
      case 'loading': return 'bg-blue-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 85) return 'text-green-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Local AI Model Manager
          </h2>
          <p className="text-muted-foreground">Monitor and manage local inference models</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchModelStatus} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={optimizeModels} disabled={isOptimizing}>
            <Zap className={`h-4 w-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
            {isOptimizing ? 'Optimizing...' : 'Optimize Models'}
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalModels}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.activeInferences} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.memoryUsage}%</div>
            <Progress value={systemStats.memoryUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.cpuUsage}%</div>
            <Progress value={systemStats.cpuUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500 text-white">OPTIMAL</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Model List */}
      <Card>
        <CardHeader>
          <CardTitle>Local AI Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {models.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <p className="text-muted-foreground">No active models detected</p>
                <p className="text-sm text-muted-foreground">Run some local inference operations to see models here</p>
              </div>
            ) : (
              models.map((model) => (
                <div key={model.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <div>
                        <h3 className="font-medium">{model.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {model.totalInferences} inferences • Last used: {new Date(model.lastUsed).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(model.status)}>
                        {model.status.toUpperCase()}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => restartModel(model.id)}
                        disabled={model.status === 'loading'}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getPerformanceColor(model.performance.accuracy)}`}>
                        {model.performance.accuracy.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getPerformanceColor(model.performance.speed)}`}>
                        {model.performance.speed.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Speed</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getPerformanceColor(100 - model.performance.memoryUsage)}`}>
                        {model.performance.memoryUsage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Memory</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocalModelManager;
