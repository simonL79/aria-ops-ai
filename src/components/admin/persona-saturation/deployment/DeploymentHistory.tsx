
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import { DeploymentSchedulerService } from '@/services/deploymentScheduler';
import { supabase } from '@/integrations/supabase/client';

interface DeploymentExecution {
  id: string;
  scheduleName: string;
  executedAt: string;
  status: 'success' | 'failed' | 'partial';
  deploymentsSuccessful: number;
  totalAttempted: number;
  platforms: string[];
  urls: string[];
  errorMessage?: string;
}

const DeploymentHistory = () => {
  const [executions, setExecutions] = useState<DeploymentExecution[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDeploymentHistory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('action', 'scheduled_deployment_executed')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Failed to load deployment history:', error);
        return;
      }

      const parsedExecutions = data?.map(log => {
        const details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details;
        return {
          id: log.id,
          scheduleName: details.scheduleName || 'Unknown Schedule',
          executedAt: log.created_at,
          status: details.status || 'success',
          deploymentsSuccessful: details.deploymentsSuccessful || 0,
          totalAttempted: details.totalAttempted || 0,
          platforms: details.platforms || [],
          urls: details.urls || [],
          errorMessage: details.errorMessage
        };
      }) || [];

      setExecutions(parsedExecutions);
    } catch (error) {
      console.error('Error loading deployment history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeploymentHistory();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400',
      partial: 'bg-yellow-500/20 text-yellow-400'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-500/20 text-gray-400'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="corporate-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 corporate-heading">
            <Clock className="h-5 w-5 text-corporate-accent" />
            Deployment History
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={loadDeploymentHistory}
            disabled={isLoading}
            className="border-corporate-accent text-corporate-accent hover:bg-corporate-accent hover:text-black"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {executions.length === 0 ? (
          <div className="text-center py-8 text-corporate-lightGray">
            <Clock className="h-12 w-12 mx-auto mb-4 text-corporate-accent opacity-50" />
            <p>No deployment history found</p>
            <p className="text-sm">Scheduled deployments will appear here once executed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {executions.map((execution) => (
              <div key={execution.id} className="p-4 bg-corporate-darkSecondary rounded-lg border border-corporate-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(execution.status)}
                    <div>
                      <h3 className="font-medium text-white">{execution.scheduleName}</h3>
                      <p className="text-sm text-corporate-lightGray">
                        {new Date(execution.executedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(execution.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="text-sm">
                    <span className="text-corporate-lightGray">Success Rate:</span>
                    <span className="ml-2 text-white font-medium">
                      {execution.deploymentsSuccessful}/{execution.totalAttempted}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-corporate-lightGray">Platforms:</span>
                    <span className="ml-2 text-white font-medium">
                      {execution.platforms.join(', ')}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-corporate-lightGray">URLs Generated:</span>
                    <span className="ml-2 text-white font-medium">
                      {execution.urls.length}
                    </span>
                  </div>
                </div>

                {execution.errorMessage && (
                  <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm">
                    {execution.errorMessage}
                  </div>
                )}

                {execution.urls.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-corporate-lightGray mb-2">
                      Generated URLs ({execution.urls.length}):
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {execution.urls.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <ExternalLink className="h-3 w-3 text-corporate-accent flex-shrink-0" />
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-corporate-accent hover:text-white truncate"
                          >
                            {url}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeploymentHistory;
