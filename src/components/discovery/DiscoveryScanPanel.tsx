
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Search, Eye } from "lucide-react";
import { DiscoveredThreat } from '@/hooks/useDiscoveryScanning';

interface DiscoveryScanPanelProps {
  isScanning: boolean;
  discoveredThreats: DiscoveredThreat[];
  onStartScan: () => void;
}

const DiscoveryScanPanel = ({ isScanning, discoveredThreats, onStartScan }: DiscoveryScanPanelProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Live Zero-Input Discovery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Proactively discover threats and vulnerabilities without requiring specific keywords or targets.
            </p>
            
            <Button 
              onClick={onStartScan}
              disabled={isScanning}
              className="w-full bg-[#247CFF] hover:bg-[#1c63cc] text-white"
            >
              {isScanning ? (
                <>
                  <Eye className="mr-2 h-4 w-4 animate-pulse" />
                  Scanning Live Intelligence Sources...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Start Live Discovery Scan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {discoveredThreats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Live Discovered Threats ({discoveredThreats.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {discoveredThreats.map((threat) => (
                <div key={threat.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">{threat.entityName}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        threat.threatLevel >= 7 ? 'bg-red-100 text-red-800' :
                        threat.threatLevel >= 4 ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        Risk: {threat.threatLevel}/10
                      </span>
                      <span className="text-xs text-gray-500">{threat.platform}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{threat.contextSnippet}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Mentions: {threat.mentionCount}</span>
                    <span>{new Date(threat.timestamp).toLocaleString()}</span>
                  </div>
                  {threat.sourceUrl && (
                    <a 
                      href={threat.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline mt-1 block"
                    >
                      View Source
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiscoveryScanPanel;
