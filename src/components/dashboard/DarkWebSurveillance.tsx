
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Eye, Globe } from "lucide-react";
import { ContentAlert } from "@/types/dashboard";

const DarkWebSurveillance = () => {
  const [threats, setThreats] = useState<ContentAlert[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const mockThreats: ContentAlert[] = [
    {
      id: '1',
      platform: 'Dark Web Forum',
      content: 'Leaked corporate credentials found on underground marketplace',
      date: '2024-01-15',
      severity: 'high',
      status: 'new',
      threatType: 'data_leak',
      url: 'https://darkweb-forum.onion/leaked-data',
      sourceType: 'forum',
      confidenceScore: 95,
      sentiment: 'threatening',
      detectedEntities: ['credentials', 'corporate data']
    },
    {
      id: '2',
      platform: 'Tor Network',
      content: 'Coordinated attack planning against company infrastructure',
      date: '2024-01-14',
      severity: 'high',
      status: 'new',
      threatType: 'coordinated_attack',
      url: 'https://tor-site.onion/attack-plans',
      sourceType: 'forum',
      confidenceScore: 88,
      sentiment: 'threatening',
      detectedEntities: ['attack planning', 'infrastructure']
    },
    {
      id: '3',
      platform: 'Underground Market',
      content: 'Bot network targeting company social media accounts',
      date: '2024-01-13',
      severity: 'medium',
      status: 'new',
      threatType: 'bot_network',
      url: 'https://underground-market.onion/bots',
      sourceType: 'marketplace',
      confidenceScore: 75,
      sentiment: 'negative',
      detectedEntities: ['bot network', 'social media']
    },
    {
      id: '4',
      platform: 'Identity Theft Ring',
      content: 'Executive personal information being sold',
      date: '2024-01-12',
      severity: 'high',
      status: 'new',
      threatType: 'identity_theft',
      url: 'https://identity-theft.onion/executive-info',
      sourceType: 'marketplace',
      confidenceScore: 92,
      sentiment: 'threatening',
      detectedEntities: ['executive info', 'personal data']
    }
  ];

  useEffect(() => {
    // Simulate loading threats
    setTimeout(() => {
      setThreats(mockThreats);
    }, 1000);
  }, []);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setThreats(mockThreats);
      setIsScanning(false);
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Dark Web Surveillance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              Monitoring {threats.length} threat sources
            </span>
          </div>
          <Button onClick={handleScan} disabled={isScanning}>
            {isScanning ? 'Scanning...' : 'Scan Now'}
          </Button>
        </div>

        <div className="space-y-3">
          {threats.map((threat) => (
            <div key={threat.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <Badge className={`${getSeverityColor(threat.severity)} text-white`}>
                  {threat.severity.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">{threat.date}</span>
              </div>
              <p className="text-sm font-medium mb-1">{threat.platform}</p>
              <p className="text-xs text-muted-foreground">{threat.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DarkWebSurveillance;
