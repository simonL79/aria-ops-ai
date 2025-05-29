
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { SystemInitializer, SystemInitializationResult } from '@/services/systemInitializer';
import { toast } from 'sonner';

const SystemInitializationPanel = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initResult, setInitResult] = useState<SystemInitializationResult | null>(null);

  const handleInitializeSystem = async () => {
    setIsInitializing(true);
    try {
      const result = await SystemInitializer.initializeSystem();
      setInitResult(result);
      
      if (result.initialized) {
        toast.success('A.R.I.A™ System initialized successfully');
      } else {
        toast.error('System initialization failed');
      }
    } catch (error) {
      console.error('Initialization error:', error);
      toast.error('System initialization failed');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          A.R.I.A™ System Initialization
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Initialize the A.R.I.A™ system for live operations. This will set up proper configuration,
          create monitoring status entries, and seed the system with real operational data.
        </div>

        <Button 
          onClick={handleInitializeSystem} 
          disabled={isInitializing}
          className="w-full"
        >
          {isInitializing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Initializing System...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Initialize A.R.I.A™ for Live Operations
            </>
          )}
        </Button>

        {initResult && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {initResult.initialized ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    System Initialized
                  </Badge>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <Badge variant="destructive">
                    Initialization Failed
                  </Badge>
                </>
              )}
            </div>

            {initResult.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600">Issues:</h4>
                {initResult.issues.map((issue, index) => (
                  <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                    {issue}
                  </div>
                ))}
              </div>
            )}

            {initResult.warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-yellow-600">Warnings:</h4>
                {initResult.warnings.map((warning, index) => (
                  <div key={index} className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                    {warning}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemInitializationPanel;
