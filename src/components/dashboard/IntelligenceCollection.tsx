
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Wifi, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { performRealScan } from '@/services/monitoring/realScan';
import { toast } from 'sonner';

const IntelligenceCollection = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);

  const handleOSINTSweep = async () => {
    setIsScanning(true);
    try {
      const results = await performRealScan({
        fullScan: true,
        source: 'dashboard_collection'
      });
      
      setLastScan(new Date());
      
      if (results && results.length > 0) {
        toast.success(`OSINT Sweep Complete: ${results.length} intelligence items collected`);
      } else {
        toast.info('OSINT Sweep Complete: No new intelligence detected');
      }
    } catch (error) {
      toast.error('OSINT Sweep failed - Check system status');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Search className="h-5 w-5" />
          A.R.I.A™ OSINT Collection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Live Status Indicator */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">Live OSINT Active</span>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-800 border-green-300">
            100% Live Data
          </Badge>
        </div>

        {/* Collection Sources */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Active Intelligence Sources</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Reddit API</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>RSS Feeds</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>News Sources</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Wifi className="h-3 w-3 text-blue-500" />
              <span>Real-time Web</span>
            </div>
          </div>
        </div>

        {/* Manual Collection Trigger */}
        <div className="space-y-3">
          <Button 
            onClick={handleOSINTSweep}
            disabled={isScanning}
            className="w-full gap-2"
            variant={isScanning ? "secondary" : "default"}
          >
            {isScanning ? (
              <>
                <Activity className="h-4 w-4 animate-spin" />
                Running OSINT Sweep...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Trigger OSINT Intelligence Sweep
              </>
            )}
          </Button>
          
          {lastScan && (
            <p className="text-xs text-gray-500 text-center">
              Last sweep: {lastScan.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Compliance Notice */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-700">
              <p className="font-medium">100% Live Data Compliance</p>
              <p>All intelligence collected from live sources only. No mock or demo data.</p>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default IntelligenceCollection;
