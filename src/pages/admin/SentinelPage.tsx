
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Target, Clock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SentinelCase {
  id: string;
  entity_name: string;
  threat_level: number;
  case_status: string;
  case_summary?: string;
  created_at: string;
}

interface ThreatEvent {
  id: string;
  event_type: string;
  event_description: string;
  threat_severity: string;
  created_at: string;
}

const SentinelPage = () => {
  const { isAdmin } = useAuth();
  const [cases, setCases] = useState<SentinelCase[]>([]);
  const [recentEvents, setRecentEvents] = useState<ThreatEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadSentinelData();
    }
  }, [isAdmin]);

  const loadSentinelData = async () => {
    try {
      // Load cases from scan_results as proxy data
      const { data: scanData } = await supabase
        .from('scan_results')
        .select('*')
        .eq('status', 'new')
        .order('created_at', { ascending: false })
        .limit(10);

      if (scanData) {
        const transformedCases: SentinelCase[] = scanData.map((item: any) => ({
          id: item.id,
          entity_name: item.content?.substring(0, 50) + '...' || 'Unknown Entity',
          threat_level: item.severity === 'high' ? 4 : item.severity === 'medium' ? 2 : 1,
          case_status: 'active',
          case_summary: `${item.platform} threat: ${item.threat_type}`,
          created_at: item.created_at
        }));
        setCases(transformedCases);
      }

      // Load recent threat events from activity_logs
      const { data: eventsData } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (eventsData) {
        const transformedEvents: ThreatEvent[] = eventsData.map((item: any) => ({
          id: item.id,
          event_type: item.action || 'threat_detected',
          event_description: item.details || 'Threat activity detected',
          threat_severity: 'medium',
          created_at: item.created_at
        }));
        setRecentEvents(transformedEvents);
      }

    } catch (error) {
      console.error('Error loading Sentinel data:', error);
      toast.error('Failed to load Sentinel data');
    } finally {
      setLoading(false);
    }
  };

  const activateResponse = async (caseId: string, responseType: 'soft' | 'hard' | 'nuclear') => {
    try {
      const { data, error } = await supabase.functions.invoke('execute-response', {
        body: {
          caseId,
          executionType: responseType,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;

      toast.success(`${responseType.toUpperCase()} response activated`);
      loadSentinelData();
    } catch (error: any) {
      console.error('Response activation error:', error);
      toast.error('Failed to activate response');
    }
  };

  if (!isAdmin) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card className="border-red-500/50 bg-red-500/10">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-500 mb-2">Access Denied</h3>
              <p className="text-red-400">Sentinel Command requires administrative clearance</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-2xl font-bold">A.R.I.A™ Sentinel Command</h1>
              <p className="text-gray-600">Threat response and case management</p>
            </div>
          </div>
          <Badge className="bg-blue-500 text-white">
            {cases.length} Active Cases
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Active Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{cases.length}</div>
              <p className="text-xs text-muted-foreground">Requiring attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                <Target className="h-4 w-4" />
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {cases.filter(c => c.threat_level >= 4).length}
              </div>
              <p className="text-xs text-muted-foreground">Critical threats</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">~2.3m</div>
              <p className="text-xs text-muted-foreground">Average response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">94%</div>
              <p className="text-xs text-muted-foreground">Threat resolution</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Cases</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading cases...</div>
              ) : cases.length > 0 ? (
                <div className="space-y-3">
                  {cases.map(caseItem => (
                    <div key={caseItem.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-sm">{caseItem.entity_name}</div>
                          <div className="text-xs text-gray-500">{caseItem.case_summary}</div>
                        </div>
                        <Badge 
                          className={`text-xs ${
                            caseItem.threat_level >= 4 ? 'bg-red-500 text-white' :
                            caseItem.threat_level >= 2 ? 'bg-yellow-500 text-white' :
                            'bg-blue-500 text-white'
                          }`}
                        >
                          L{caseItem.threat_level}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => activateResponse(caseItem.id, 'soft')}
                        >
                          Soft Response
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => activateResponse(caseItem.id, 'hard')}
                        >
                          Hard Response
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => activateResponse(caseItem.id, 'nuclear')}
                        >
                          Nuclear
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No active cases</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              {recentEvents.length > 0 ? (
                <div className="space-y-3">
                  {recentEvents.map(event => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">{event.event_type}</div>
                          <div className="text-xs text-gray-500">{event.event_description}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(event.created_at).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {event.threat_severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No recent events</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SentinelPage;
