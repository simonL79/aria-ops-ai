
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";

interface EntityDiscoveryPanelProps {
  clientData: any;
  entityData: any[];
  onProceed: () => void;
  isProcessing: boolean;
}

const EntityDiscoveryPanel = ({ clientData, entityData, onProceed, isProcessing }: EntityDiscoveryPanelProps) => {
  const hasDiscoveryData = entityData.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Search className="h-12 w-12 text-corporate-accent mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Live Entity Discovery</h3>
        <p className="text-corporate-lightGray">
          Discovering live intelligence for {clientData?.entities?.length || 0} entities using A.R.I.A™ OSINT
        </p>
      </div>

      {!hasDiscoveryData ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientData?.entities?.map((entity: any, index: number) => (
              <Card key={index} className="bg-corporate-dark border-corporate-border">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{entity.name}</h4>
                      <Badge variant="outline">{entity.type}</Badge>
                    </div>
                    <div className="text-xs text-corporate-lightGray">Ready for discovery</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-corporate-dark border border-corporate-border rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Live Discovery Process</h4>
            <ul className="text-sm text-corporate-lightGray space-y-1">
              <li>• Reddit RSS feed scanning</li>
              <li>• UK News live monitoring</li>
              <li>• Social media intelligence gathering</li>
              <li>• Web presence mapping</li>
              <li>• Risk indicator detection</li>
            </ul>
          </div>

          <Button 
            onClick={onProceed}
            disabled={isProcessing}
            className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            {isProcessing ? 'Discovering Live Intelligence...' : 'Start Live Entity Discovery'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {entityData.map((entity, index) => (
              <Card key={index} className="bg-corporate-dark border-corporate-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-white">{entity.name}</span>
                    <Badge variant={entity.discoveryScore > 0.7 ? 'default' : entity.discoveryScore > 0.4 ? 'secondary' : 'outline'}>
                      Discovery Score: {(entity.discoveryScore * 100).toFixed(0)}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-corporate-lightGray">Live Intelligence Items</span>
                      <span className="font-medium text-white">{entity.liveIntelligence?.length || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-corporate-lightGray">Risk Indicators</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{entity.riskIndicators || 0}</span>
                        {(entity.riskIndicators || 0) > 0 && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      </div>
                    </div>

                    {entity.liveIntelligence && entity.liveIntelligence.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-white">Recent Intelligence</h5>
                        {entity.liveIntelligence.slice(0, 3).map((intel: any, intelIndex: number) => (
                          <div key={intelIndex} className="p-2 bg-corporate-darkSecondary rounded text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" className="text-xs">{intel.platform}</Badge>
                              <Badge variant={intel.severity === 'high' ? 'destructive' : intel.severity === 'medium' ? 'secondary' : 'outline'}>
                                {intel.severity}
                              </Badge>
                            </div>
                            <p className="text-corporate-lightGray truncate">{intel.content}</p>
                            {intel.url && (
                              <a href={intel.url} target="_blank" rel="noopener noreferrer" className="text-corporate-accent hover:underline flex items-center gap-1 mt-1">
                                View Source <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ))}
                        {entity.liveIntelligence.length > 3 && (
                          <p className="text-xs text-corporate-lightGray">
                            +{entity.liveIntelligence.length - 3} more intelligence items...
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-2 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="text-green-400">Live entity discovery completed using real OSINT sources</span>
          </div>

          <Button 
            onClick={() => window.location.hash = '#threat-assessment'}
            className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            Proceed to Live Threat Assessment
          </Button>
        </div>
      )}
    </div>
  );
};

export default EntityDiscoveryPanel;
