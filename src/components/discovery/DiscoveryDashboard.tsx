
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Scanner, Users, FileText, Mail, TrendingUp, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import DiscoveryScanPanel from './DiscoveryScanPanel';
import ThreatIntelligencePanel from './ThreatIntelligencePanel';
import EvidenceReportsPanel from './EvidenceReportsPanel';
import ContactDiscoveryPanel from './ContactDiscoveryPanel';
import OutreachPanel from './OutreachPanel';
import { useDiscoveryScanning } from '@/hooks/useDiscoveryScanning';

const DiscoveryDashboard = () => {
  const {
    isScanning,
    scanProgress,
    discoveredThreats,
    scanStats,
    startDiscoveryScan,
    stopDiscoveryScan
  } = useDiscoveryScanning();

  const [activeTab, setActiveTab] = useState('scan');

  const handleStartScan = async () => {
    toast.info("Starting discovery scan across all platforms...");
    await startDiscoveryScan();
  };

  const handleStopScan = async () => {
    toast.info("Stopping discovery scan...");
    await stopDiscoveryScan();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">ARIA™ Discovery Intelligence</h1>
          <p className="text-muted-foreground">
            Autonomous threat discovery & direct outreach system
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleStartScan}
            disabled={isScanning}
            className="bg-green-600 hover:bg-green-700"
          >
            <Scanner className="mr-2 h-4 w-4" />
            {isScanning ? "Scanning..." : "Start Discovery Scan"}
          </Button>
          {isScanning && (
            <Button
              onClick={handleStopScan}
              variant="outline"
            >
              Stop Scan
            </Button>
          )}
        </div>
      </div>

      {/* Scan Progress */}
      {isScanning && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Live Discovery Scan in Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={scanProgress} className="w-full" />
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Platforms Scanned:</span>
                  <div>{scanStats.platformsScanned}/8</div>
                </div>
                <div>
                  <span className="font-medium">Entities Found:</span>
                  <div>{scanStats.entitiesFound}</div>
                </div>
                <div>
                  <span className="font-medium">Threats Detected:</span>
                  <div>{scanStats.threatsDetected}</div>
                </div>
                <div>
                  <span className="font-medium">High Priority:</span>
                  <div>{scanStats.highPriorityThreats}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Threats</p>
                <p className="text-2xl font-bold text-red-600">{discoveredThreats.filter(t => t.status === 'active').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entities Monitored</p>
                <p className="text-2xl font-bold">{scanStats.entitiesFound}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reports Generated</p>
                <p className="text-2xl font-bold">{scanStats.reportsGenerated || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contacts Found</p>
                <p className="text-2xl font-bold">{scanStats.contactsFound || 0}</p>
              </div>
              <Mail className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent High Priority Alerts */}
      {discoveredThreats.filter(t => t.threatLevel >= 8).length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>High Priority Threats Detected:</strong> {discoveredThreats.filter(t => t.threatLevel >= 8).length} critical threats require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="scan">Discovery Scan</TabsTrigger>
          <TabsTrigger value="intelligence">Threat Intelligence</TabsTrigger>
          <TabsTrigger value="reports">Evidence Reports</TabsTrigger>
          <TabsTrigger value="contacts">Contact Discovery</TabsTrigger>
          <TabsTrigger value="outreach">Direct Outreach</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan" className="mt-6">
          <DiscoveryScanPanel 
            isScanning={isScanning}
            discoveredThreats={discoveredThreats}
            onStartScan={handleStartScan}
          />
        </TabsContent>
        
        <TabsContent value="intelligence" className="mt-6">
          <ThreatIntelligencePanel threats={discoveredThreats} />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <EvidenceReportsPanel threats={discoveredThreats} />
        </TabsContent>
        
        <TabsContent value="contacts" className="mt-6">
          <ContactDiscoveryPanel threats={discoveredThreats} />
        </TabsContent>
        
        <TabsContent value="outreach" className="mt-6">
          <OutreachPanel threats={discoveredThreats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiscoveryDashboard;
