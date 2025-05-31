
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Archive, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AriaCommandCenter = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCommand = async (command: string) => {
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.info('Command center has been archived. Use Genesis Sentinel for system commands.');
    } catch (error) {
      console.error('Command execution failed:', error);
      toast.error('Command center is archived');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-red-500/20 bg-gradient-to-r from-red-900/10 to-orange-900/10">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Archive className="h-6 w-6 text-red-500" />
            ARIA Command Center
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              Archived
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Command Center Retired
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              The ARIA Command Center has been archived. Advanced command and control 
              capabilities are now integrated into Genesis Sentinel.
            </p>
          </div>

          {/* Legacy Interface (Disabled) */}
          <Card className="bg-[#1C1C1E]/50 border-red-500/10">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleCommand('system_status')}
                  disabled={isProcessing}
                  className="bg-gray-700 text-gray-400 hover:bg-gray-600"
                >
                  System Status
                </Button>
                <Button
                  onClick={() => handleCommand('threat_scan')}
                  disabled={isProcessing}
                  className="bg-gray-700 text-gray-400 hover:bg-gray-600"
                >
                  Threat Scan
                </Button>
                <Button
                  onClick={() => handleCommand('deploy_countermeasures')}
                  disabled={isProcessing}
                  className="bg-gray-700 text-gray-400 hover:bg-gray-600"
                >
                  Deploy Countermeasures
                </Button>
                <Button
                  onClick={() => handleCommand('emergency_response')}
                  disabled={isProcessing}
                  className="bg-gray-700 text-gray-400 hover:bg-gray-600"
                >
                  Emergency Response
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Archive className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-blue-400 font-medium mb-1">Advanced Commands Available</h4>
                  <p className="text-sm text-gray-300">
                    Access next-generation command and control capabilities through Genesis Sentinel.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/admin/genesis-sentinel')}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                <span>Go to Genesis Sentinel</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AriaCommandCenter;
