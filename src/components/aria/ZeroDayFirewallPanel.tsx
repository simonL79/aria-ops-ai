
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  Zap, 
  Eye, 
  Bot,
  Clock,
  Target
} from "lucide-react";
import { zeroDayFirewall, type ZeroDayEvent, type AIWatchdogVerdict, type AISwarmConsensus } from '@/services/aria/zeroDay';
import { toast } from 'sonner';

const ZeroDayFirewallPanel = () => {
  const [events, setEvents] = useState<ZeroDayEvent[]>([]);
  const [verdicts, setVerdicts] = useState<AIWatchdogVerdict[]>([]);
  const [consensus, setConsensus] = useState<AISwarmConsensus[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [eventsData, verdictsData, consensusData] = await Promise.all([
        zeroDayFirewall.getZeroDayEvents(),
        zeroDayFirewall.getAIWatchdogVerdicts(),
        zeroDayFirewall.getAISwarmConsensus()
      ]);

      setEvents(eventsData);
      setVerdicts(verdictsData);
      setConsensus(consensusData);
    } catch (error) {
      console.error('Error loading zero-day data:', error);
      toast.error('Failed to load zero-day firewall data');
    } finally {
      setIsLoading(false);
    }
  };

  const runZeroDayScan = async () => {
    setIsScanning(true);
    try {
      await zeroDayFirewall.scanForZeroDayThreats();
      toast.success('Zero-day threat scan completed');
      // Reload data after scan
      setTimeout(loadAllData, 2000);
    } catch (error) {
      console.error('Error running zero-day scan:', error);
      toast.error('Zero-day scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'malicious': return 'bg-red-500';
      case 'benign': return 'bg-green-500';
      case 'inconclusive': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventVerdicts = (eventId: string) => {
    return verdicts.filter(v => v.threat_id === eventId);
  };

  const getEventConsensus = (eventId: string) => {
    return consensus.find(c => c.threat_id === eventId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading Zero-Day Firewall...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Zero-Day Firewall & AI Swarm
          </h3>
          <p className="text-sm text-muted-foreground">
            Live threat detection with AI consensus analysis
          </p>
        </div>
        <Button 
          onClick={runZeroDayScan}
          disabled={isScanning}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {isScanning ? (
            <>
              <Target className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Run Zero-Day Scan
            </>
          )}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Events</p>
              <p className="text-lg font-bold text-red-600">{events.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">AI Verdicts</p>
              <p className="text-lg font-bold text-blue-600">{verdicts.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Consensus</p>
              <p className="text-lg font-bold text-green-600">{consensus.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Malicious</p>
              <p className="text-lg font-bold text-red-600">
                {consensus.filter(c => c.final_verdict === 'malicious').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="events" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Zero-Day Events
          </TabsTrigger>
          <TabsTrigger value="verdicts" className="flex items-center gap-1">
            <Bot className="h-3 w-3" />
            AI Verdicts
          </TabsTrigger>
          <TabsTrigger value="consensus" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Consensus
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Live Zero-Day Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {events.length > 0 ? (
                  events.map((event) => {
                    const eventVerdicts = getEventVerdicts(event.id);
                    const eventConsensus = getEventConsensus(event.id);
                    
                    return (
                      <div key={event.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{event.threat_vector}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              Score: {event.entropy_score.toFixed(2)}
                            </Badge>
                            {event.auto_neutralized && (
                              <Badge className="bg-green-500 text-white">
                                Neutralized
                              </Badge>
                            )}
                            {eventConsensus && (
                              <Badge className={`${getVerdictColor(eventConsensus.final_verdict)} text-white`}>
                                {eventConsensus.final_verdict.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {event.anomaly_signature}
                        </p>
                        
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                          <span>
                            <Clock className="inline h-3 w-3 mr-1" />
                            {new Date(event.detected_at).toLocaleString()}
                          </span>
                          {event.source_url && (
                            <a 
                              href={event.source_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Source
                            </a>
                          )}
                        </div>

                        {eventVerdicts.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-medium mb-1">
                              AI Watchdog Verdicts ({eventVerdicts.length}):
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {eventVerdicts.map((verdict) => (
                                <Badge 
                                  key={verdict.id} 
                                  variant="outline" 
                                  className="text-xs"
                                >
                                  {verdict.watchdog_name}: {verdict.verdict} ({(verdict.confidence * 100).toFixed(0)}%)
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {eventConsensus && (
                          <div className="mt-2">
                            <Progress 
                              value={eventConsensus.consensus_score * 20} 
                              className="h-2"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Consensus Score: {eventConsensus.consensus_score.toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No zero-day events detected
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verdicts">
          <Card>
            <CardHeader>
              <CardTitle>AI Watchdog Verdicts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {verdicts.length > 0 ? (
                  verdicts.map((verdict) => (
                    <div key={verdict.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{verdict.watchdog_name}</span>
                          <Badge 
                            className={`ml-2 ${getVerdictColor(verdict.verdict)} text-white`}
                          >
                            {verdict.verdict.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-right text-sm">
                          <div>Confidence: {(verdict.confidence * 100).toFixed(0)}%</div>
                          <div className="text-gray-500">
                            {new Date(verdict.submitted_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No AI verdicts available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consensus">
          <Card>
            <CardHeader>
              <CardTitle>AI Swarm Consensus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {consensus.length > 0 ? (
                  consensus.map((item) => (
                    <div key={item.threat_id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Threat Analysis Complete</h4>
                        <Badge className={`${getVerdictColor(item.final_verdict)} text-white`}>
                          {item.final_verdict.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm text-gray-600">Consensus Score: </span>
                          <span className="font-medium">{item.consensus_score.toFixed(2)}</span>
                        </div>
                        <Progress value={Math.min(100, item.consensus_score * 20)} className="h-2" />
                        <div className="text-xs text-gray-500">
                          Resolved: {new Date(item.resolved_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No consensus data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ZeroDayFirewallPanel;
