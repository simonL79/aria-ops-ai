
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, AlertTriangle, UserCheck, Users, Database, Bot } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

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
  
  const threatDetections: ThreatDetection[] = [
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
  ];
  
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
  
  const handleScanDarkWeb = () => {
    setIsScanning(true);
    
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      toast.success("Dark web scan complete", {
        description: "No new threats detected in this scan"
      });
    }, 2500);
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Dark Web Surveillance</CardTitle>
        <Badge variant="outline" className="bg-gray-900 text-white">Classified</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-gray-50 border rounded-md">
          <div>
            <div className="font-medium">Threat Detection Status</div>
            <div className="text-sm text-muted-foreground">Last scan: 4 hours ago</div>
          </div>
          <Badge variant="secondary">3 Active Threats</Badge>
        </div>
        
        <div className="space-y-3">
          {threatDetections.map((threat) => (
            <div key={threat.id} className="flex items-start gap-3 p-3 border rounded-md">
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
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium">Surveillance Coverage</span>
            <span>78%</span>
          </div>
          <Progress value={78} max={100} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">
            Monitoring 6 dark web forums, 4 marketplaces, and 12 Telegram channels
          </p>
        </div>
        
        <Button 
          onClick={handleScanDarkWeb}
          disabled={isScanning}
          variant="outline"
          className="w-full border-dashed"
        >
          {isScanning ? (
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4 animate-pulse" />
              Scanning Dark Web...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Scan Dark Web Now
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DarkWebSurveillance;
