
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertTriangle, Target, Play } from 'lucide-react';
import { SentinelService } from '@/services/sentinel/sentinelService';
import type { SentinelClient, SentinelMissionLog } from '@/types/sentinel';

interface MissionLogPanelProps {
  client: SentinelClient;
}

export const MissionLogPanel = ({ client }: MissionLogPanelProps) => {
  const [missionLogs, setMissionLogs] = useState<SentinelMissionLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMissionLogs();
  }, [client.id]);

  const loadMissionLogs = async () => {
    setIsLoading(true);
    try {
      const logsData = await SentinelService.getMissionLogs(client.id);
      setMissionLogs(logsData);
    } catch (error) {
      console.error('Error loading mission logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'executing': return 'bg-blue-500 text-white';
      case 'failed': return 'bg-red-500 text-white';
      case 'escalated': return 'bg-orange-500 text-white';
      case 'pending': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'executing': return <Play className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      case 'escalated': return <Target className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getActionTypeLabel = (actionType: string) => {
    return actionType.replace('_', ' ').toUpperCase();
  };

  const formatDuration = (startedAt?: string, completedAt?: string) => {
    if (!startedAt) return 'Not started';
    if (!completedAt) return 'In progress';
    
    const start = new Date(startedAt).getTime();
    const end = new Date(completedAt).getTime();
    const duration = Math.round((end - start) / 1000 / 60); // minutes
    
    if (duration < 1) return '< 1 minute';
    if (duration < 60) return `${duration} minutes`;
    return `${Math.round(duration / 60)} hours`;
  };

  const getEffectivenessColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-orange-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading mission execution logs...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mission Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {missionLogs.length}
            </div>
            <div className="text-sm text-gray-600">Total Missions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {missionLogs.filter(log => log.execution_status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {missionLogs.filter(log => log.execution_status === 'executing').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {missionLogs.length > 0 
                ? Math.round(missionLogs.reduce((sum, log) => sum + (log.effectiveness_score || 0), 0) / missionLogs.length * 100)
                : 0}%
            </div>
            <div className="text-sm text-gray-600">Avg Effectiveness</div>
          </CardContent>
        </Card>
      </div>

      {/* Mission Log Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Mission Execution Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {missionLogs.length > 0 ? (
            <div className="space-y-4">
              {missionLogs.map((mission, index) => (
                <div key={mission.id} className="relative">
                  {/* Timeline line */}
                  {index < missionLogs.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                  )}
                  
                  <div className="flex items-start gap-4">
                    {/* Status indicator */}
                    <div className={`p-2 rounded-full ${getStatusColor(mission.execution_status)}`}>
                      {getStatusIcon(mission.execution_status)}
                    </div>
                    
                    {/* Mission details */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{getActionTypeLabel(mission.action_type)}</h3>
                          <Badge className={getStatusColor(mission.execution_status)}>
                            {mission.execution_status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(mission.created_at).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <span className="text-sm text-gray-600">Duration</span>
                          <p className="text-sm font-medium">
                            {formatDuration(mission.started_at, mission.completed_at)}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-600">Executed By</span>
                          <p className="text-sm font-medium">{mission.executed_by}</p>
                        </div>
                        {mission.effectiveness_score && (
                          <div>
                            <span className="text-sm text-gray-600">Effectiveness</span>
                            <p className={`text-sm font-medium ${getEffectivenessColor(mission.effectiveness_score)}`}>
                              {Math.round(mission.effectiveness_score * 100)}%
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {mission.result_summary && (
                        <div className="mb-3">
                          <span className="text-sm text-gray-600">Result</span>
                          <p className="text-sm">{mission.result_summary}</p>
                        </div>
                      )}
                      
                      {mission.action_details && Object.keys(mission.action_details).length > 0 && (
                        <div>
                          <span className="text-sm text-gray-600">Action Details</span>
                          <div className="text-xs bg-white p-2 rounded border mt-1">
                            {mission.action_details.plan_type && (
                              <div><strong>Plan Type:</strong> {mission.action_details.plan_type}</div>
                            )}
                            {mission.action_details.entity_name && (
                              <div><strong>Entity:</strong> {mission.action_details.entity_name}</div>
                            )}
                            {mission.action_details.threat_content && (
                              <div><strong>Threat:</strong> {mission.action_details.threat_content}</div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {mission.next_action_recommended && (
                        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <span className="text-sm font-medium text-yellow-800">Recommended Next Action:</span>
                          <p className="text-sm text-yellow-700">{mission.next_action_recommended}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">No mission executions yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
