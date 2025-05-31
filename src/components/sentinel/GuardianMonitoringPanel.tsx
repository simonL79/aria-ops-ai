
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Shield, Activity, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SentinelService } from '@/services/sentinel/sentinelService';
import type { SentinelClient, SentinelGuardianRegistry } from '@/types/sentinel';

interface GuardianMonitoringPanelProps {
  client: SentinelClient;
}

export const GuardianMonitoringPanel = ({ client }: GuardianMonitoringPanelProps) => {
  const [guardianStatus, setGuardianStatus] = useState<SentinelGuardianRegistry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabling, setIsEnabling] = useState(false);

  useEffect(() => {
    loadGuardianStatus();
  }, [client.id]);

  const loadGuardianStatus = async () => {
    setIsLoading(true);
    try {
      const statusData = await SentinelService.getGuardianStatus(client.id);
      setGuardianStatus(statusData);
    } catch (error) {
      console.error('Error loading guardian status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const enableGuardianMode = async () => {
    setIsEnabling(true);
    try {
      await SentinelService.enableGuardianMode(client.id, client.entity_names);
      await loadGuardianStatus();
      toast.success('Guardian monitoring activated');
    } catch (error) {
      console.error('Error enabling guardian mode:', error);
      toast.error('Failed to enable guardian monitoring');
    } finally {
      setIsEnabling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'paused': return 'bg-yellow-500 text-white';
      case 'maintenance': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatLastScan = (lastScan: string) => {
    const diff = Date.now() - new Date(lastScan).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'just now';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading guardian monitoring status...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Guardian Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Guardian Protection Status
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={client.guardian_mode_enabled ? 'default' : 'outline'}>
                {client.guardian_mode_enabled ? 'ACTIVE' : 'INACTIVE'}
              </Badge>
              {!client.guardian_mode_enabled && (
                <Button
                  onClick={enableGuardianMode}
                  disabled={isEnabling}
                  variant="default"
                >
                  {isEnabling ? 'Activating...' : 'Activate Guardian'}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-900">{guardianStatus.length}</div>
              <div className="text-sm text-blue-700">Monitored Entities</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-900">
                {guardianStatus.reduce((sum, g) => sum + g.threats_resolved, 0)}
              </div>
              <div className="text-sm text-green-700">Threats Resolved</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-900">
                {guardianStatus.reduce((sum, g) => sum + g.total_threats_detected, 0)}
              </div>
              <div className="text-sm text-orange-700">Total Threats Detected</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-900">
                {guardianStatus.filter(g => g.status === 'active').length}
              </div>
              <div className="text-sm text-purple-700">Active Monitors</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entity Monitoring Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Entity Monitoring Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {guardianStatus.length > 0 ? (
            <div className="space-y-4">
              {guardianStatus.map((guardian) => (
                <div key={guardian.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{guardian.entity_name}</h3>
                      <Badge className={getStatusColor(guardian.status)}>
                        {guardian.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Auto-Response</span>
                      <Switch checked={guardian.auto_response_enabled} disabled />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <span className="text-sm text-gray-600">Last Scan</span>
                      <p className="text-sm font-medium">{formatLastScan(guardian.last_scan)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Scan Frequency</span>
                      <p className="text-sm font-medium">{guardian.scan_frequency_minutes}m</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Threats Detected</span>
                      <p className="text-sm font-medium">{guardian.total_threats_detected}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Resolved</span>
                      <p className="text-sm font-medium text-green-600">{guardian.threats_resolved}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-gray-600">Monitoring Keywords</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {guardian.monitoring_keywords.slice(0, 5).map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                      {guardian.monitoring_keywords.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{guardian.monitoring_keywords.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground mb-4">Guardian monitoring not yet activated</p>
              {!client.guardian_mode_enabled && (
                <Button onClick={enableGuardianMode} disabled={isEnabling}>
                  {isEnabling ? 'Activating...' : 'Activate Guardian Protection'}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Protection Features */}
      {client.guardian_mode_enabled && (
        <Card>
          <CardHeader>
            <CardTitle>24/7 Protection Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Continuous Monitoring</h4>
                  <p className="text-sm text-green-700">
                    Real-time scanning across all platforms for mentions and threats
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Automated Responses</h4>
                  <p className="text-sm text-blue-700">
                    Pre-configured responses for immediate threat mitigation
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800">Escalation Protocols</h4>
                  <p className="text-sm text-purple-700">
                    Automatic escalation for high-severity threats requiring human intervention
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800">Threat Intelligence</h4>
                  <p className="text-sm text-orange-700">
                    Advanced pattern recognition for emerging threat detection
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
