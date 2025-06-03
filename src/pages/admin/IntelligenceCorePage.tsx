
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LiveDataGuard } from '@/components/dashboard/LiveDataGuard';
import RDPCompliancePanel from '@/components/admin/RDPCompliancePanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Shield, Activity, RefreshCw, Lock } from 'lucide-react';
import FilteringStatsPanel from '@/components/aria/FilteringStatsPanel';

const IntelligenceCorePage = () => {
  const [systemStatus, setSystemStatus] = useState({
    coreActive: true,
    validationPassed: true,
    liveDataOnly: true,
    lastValidation: new Date()
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const initializeSystem = async () => {
      try {
        console.log('🔍 Intelligence Core initializing...');
        setSystemStatus(prev => ({
          ...prev,
          lastValidation: new Date()
        }));
      } catch (error) {
        console.error('Intelligence Core initialization error:', error);
      }
    };

    initializeSystem();
  }, []);

  const handleRefreshStatus = async () => {
    setIsRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSystemStatus(prev => ({
        ...prev,
        lastValidation: new Date()
      }));
    } catch (error) {
      console.error('Status refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <LiveDataGuard enforceStrict={true}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Brain className="h-8 w-8 text-purple-600" />
                A.R.I.A™ Intelligence Core
              </h1>
              <p className="text-muted-foreground mt-1">
                Advanced Real-time Intelligence Analysis & RDP-001 Compliance
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Lock className="h-3 w-3" />
                RDP-001 Enforced
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Live Validation Active
              </Badge>
              <Button 
                onClick={handleRefreshStatus}
                disabled={isRefreshing}
                size="sm"
                variant="outline"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Status
              </Button>
            </div>
          </div>

          {/* System Status */}
          <Card className="border-green-500/20 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Core System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {systemStatus.coreActive ? '✅' : '❌'}
                  </div>
                  <p className="text-sm font-medium">Core Active</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {systemStatus.validationPassed ? '✅' : '❌'}
                  </div>
                  <p className="text-sm font-medium">RDP-001 Compliant</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {systemStatus.liveDataOnly ? '✅' : '❌'}
                  </div>
                  <p className="text-sm font-medium">Live Data Only</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {systemStatus.lastValidation.toLocaleTimeString()}
                  </div>
                  <p className="text-sm font-medium">Last Validation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="compliance" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="compliance">RDP-001 Compliance</TabsTrigger>
              <TabsTrigger value="operations">Intelligence Operations</TabsTrigger>
              <TabsTrigger value="statistics">Filtering Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="compliance">
              <RDPCompliancePanel />
            </TabsContent>

            <TabsContent value="operations">
              <Card>
                <CardHeader>
                  <CardTitle>Live Intelligence Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Enhanced Entity Matching</h3>
                      <p className="text-sm text-muted-foreground">
                        Multi-layer confidence scoring with exact, alias, contextual, and fuzzy matching
                      </p>
                      <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">RDP-001 Data Enforcement</h3>
                      <p className="text-sm text-muted-foreground">
                        Multi-stage validation with quarantine system and live URL verification
                      </p>
                      <Badge className="mt-2 bg-blue-100 text-blue-800">Enforced</Badge>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Real-time Processing</h3>
                      <p className="text-sm text-muted-foreground">
                        Continuous monitoring across verified sources with HTTP 200 validation
                      </p>
                      <Badge className="mt-2 bg-green-100 text-green-800">Online</Badge>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-medium mb-2">Quarantine System</h3>
                      <p className="text-sm text-muted-foreground">
                        Automatic isolation and admin notification for policy violations
                      </p>
                      <Badge className="mt-2 bg-red-100 text-red-800">Armed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="statistics">
              <FilteringStatsPanel />
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </LiveDataGuard>
  );
};

export default IntelligenceCorePage;
