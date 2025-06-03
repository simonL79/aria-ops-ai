
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Eye, Shield, Activity, AlertTriangle, Target, Radar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { performRealScan } from '@/services/monitoring/realScan';
import { WeaponsGradeLiveEnforcer } from '@/services/ariaCore/weaponsGradeLiveEnforcer';

const WatchtowerPage = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [threatDiscovery, setThreatDiscovery] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [liveSystemStatus, setLiveSystemStatus] = useState({
    status: 'CHECKING' as 'SECURE' | 'COMPROMISED' | 'DEGRADED' | 'CHECKING',
    liveDataCount: 0,
    mockDataBlocked: 0,
    lastValidation: '',
    recommendations: [] as string[]
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-white">Loading Watchtower...</span>
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

  const performLiveThreatDiscovery = async () => {
    setIsScanning(true);
    console.log('👁️ Watchtower: Initiating live threat discovery scan');
    
    try {
      const liveResults = await performRealScan({
        fullScan: true,
        source: 'watchtower_discovery'
      });

      if (liveResults.length > 0) {
        setThreatDiscovery(liveResults.slice(0, 15));
        toast.success(`👁️ Watchtower: ${liveResults.length} live threats discovered`);
      } else {
        toast.info('Watchtower: No new live threats detected');
      }

    } catch (error) {
      console.error('❌ Live threat discovery failed:', error);
      toast.error('Live threat discovery failed - no simulation fallback available');
    } finally {
      setIsScanning(false);
    }
  };

  const validateWatchtowerIntegrity = async () => {
    console.log('🔥 Watchtower: Running weapons-grade system validation');
    
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
        toast.success('👁️ Watchtower: System integrity SECURE - live threat discovery active');
      } else {
        toast.warning('⚠️ Watchtower: System integrity issues detected');
      }

    } catch (error) {
      console.error('Watchtower integrity validation failed:', error);
      toast.error('Watchtower: System integrity validation failed');
    }
  };

  useEffect(() => {
    validateWatchtowerIntegrity();
    performLiveThreatDiscovery();
    
    const interval = setInterval(validateWatchtowerIntegrity, 45000);
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      default: return 'bg-green-500 text-white';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">A.R.I.A™ Watchtower</h1>
            <p className="text-gray-300 mt-2">
              Live Threat Discovery & Intelligence - Continuous OSINT Monitoring
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className={`${getStatusColor(liveSystemStatus.status)} px-4 py-2`}>
              <Eye className="h-4 w-4 mr-2" />
              {liveSystemStatus.status}
            </Badge>
            <Button
              onClick={validateWatchtowerIntegrity}
              className="bg-blue-600 hover:bg-blue-700"
            >
              🔍 Validate System
            </Button>
          </div>
        </div>

        {/* Live Threat Discovery Dashboard */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{threatDiscovery.length}</div>
              <p className="text-xs text-gray-400">Live Threats Discovered</p>
            </CardContent>
          </Card>
          
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{liveSystemStatus.liveDataCount}</div>
              <p className="text-xs text-gray-400">OSINT Sources Active</p>
            </CardContent>
          </Card>
          
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{liveSystemStatus.mockDataBlocked}</div>
              <p className="text-xs text-gray-400">Mock Threats Blocked</p>
            </CardContent>
          </Card>
          
          <Card className={`border ${getStatusColor(liveSystemStatus.status)}`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${getStatusColor(liveSystemStatus.status).split(' ')[0]}`}>
                LIVE
              </div>
              <p className="text-xs text-gray-400">Intelligence Status</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Watchtower Tabs */}
        <Tabs defaultValue="threat-discovery" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger value="threat-discovery" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Target className="h-4 w-4 mr-2" />
              Live Threat Discovery
            </TabsTrigger>
            <TabsTrigger value="intelligence-feeds" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Radar className="h-4 w-4 mr-2" />
              Intelligence Feeds
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Activity className="h-4 w-4 mr-2" />
              Live Monitoring
            </TabsTrigger>
            <TabsTrigger value="validation" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Shield className="h-4 w-4 mr-2" />
              Source Validation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="threat-discovery">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-500" />
                    Live Threat Discovery Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={performLiveThreatDiscovery}
                    disabled={isScanning}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    {isScanning ? 'Discovering Live Threats...' : 'Discover Live Threats'}
                  </Button>
                  <div className="text-sm text-gray-400">
                    Last discovery: {liveSystemStatus.lastValidation ? new Date(liveSystemStatus.lastValidation).toLocaleString() : 'Never'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-white">Live Threat Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {threatDiscovery.length > 0 ? threatDiscovery.slice(0, 8).map((threat: any, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-corporate-dark rounded">
                        <div>
                          <div className="text-white font-medium">{threat.platform}</div>
                          <div className="text-xs text-gray-500 mt-1">{threat.content?.substring(0, 60)}...</div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={getSeverityColor(threat.severity)}>
                            {threat.severity}
                          </Badge>
                          <Badge className="bg-blue-500 text-white text-xs">LIVE</Badge>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <Eye className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No Live Threats</h3>
                        <p className="text-gray-500">Run threat discovery to scan for live threats</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="intelligence-feeds">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Radar className="h-5 w-5 text-blue-500" />
                  Live Intelligence Feeds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Radar className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
                  <h3 className="text-lg font-medium text-white mb-2">Live Intelligence Feeds</h3>
                  <p className="text-corporate-lightGray">Real-time intelligence feeds from verified OSINT sources</p>
                </div>
              </CardContent>
            </Card>
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

          <TabsContent value="validation">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Weapons-Grade Source Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={validateWatchtowerIntegrity}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Validate OSINT Sources
                  </Button>
                  
                  {liveSystemStatus.recommendations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-white font-medium mb-2">System Recommendations:</h4>
                      <div className="space-y-2">
                        {liveSystemStatus.recommendations.map((rec, index) => (
                          <div key={index} className="text-sm text-yellow-300 bg-yellow-900/20 p-2 rounded">
                            • {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WatchtowerPage;
