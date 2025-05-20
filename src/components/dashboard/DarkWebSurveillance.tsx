
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Globe, AlertTriangle, UserCheck, Users, Database, Bot, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ContentAlert } from "@/types/dashboard";
import { notifyAlertListeners } from "@/services/aiScraping/mockScanner";

interface ThreatDetection {
  id: string;
  type: 'bot_network' | 'data_leak' | 'coordinated_attack' | 'identity_theft';
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  platform: string;
}

const DarkWebSurveillance = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [surveillanceCoverage, setSurveillanceCoverage] = useState(78);
  const [activeScanInterval, setActiveScanInterval] = useState<number | null>(null);
  const navigate = useNavigate();
  
  const [threatDetections, setThreatDetections] = useState<ThreatDetection[]>([
    {
      id: '1',
      type: 'data_leak',
      description: 'Customer database hash found on dark web marketplace',
      severity: 'critical',
      timestamp: '2 days ago',
      platform: 'Dark marketplace'
    },
    {
      id: '2',
      type: 'coordinated_attack',
      description: 'Coordinated negative review campaign planning detected',
      severity: 'high',
      timestamp: '12 hours ago',
      platform: 'Private forum'
    },
    {
      id: '3',
      type: 'bot_network',
      description: 'Bot network discussing brand targeting',
      severity: 'medium',
      timestamp: '3 days ago',
      platform: 'Telegram channel'
    }
  ]);

  // Generate a random threat detection
  const generateRandomThreat = useCallback((): ThreatDetection => {
    const types: Array<'bot_network' | 'data_leak' | 'coordinated_attack' | 'identity_theft'> = 
      ['bot_network', 'data_leak', 'coordinated_attack', 'identity_theft'];
      
    const severities: Array<'critical' | 'high' | 'medium' | 'low'> = 
      ['critical', 'high', 'medium', 'low'];
      
    const platforms = [
      'Dark marketplace', 'Private forum', 'Telegram channel', 
      'Discord server', 'Onion site', 'IRC channel'
    ];
    
    const descriptions = [
      'New database with customer emails discovered for sale',
      'Discussion about targeting company reputation found',
      'Coordinated attack planning detected against brand',
      'Employee credentials being traded on marketplace',
      'Company internal documents leaked on forum',
      'Threat actor recruiting others to target brand'
    ];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    return {
      id: `threat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      severity,
      timestamp: 'Just now',
      platform: platforms[Math.floor(Math.random() * platforms.length)]
    };
  }, []);

  // Function to create an alert from a threat detection
  const createAlertFromThreat = useCallback((threat: ThreatDetection): ContentAlert => {
    return {
      id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      platform: "Dark Web - " + threat.platform,
      content: `DARK WEB ALERT: ${threat.description}`,
      date: threat.timestamp,
      severity: threat.severity === 'critical' || threat.severity === 'high' ? 'high' : 
              threat.severity === 'medium' ? 'medium' : 'low',
      status: 'new',
      threatType: threat.type
    };
  }, []);

  // Automatically start scanning on component mount
  useEffect(() => {
    handleScanDarkWeb();
    
    // Set up automatic scanning interval
    const interval = window.setInterval(() => {
      const shouldAutoScan = !isScanning && Math.random() > 0.7; // 30% chance to auto scan
      if (shouldAutoScan) {
        handleScanDarkWeb(true); // Auto scan is silent
      }
    }, 30000); // Check every 30 seconds
    
    setActiveScanInterval(interval);
    
    return () => {
      if (activeScanInterval) {
        window.clearInterval(activeScanInterval);
      }
    };
  }, []);
  
  // Detect threats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // 40% chance of a new dark web threat being detected
      if (Math.random() > 0.6) {
        const newThreat = generateRandomThreat();
        setThreatDetections(prev => [newThreat, ...prev.slice(0, 4)]);
        
        // Create an alert for high severity threats
        if (newThreat.severity === 'critical' || newThreat.severity === 'high') {
          const newAlert = createAlertFromThreat(newThreat);
          notifyAlertListeners(newAlert);
          
          toast.error("Critical Dark Web Alert", {
            description: newThreat.description,
            action: {
              label: "View Details",
              onClick: () => {
                // Store alert in session storage for engagement hub
                sessionStorage.setItem('selectedAlert', JSON.stringify(newAlert));
                navigate("/dashboard/engagement?alert=" + newAlert.id);
              }
            }
          });
        }
        
        // Periodically adjust surveillance coverage to simulate changes
        setSurveillanceCoverage(prev => {
          const change = Math.random() > 0.5 ? 1 : -1;
          const newValue = prev + change;
          return Math.min(Math.max(newValue, 60), 95); // Keep between 60-95%
        });
      }
    }, 20000); // Check every 20 seconds for more activity
    
    return () => clearInterval(interval);
  }, [navigate, generateRandomThreat, createAlertFromThreat]);
  
  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'bot_network':
        return <Bot className="h-5 w-5 text-orange-500" />;
      case 'data_leak':
        return <Database className="h-5 w-5 text-red-500" />;
      case 'coordinated_attack':
        return <Users className="h-5 w-5 text-amber-500" />;
      case 'identity_theft':
        return <UserCheck className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      case 'low':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  const handleScanDarkWeb = (silent = false) => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate scanning with progress updates
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 15);
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    
    // Simulate scanning completion
    setTimeout(() => {
      clearInterval(progressInterval);
      setScanProgress(100);
      
      setTimeout(() => {
        const newThreat = generateRandomThreat();
        newThreat.severity = Math.random() > 0.4 ? 'high' : 'critical'; // Force high/critical severity
        newThreat.timestamp = 'Just now';
        
        setThreatDetections(prev => [newThreat, ...prev.slice(0, 4)]);
        setIsScanning(false);
        setScanComplete(true);
        
        // Create an alert for this threat
        const newAlert = createAlertFromThreat(newThreat);
        notifyAlertListeners(newAlert);
        
        if (!silent) {
          toast.success("Dark web scan complete", {
            description: `ALERT: ${newThreat.description}`,
            action: {
              label: "View Details",
              onClick: () => {
                // Store alert in session storage for engagement hub
                sessionStorage.setItem('selectedAlert', JSON.stringify(newAlert));
                navigate("/dashboard/engagement?alert=" + newAlert.id);
              }
            }
          });
        }
        
        // Reset scan complete after a delay
        setTimeout(() => setScanComplete(false), 3000);
      }, 500);
    }, 2500);
  };

  const handleViewThreat = (threat: ThreatDetection) => {
    const alert = createAlertFromThreat(threat);
    
    // Store in session storage for engagement hub
    sessionStorage.setItem('selectedAlert', JSON.stringify(alert));
    
    // Navigate to engagement hub
    navigate(`/dashboard/engagement?alert=${alert.id}`);
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Dark Web Surveillance</CardTitle>
        <Badge variant="outline" className="bg-gray-900 text-white animate-pulse">Live</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-gray-50 border rounded-md">
          <div>
            <div className="font-medium">Threat Detection Status</div>
            <div className="text-sm text-muted-foreground">Last scan: {threatDetections[0]?.timestamp || "4 hours ago"}</div>
          </div>
          <Badge variant={scanComplete ? "default" : "secondary"} className={scanComplete ? "animate-pulse bg-red-500" : ""}>
            {threatDetections.filter(t => t.severity === 'critical' || t.severity === 'high').length} Active Threats
          </Badge>
        </div>
        
        <div className="space-y-3">
          {threatDetections.slice(0, 3).map((threat) => (
            <div key={threat.id} className="flex items-start gap-3 p-3 border rounded-md hover:bg-gray-50">
              <div className="mt-1">
                {getThreatIcon(threat.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="font-medium">{threat.type.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
                  <Badge className={getSeverityColor(threat.severity)}>
                    {threat.severity.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm mt-1">{threat.description}</div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>{threat.platform}</span>
                  <span>{threat.timestamp}</span>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button 
                    size="sm" 
                    variant={threat.severity === 'critical' || threat.severity === 'high' ? "destructive" : "outline"}
                    className="text-xs h-7"
                    onClick={() => handleViewThreat(threat)}
                  >
                    {threat.severity === 'critical' || threat.severity === 'high' ? "View Now" : "Analyze"} <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Surveillance Coverage</span>
            <span>{surveillanceCoverage}%</span>
          </div>
          <Progress value={surveillanceCoverage} max={100} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">
            Monitoring 6 dark web forums, 4 marketplaces, and 12 Telegram channels
          </p>
        </div>
        
        {isScanning ? (
          <div className="space-y-2">
            <Progress value={scanProgress} max={100} className="h-2" />
            <Button 
              disabled
              variant="outline"
              className="w-full border-dashed"
            >
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Scanning Dark Web... {scanProgress}%
              </span>
            </Button>
          </div>
        ) : (
          <Button 
            onClick={() => handleScanDarkWeb()}
            variant="outline"
            className={`w-full border-dashed ${scanComplete ? "bg-green-50 border-green-300" : ""}`}
          >
            {scanComplete ? (
              <span className="flex items-center gap-2 text-green-600">
                <Globe className="h-4 w-4" />
                Scan Complete - New Threats Found
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Scan Dark Web Now
              </span>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DarkWebSurveillance;
