
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wifi, Clock, Shield, Server, AlertCircle, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { getMonitoringStatus } from "@/services/monitoring";
import { getMonitoringStatus as getAiScanningStatus } from "@/services/aiScraping/mockScanner";
import { useAuth } from "@/hooks/useAuth";
import { useRbac } from "@/hooks/useRbac";

interface SystemStatusIndicatorProps {
  isLive?: boolean;
}

const SystemStatusIndicator = ({ isLive = true }: SystemStatusIndicatorProps) => {
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [statsData, setStatsData] = useState({
    platformsMonitored: 0,
    threatModelsActive: 0,
    activeSources: 0,
    lastScanTime: new Date().toLocaleTimeString()
  });
  
  const { user } = useAuth();
  const { roles } = useRbac();

  // Update stats periodically for real-time effect
  useEffect(() => {
    if (!isLive) return;

    const updateStats = async () => {
      try {
        const monitoringStatus = await getMonitoringStatus();
        const aiScanningStatus = await getAiScanningStatus();
        
        setStatsData({
          platformsMonitored: monitoringStatus?.sources || 0,
          threatModelsActive: 4, // Simplified for demo - would come from real threat models count
          activeSources: aiScanningStatus?.platforms || 0,
          lastScanTime: monitoringStatus?.lastRun ? new Date(monitoringStatus.lastRun).toLocaleTimeString() : 'N/A'
        });
        
        setLastRefresh(new Date());
      } catch (error) {
        console.error("Error updating system status:", error);
      }
    };
    
    // Update immediately
    updateStats();
    
    // Then set up interval for continuous updates
    const interval = setInterval(() => {
      updateStats();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [isLive]);

  const isAdmin = roles.includes('admin');
  const isStaff = roles.includes('staff');

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-sm">System Status</h3>
          <div className="flex gap-2">
            {isLive ? (
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 animate-pulse">
                <Wifi className="h-3 w-3 mr-1" /> LIVE
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                <AlertCircle className="h-3 w-3 mr-1" /> OFFLINE
              </Badge>
            )}
            
            {isAdmin && (
              <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
                <Shield className="h-3 w-3 mr-1" /> ADMIN
              </Badge>
            )}
            
            {isStaff && !isAdmin && (
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                <UserCheck className="h-3 w-3 mr-1" /> STAFF
              </Badge>
            )}
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center">
              <Shield className="h-3.5 w-3.5 mr-1.5" /> Platforms Monitored
            </span>
            <span className="font-medium">{statsData.platformsMonitored}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center">
              <Server className="h-3.5 w-3.5 mr-1.5" /> Threat Models Active
            </span>
            <span className="font-medium">{statsData.threatModelsActive}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground flex items-center">
              <Wifi className="h-3.5 w-3.5 mr-1.5" /> Active Sources
            </span>
            <span className="font-medium">{statsData.activeSources}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Last Scan
            </span>
            <span>{statsData.lastScanTime}</span>
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Last Update
            </span>
            <span>{lastRefresh.toLocaleTimeString()}</span>
          </div>
          
          {user && (
            <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-gray-100">
              Logged in as: {user.email}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusIndicator;
