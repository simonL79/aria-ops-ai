
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Shield, Search, Users, Database, Activity, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { performRealScan } from '@/services/monitoring/realScan';
import { WeaponsGradeLiveEnforcer } from '@/services/ariaCore/weaponsGradeLiveEnforcer';
import { LiveDataIntegrityService } from '@/services/ariaCore/liveDataIntegrityService';
import DataManagementTab from '@/components/admin/genesis-sentinel/DataManagementTab';

const GenesisSentinel = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [scanTarget, setScanTarget] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [liveSystemStatus, setLiveSystemStatus] = useState({
    status: 'CHECKING' as 'SECURE' | 'COMPROMISED' | 'DEGRADED' | 'CHECKING',
    liveDataCount: 0,
    mockDataBlocked: 0,
    lastValidation: '',
    recommendations: [] as string[]
  });
  const [recentDetections, setRecentDetections] = useState([]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-white">Loading Genesis Sentinel...</span>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLiveScan = async () => {
    if (!scanTarget.trim()) {
      toast.error('Please enter a target entity for live scanning');
      return;
    }

    setIsScanning(true);
    console.log('🔍 Genesis Sentinel™: Initiating live OSINT scan');
    
    try {
      const liveResults = await performRealScan({
        fullScan: true,
        targetEntity: scanTarget,
        source: 'genesis_sentinel'
      });

      if (liveResults.length > 0) {
        // Transform results for display
        const detections = liveResults.slice(0, 5).map(result => ({
          type: result.threat_type || 'Live Intelligence',
          description: result.content.substring(0, 100) + '...',
          platform: result.platform,
          severity: result.severity,
          url: result.url
        }));
        
        setRecentDetections(detections);
        toast.success(`✅ Live scan completed: ${liveResults.length} intelligence items found`);
      } else {
        toast.info('Live scan completed: No new intelligence detected for this entity');
      }

    } catch (error) {
      console.error('❌ Live scan failed:', error);
      toast.error('Live intelligence scan failed - no simulation fallback available');
    } finally {
      setIsScanning(false);
    }
  };

  const checkSystemIntegrity = async () => {
    console.log('🔥 Genesis Sentinel™: Running weapons-grade system integrity check');
    
    try {
      const status = await WeaponsGradeLiveEnforcer.getWeaponsGradeStatus();
      
      setLiveSystemStatus({
        status: status.status,
        liveDataCount: status.liveDataCount,
        mockDataBlocked: status.mockDataBlocked,
        lastValidation: status.lastValidation,
        recommendations: status.recommendations
      });

      if (status.status === 'SECURE') {
        toast.success('✅ System integrity: SECURE - Live data only');
      } else if (status.status === 'DEGRADED') {
        toast.warning('⚠️ System degraded - see recommendations');
      } else {
        toast.error('🚫 System compromised - immediate action required');
      }

    } catch (error) {
      console.error('System integrity check failed:', error);
      toast.error('System integrity check failed');
    }
  };

  const runCompleteIntegrityCheck = async () => {
    console.log('🔥 Genesis Sentinel™: Running complete live data integrity validation');
    
    try {
      const report = await LiveDataIntegrityService.runCompleteIntegrityCheck();
      
      setLiveSystemStatus({
        status: report.status,
        liveDataCount: report.weaponsGradeStatus?.liveDataCount || 0,
        mockDataBlocked: report.mockDataPurged,
        lastValidation: report.timestamp,
        recommendations: report.recommendations
      });

      if (report.status === 'SECURE') {
        toast.success('✅ Complete integrity check passed - system secure');
      } else {
        toast.error(`🔥 Integrity issues detected: ${report.recommendations.length} recommendations`);
      }

    } catch (error) {
      console.error('Complete integrity check failed:', error);
      toast.error('Complete integrity check failed');
    }
  };

  useEffect(() => {
    checkSystemIntegrity();
    
    const interval = setInterval(checkSystemIntegrity, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SECURE': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'DEGRADED': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'COMPROMISED': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Genesis Sentinel™</h1>
            <p className="text-gray-300 mt-2">
              Weapons-grade live intelligence scanning - NO SIMULATIONS
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className={`${getStatusColor(liveSystemStatus.status)} px-4 py-2`}>
              <Shield className="h-4 w-4 mr-2" />
              {liveSystemStatus.status}
            </Badge>
            <Button
              onClick={runCompleteIntegrityCheck}
              className="bg-red-600 hover:bg-red-700"
            >
              🔥 Weapons Grade Check
            </Button>
          </div>
        </div>

        <Tabs defaultValue="threat-detection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger value="threat-detection" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Shield className="h-4 w-4 mr-2" />
              Live Threat Detection
            </TabsTrigger>
            <TabsTrigger value="entity-discovery" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Search className="h-4 w-4 mr-2" />
              Entity Discovery
            </TabsTrigger>
            <TabsTrigger value="risk-intelligence" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Risk Intelligence
            </TabsTrigger>
            <TabsTrigger value="data-management" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Database className="h-4 w-4 mr-2" />
              Data Management
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Activity className="h-4 w-4 mr-2" />
              Live Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="threat-detection">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    Live OSINT Scanning Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter target entity for live intelligence scan..."
                      value={scanTarget}
                      onChange={(e) => setScanTarget(e.target.value)}
                      className="bg-corporate-dark border-corporate-border text-white"
                    />
                    <Button 
                      onClick={handleLiveScan}
                      disabled={isScanning || !scanTarget}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isScanning ? 'Live Scanning...' : 'Live Scan'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-corporate-dark p-3 rounded">
                      <div className="text-sm text-gray-400">Live Data Count</div>
                      <div className="text-2xl font-bold text-green-400">{liveSystemStatus.liveDataCount}</div>
                    </div>
                    <div className="bg-corporate-dark p-3 rounded">
                      <div className="text-sm text-gray-400">Mock Data Blocked</div>
                      <div className="text-2xl font-bold text-red-400">{liveSystemStatus.mockDataBlocked}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-white">Live Intelligence Detections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentDetections.length > 0 ? recentDetections.map((detection, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-corporate-dark rounded">
                        <div>
                          <div className="text-white font-medium">{detection.type}</div>
                          <div className="text-sm text-gray-400">{detection.platform}</div>
                          <div className="text-xs text-gray-500 mt-1">{detection.description}</div>
                        </div>
                        <Badge className={
                          detection.severity === 'high' ? 'bg-red-500 text-white' :
                          detection.severity === 'medium' ? 'bg-yellow-500 text-black' :
                          'bg-green-500 text-white'
                        }>
                          {detection.severity}
                        </Badge>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <Shield className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No Recent Detections</h3>
                        <p className="text-gray-500">Run a live scan to detect threats</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Recommendations */}
            {liveSystemStatus.recommendations.length > 0 && (
              <Card className="bg-red-900/20 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-400">System Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {liveSystemStatus.recommendations.map((rec, index) => (
                      <div key={index} className="text-sm text-red-300">• {rec}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="entity-discovery">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-500" />
                  Live Entity Discovery Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
                  <h3 className="text-lg font-medium text-white mb-2">Live Entity Discovery</h3>
                  <p className="text-corporate-lightGray">Real-time entity mapping using live intelligence feeds</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk-intelligence">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Live Risk Intelligence Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
                  <h3 className="text-lg font-medium text-white mb-2">Live Risk Intelligence</h3>
                  <p className="text-corporate-lightGray">Real-time risk assessment using live threat intelligence</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data-management">
            <DataManagementTab />
          </TabsContent>

          <TabsContent value="monitoring">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-500" />
                  Live Monitoring System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
                  <h3 className="text-lg font-medium text-white mb-2">Live Monitoring</h3>
                  <p className="text-corporate-lightGray">Continuous real-time threat monitoring and alerting</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default GenesisSentinel;
