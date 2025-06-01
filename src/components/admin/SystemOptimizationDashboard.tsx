
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Shield,
  RefreshCw,
  Gauge
} from 'lucide-react';
import { SystemOptimizer, type OptimizationResult, type SystemHealthReport } from '@/services/systemOptimizer';
import { toast } from 'sonner';

const SystemOptimizationDashboard = () => {
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [healthReport, setHealthReport] = useState<SystemHealthReport | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isRunningHealthCheck, setIsRunningHealthCheck] = useState(false);

  useEffect(() => {
    // Run initial health check on load
    runHealthCheck();
  }, []);

  const runOptimization = async () => {
    setIsOptimizing(true);
    try {
      const result = await SystemOptimizer.runComprehensiveOptimization();
      setOptimizationResult(result);
      
      if (result.success) {
        toast.success(`System optimized to ${result.optimizationLevel}%`);
        // Run health check after optimization
        await runHealthCheck();
      } else {
        toast.warning(`Optimization completed with issues (${result.optimizationLevel}%)`);
      }
    } catch (error) {
      toast.error('Optimization failed');
      console.error('Optimization error:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const runHealthCheck = async () => {
    setIsRunningHealthCheck(true);
    try {
      const report = await SystemOptimizer.runComprehensiveHealthCheck();
      setHealthReport(report);
      
      if (report.overall_status === 'optimal') {
        toast.success(`System health: ${report.optimization_percentage}% optimal`);
      } else if (report.overall_status === 'critical') {
        toast.error(`Critical system issues detected`);
      }
    } catch (error) {
      toast.error('Health check failed');
      console.error('Health check error:', error);
    } finally {
      setIsRunningHealthCheck(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'good':
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
      case 'down':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal':
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good':
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
      case 'down':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Gauge className="h-6 w-6 text-corporate-accent" />
            A.R.I.A™ System Optimization
          </h2>
          <p className="text-muted-foreground">
            Comprehensive system health monitoring and optimization
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={runHealthCheck}
            disabled={isRunningHealthCheck}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunningHealthCheck ? 'animate-spin' : ''}`} />
            Health Check
          </Button>
          
          <Button
            onClick={runOptimization}
            disabled={isOptimizing}
            className="bg-corporate-accent hover:bg-corporate-accent/90"
          >
            <Zap className={`h-4 w-4 mr-2 ${isOptimizing ? 'animate-pulse' : ''}`} />
            {isOptimizing ? 'Optimizing...' : 'Optimize System'}
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      {healthReport && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm corporate-heading">Overall Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {getStatusIcon(healthReport.overall_status)}
                <Badge className={getStatusColor(healthReport.overall_status)}>
                  {healthReport.overall_status.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm corporate-heading">Optimization Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{healthReport.optimization_percentage}%</div>
              <Progress value={healthReport.optimization_percentage} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm corporate-heading">Component Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {healthReport.component_health.filter(c => c.status === 'healthy').length}/
                {healthReport.component_health.length}
              </div>
              <p className="text-xs text-corporate-lightGray">Healthy Components</p>
            </CardContent>
          </Card>

          <Card className="corporate-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm corporate-heading">Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {healthReport.performance_metrics.database_response_time}ms
              </div>
              <p className="text-xs text-corporate-lightGray">Database</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Component Status Details */}
      {healthReport && (
        <Card className="corporate-card">
          <CardHeader>
            <CardTitle className="corporate-heading flex items-center gap-2">
              <Activity className="h-5 w-5 text-corporate-accent" />
              Component Health Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {healthReport.component_health.map((component, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded border border-corporate-darkSecondary">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(component.status)}
                    <div>
                      <h4 className="font-medium text-white capitalize">
                        {component.component.replace(/_/g, ' ')}
                      </h4>
                      <p className="text-sm text-corporate-lightGray">{component.details}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {component.response_time && (
                      <span className="text-xs text-corporate-lightGray">
                        {component.response_time}ms
                      </span>
                    )}
                    <Badge className={getStatusColor(component.status)}>
                      {component.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Optimization Results */}
      {optimizationResult && (
        <Card className="corporate-card">
          <CardHeader>
            <CardTitle className="corporate-heading flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-corporate-accent" />
              Optimization Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-corporate-lightGray">Optimization Level:</span>
                <div className="flex items-center gap-2">
                  <Progress value={optimizationResult.optimizationLevel} className="w-32" />
                  <span className="text-white font-bold">{optimizationResult.optimizationLevel}%</span>
                </div>
              </div>

              {optimizationResult.fixes_applied.length > 0 && (
                <div>
                  <h4 className="text-green-400 font-medium mb-2">✅ Fixes Applied:</h4>
                  <ul className="space-y-1">
                    {optimizationResult.fixes_applied.map((fix, index) => (
                      <li key={index} className="text-sm text-corporate-lightGray ml-4">• {fix}</li>
                    ))}
                  </ul>
                </div>
              )}

              {optimizationResult.performance_improvements.length > 0 && (
                <div>
                  <h4 className="text-blue-400 font-medium mb-2">🚀 Performance Improvements:</h4>
                  <ul className="space-y-1">
                    {optimizationResult.performance_improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-corporate-lightGray ml-4">• {improvement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {optimizationResult.warnings.length > 0 && (
                <div>
                  <h4 className="text-yellow-400 font-medium mb-2">⚠️ Warnings:</h4>
                  <ul className="space-y-1">
                    {optimizationResult.warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-corporate-lightGray ml-4">• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {healthReport && healthReport.recommendations.length > 0 && (
        <Card className="corporate-card">
          <CardHeader>
            <CardTitle className="corporate-heading flex items-center gap-2">
              <Shield className="h-5 w-5 text-corporate-accent" />
              System Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {healthReport.recommendations.map((recommendation, index) => (
                <Alert key={index}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{recommendation}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemOptimizationDashboard;
