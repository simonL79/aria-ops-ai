
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Brain, Shield, Activity, Database, AlertTriangle, Eye, Zap, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { performRealScan } from '@/services/monitoring/realScan';
import { WeaponsGradeLiveEnforcer } from '@/services/ariaCore/weaponsGradeLiveEnforcer';
import { LiveDataIntegrityService } from '@/services/ariaCore/liveDataIntegrityService';

const IntelligenceCorePage = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [liveSystemStatus, setLiveSystemStatus] = useState({
    status: 'CHECKING' as 'SECURE' | 'COMPROMISED' | 'DEGRADED' | 'CHECKING',
    liveDataCount: 0,
    mockDataBlocked: 0,
    lastValidation: '',
    recommendations: [] as string[]
  });
  const [liveIntelligence, setLiveIntelligence] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [systemIntegrity, setSystemIntegrity] = useState({
    weaponsGradeCompliant: false,
    osintSourcesVerified: false,
    realTimeValidation: false
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
        <span className="ml-2 text-white">Loading Intelligence Core...</span>
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

  const performLiveIntelligenceScan = async () => {
    setIsScanning(true);
    console.log('🧠 Intelligence Core: Initiating live OSINT intelligence scan');
    
    try {
      const liveResults = await performRealScan({
        fullScan: true,
        source: 'intelligence_core'
      });

      if (liveResults.length > 0) {
        setLiveIntelligence(liveResults.slice(0, 20));
        toast.success(`🧠 Intelligence Core: ${liveResults.length} live intelligence items processed`);
      } else {
        toast.info('Intelligence Core: No new live intelligence detected');
      }

    } catch (error) {
      console.error('❌ Live intelligence scan failed:', error);
      toast.error('Live intelligence scan failed - no simulation fallback available');
    } finally {
      setIsScanning(false);
    }
  };

  const validateSystemIntegrity = async () => {
    console.log('🔥 Intelligence Core: Running weapons-grade system integrity validation');
    
    try {
      const status = await WeaponsGradeLiveEnforcer.getWeaponsGradeStatus();
      
      setLiveSystemStatus({
        status: status.status,
        liveDataCount: status.liveDataCount,
        mockDataBlocked: status.mockDataBlocked,
        lastValidation: status.lastValidation,
        recommendations: status.recommendations
      });

      // Validate OSINT sources and real-time compliance
      setSystemIntegrity({
        weaponsGradeCompliant: status.status === 'SECURE',
        osintSourcesVerified: status.liveDataCount > 0,
        realTimeValidation: status.mockDataBlocked === 0
      });

      if (status.status === 'SECURE') {
        toast.success('🧠 Intelligence Core: System integrity SECURE - verified live intelligence only');
      } else if (status.status === 'DEGRADED') {
        toast.warning('⚠️ Intelligence Core: System degraded - see recommendations');
      } else {
        toast.error('🚫 Intelligence Core: System compromised - immediate action required');
      }

    } catch (error) {
      console.error('System integrity validation failed:', error);
      toast.error('Intelligence Core: System integrity validation failed');
    }
  };

  const runCompleteIntegrityCheck = async () => {
    console.log('🔥 Intelligence Core: Running complete live data integrity validation');
    
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
        toast.success('✅ Intelligence Core: Complete integrity check passed - system secure');
      } else {
        toast.error(`🔥 Intelligence Core: Integrity issues detected: ${report.recommendations.length} recommendations`);
      }

    } catch (error) {
      console.error('Complete integrity check failed:', error);
      toast.error('Intelligence Core: Complete integrity check failed');
    }
  };

  useEffect(() => {
    validateSystemIntegrity();
    performLiveIntelligenceScan();
    
    const interval = setInterval(validateSystemIntegrity, 30000);
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
            <h1 className="text-3xl font-bold text-white">A.R.I.A™ Intelligence Core</h1>
            <p className="text-gray-300 mt-2">
              Live Intelligence Processing - Weapons-Grade OSINT Analysis
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className={`${getStatusColor(liveSystemStatus.status)} px-4 py-2`}>
              <Brain className="h-4 w-4 mr-2" />
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

        {/* System Integrity Dashboard */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{liveIntelligence.length}</div>
              <p className="text-xs text-gray-400">Live Intelligence Items</p>
            </CardContent>
          </Card>
          
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{liveSystemStatus.liveDataCount}</div>
              <p className="text-xs text-gray-400">Verified OSINT Sources</p>
            </CardContent>
          </Card>
          
          <Card className="bg-corporate-darkSecondary border-corporate-border">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{liveSystemStatus.mockDataBlocked}</div>
              <p className="text-xs text-gray-400">Mock Data Blocked</p>
            </CardContent>
          </Card>
          
          <Card className={`border ${getStatusColor(liveSystemStatus.status)}`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${getStatusColor(liveSystemStatus.status).split(' ')[0]}`}>
                {systemIntegrity.weaponsGradeCompliant ? 'SECURE' : 'ALERT'}
              </div>
              <p className="text-xs text-gray-400">Weapons Grade Status</p>
            </CardContent>
          </Card>
        </div>

        {/* Live Intelligence Validation Status */}
        <Card className="bg-corporate-darkSecondary border-corporate-accent/30">
          <CardHeader>
            <CardTitle className="text-corporate-accent flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Live Intelligence Validation Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${systemIntegrity.weaponsGradeCompliant ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-300">Weapons-Grade Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${systemIntegrity.osintSourcesVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-300">OSINT Sources Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${systemIntegrity.realTimeValidation ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-300">Real-Time Validation Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Intelligence Tabs */}
        <Tabs defaultValue="live-intelligence" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-corporate-darkSecondary border border-corporate-border">
            <TabsTrigger value="live-intelligence" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Eye className="h-4 w-4 mr-2" />
              Live Intelligence
            </TabsTrigger>
            <TabsTrigger value="threat-analysis" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Threat Analysis
            </TabsTrigger>
            <TabsTrigger value="source-validation" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Database className="h-4 w-4 mr-2" />
              Source Validation
            </TabsTrigger>
            <TabsTrigger value="integrity-monitoring" className="data-[state=active]:bg-corporate-accent data-[state=active]:text-black text-corporate-lightGray">
              <Activity className="h-4 w-4 mr-2" />
              Integrity Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live-intelligence">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    Live OSINT Intelligence Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={performLiveIntelligenceScan}
                    disabled={isScanning}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isScanning ? 'Processing Live Intelligence...' : 'Scan Live Intelligence'}
                  </Button>
                  <div className="text-sm text-gray-400">
                    Last scan: {liveSystemStatus.lastValidation ? new Date(liveSystemStatus.lastValidation).toLocaleString() : 'Never'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-corporate-darkSecondary border-corporate-border">
                <CardHeader>
                  <CardTitle className="text-white">Live Intelligence Stream</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {liveIntelligence.length > 0 ? liveIntelligence.slice(0, 10).map((item: any, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-corporate-dark rounded">
                        <div>
                          <div className="text-white font-medium">{item.platform}</div>
                          <div className="text-xs text-gray-500 mt-1">{item.content?.substring(0, 80)}...</div>
                        </div>
                        <Badge className="bg-green-500 text-white">LIVE</Badge>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <Brain className="h-12 w-12 mx-auto mb-4 text-gray-500" />
                        <h3 className="text-lg font-medium text-gray-300 mb-2">No Live Intelligence</h3>
                        <p className="text-gray-500">Run live intelligence scan to analyze threats</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="threat-analysis">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Live Threat Analysis Engine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
                  <h3 className="text-lg font-medium text-white mb-2">Live Threat Analysis</h3>
                  <p className="text-corporate-lightGray">Real-time threat intelligence processing from verified OSINT sources</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="source-validation">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-cyan-500" />
                  OSINT Source Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Database className="h-12 w-12 mx-auto mb-4 text-corporate-gray" />
                  <h3 className="text-lg font-medium text-white mb-2">Source Validation</h3>
                  <p className="text-corporate-lightGray">Continuous validation of OSINT sources and data integrity</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrity-monitoring">
            <Card className="bg-corporate-darkSecondary border-corporate-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Weapons-Grade Integrity Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={validateSystemIntegrity}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Validate System Integrity
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

export default IntelligenceCorePage;
