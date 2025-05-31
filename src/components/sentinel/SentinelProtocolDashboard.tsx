import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Search, AlertTriangle, Target, Users, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SentinelService } from '@/services/sentinel/sentinelService';
import { ThreatDiscoveryPanel } from './ThreatDiscoveryPanel';
import { ResponsePlansPanel } from './ResponsePlansPanel';
import { GuardianMonitoringPanel } from './GuardianMonitoringPanel';
import { MissionLogPanel } from './MissionLogPanel';
import type { SentinelClient, ThreatDiscoveryResult } from '@/types/sentinel';

const SentinelProtocolDashboard = () => {
  const [clientName, setClientName] = useState('');
  const [entityNames, setEntityNames] = useState('');
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [clients, setClients] = useState<SentinelClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<SentinelClient | null>(null);
  const [discoveryResult, setDiscoveryResult] = useState<ThreatDiscoveryResult | null>(null);
  const [activeTab, setActiveTab] = useState('discover');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const clientsData = await SentinelService.getClients();
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleThreatDiscovery = async () => {
    if (!clientName.trim() || !entityNames.trim()) {
      toast.error('Please enter client name and entity names');
      return;
    }

    setIsDiscovering(true);
    try {
      const entities = entityNames.split(',').map(e => e.trim()).filter(e => e);
      console.log(`[SENTINEL] Starting threat discovery for ${clientName} with entities:`, entities);
      
      const result = await SentinelService.discoverThreats(clientName, entities);
      setDiscoveryResult(result);
      
      // Reload clients to get the new one
      await loadClients();
      
      // Find and select the new client
      const newClient = await SentinelService.getClients();
      const client = newClient.find(c => c.client_name === clientName);
      if (client) {
        setSelectedClient(client);
      }
      
      toast.success(`Discovery complete: ${result.threat_count} threats found`);
      setActiveTab('threats');
    } catch (error) {
      console.error('Error discovering threats:', error);
      toast.error('Failed to discover threats');
    } finally {
      setIsDiscovering(false);
    }
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getProtectionLevelColor = (level: string) => {
    switch (level) {
      case 'enterprise': return 'text-purple-600';
      case 'premium': return 'text-blue-600';
      case 'standard': return 'text-green-600';
      case 'basic': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Sentinel Protocol
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive Threat Discovery & Response System</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="discover" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="threats" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Threats
          </TabsTrigger>
          <TabsTrigger value="responses" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Responses
          </TabsTrigger>
          <TabsTrigger value="guardian" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Guardian
          </TabsTrigger>
          <TabsTrigger value="missions" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Missions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Threat Discovery Form */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Comprehensive Threat Discovery
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Client Name</label>
                  <Input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter client or company name..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Entity Names</label>
                  <Input
                    value={entityNames}
                    onChange={(e) => setEntityNames(e.target.value)}
                    placeholder="CEO name, product names, key executives (comma separated)..."
                  />
                </div>

                <Button 
                  onClick={handleThreatDiscovery}
                  disabled={isDiscovering}
                  className="w-full flex items-center gap-2"
                >
                  {isDiscovering ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Discovering Threats...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Start Deep Threat Discovery
                    </>
                  )}
                </Button>

                {discoveryResult && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Discovery Complete</span>
                    </div>
                    <p className="text-green-700">{discoveryResult.discovery_summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Existing Clients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Protected Clients ({clients.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clients.length > 0 ? (
                    clients.slice(0, 5).map((client) => (
                      <div
                        key={client.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedClient?.id === client.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedClient(client)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{client.client_name}</span>
                          <Badge variant={client.guardian_mode_enabled ? 'default' : 'outline'}>
                            {client.guardian_mode_enabled ? 'Protected' : 'Monitoring'}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600">
                          <span className={getProtectionLevelColor(client.protection_level)}>
                            {client.protection_level.toUpperCase()}
                          </span> • {client.entity_names.length} entities
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No clients yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="threats">
          {selectedClient ? (
            <ThreatDiscoveryPanel client={selectedClient} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">Select a client to view their threat discovery results</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="responses">
          {selectedClient ? (
            <ResponsePlansPanel client={selectedClient} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">Select a client to view their response plans</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="guardian">
          {selectedClient ? (
            <GuardianMonitoringPanel client={selectedClient} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">Select a client to view their guardian monitoring status</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="missions">
          {selectedClient ? (
            <MissionLogPanel client={selectedClient} />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">Select a client to view their mission execution logs</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SentinelProtocolDashboard;
