
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader, RefreshCw } from "lucide-react";
import { MonitoringSource, ScanResult } from './types';

interface SourceCardProps {
  source: MonitoringSource;
  onToggle: (id: string, enabled: boolean) => void;
  onScan: (id: string) => void;
  isLoading: boolean;
  scanResult?: ScanResult;
  getStatusBadge: (status: string) => React.ReactNode;
}

const SourceCard: React.FC<SourceCardProps> = ({
  source,
  onToggle,
  onScan,
  isLoading,
  scanResult,
  getStatusBadge
}) => {
  const handleScanClick = () => {
    console.log(`Triggering scan for source: ${source.id}`);
    onScan(source.id);
  };

  const handleToggleChange = (checked: boolean) => {
    console.log(`Toggling source ${source.id} to ${checked ? 'enabled' : 'disabled'}`);
    onToggle(source.id, checked);
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="bg-gray-100 p-2 rounded-md">
            {source.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{source.name}</h3>
              {getStatusBadge(source.status)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {source.description}
            </p>
            {source.lastScan && (
              <p className="text-xs text-muted-foreground mt-2">
                Last scan: {source.lastScan}
              </p>
            )}
            {scanResult && (
              <div className="mt-2 text-xs">
                <span className="text-green-600">
                  Found {scanResult.matches_found || 0} threats, processed {scanResult.processed || 0}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {source.requiresSetup ? (
            <Button size="sm" variant="outline" disabled>
              Setup Required
            </Button>
          ) : source.enabled && !source.requiresSetup && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleScanClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-1 hidden sm:inline">Scan</span>
            </Button>
          )}
          
          <Switch 
            checked={source.enabled}
            onCheckedChange={handleToggleChange}
            disabled={source.requiresSetup}
          />
        </div>
      </div>
      
      {source.requiresSetup && (
        <Alert className="mt-3">
          <AlertDescription>
            This source requires API credentials and additional setup. 
            Contact support to enable this monitoring source.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SourceCard;
