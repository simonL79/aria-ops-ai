
import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, CheckCircle, Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';

interface LiveDataValidationResult {
  isCompliant: boolean;
  mockDataBlocked: boolean;
  liveDataOnly: boolean;
  simulationDetected: boolean;
  message: string;
}

interface LiveDataGuardProps {
  children: React.ReactNode;
  enforceStrict?: boolean;
}

export const LiveDataGuard = ({ children, enforceStrict = true }: LiveDataGuardProps) => {
  const [validationResult, setValidationResult] = useState<LiveDataValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    validateSystem();
    // Re-validate every 30 seconds
    const interval = setInterval(validateSystem, 30000);
    return () => clearInterval(interval);
  }, []);

  const validateSystem = async () => {
    setIsValidating(true);
    try {
      const result = await LiveDataEnforcer.validateLiveDataCompliance();
      setValidationResult(result);
      
      if (result.simulationDetected) {
        console.error('🚨 WEAPONS-GRADE ALERT: Simulation detected in live system');
      }
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">🔍 A.R.I.A™ Live Intelligence Validation</h2>
          <p className="text-muted-foreground">Scanning for simulations and enforcing live-only operations...</p>
          <Badge className="mt-2 bg-red-100 text-red-800">ZERO SIMULATION TOLERANCE</Badge>
        </div>
      </div>
    );
  }

  if (!validationResult) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md border-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Critical Validation Failure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              A.R.I.A™ Intelligence Core validation failed. System integrity cannot be verified.
            </p>
            <Button onClick={validateSystem} className="w-full bg-red-600 hover:bg-red-700">
              Emergency Re-Validation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (enforceStrict && validationResult.simulationDetected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl border-red-500 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-500" />
              🚨 WEAPONS-GRADE ALERT: SIMULATION DETECTED
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-red-100 border border-red-300 rounded">
                <p className="text-red-800 font-bold">
                  ⚠️ CRITICAL SECURITY BREACH: Simulation/Mock data detected in live intelligence system
                </p>
                <p className="text-red-700 text-sm mt-2">
                  A.R.I.A™ operates under ZERO SIMULATION TOLERANCE policy. All simulations are permanently blocked.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center gap-2">
                    <Ban className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800">Live Data Status</span>
                  </div>
                  <p className="text-red-700 text-sm">
                    {validationResult.liveDataOnly ? 'COMPROMISED' : 'CRITICAL FAILURE'}
                  </p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="font-medium text-red-800">Simulation Block</span>
                  </div>
                  <p className="text-red-700 text-sm">
                    {validationResult.mockDataBlocked ? 'ACTIVE' : 'FAILED'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge variant="destructive" className="bg-red-600">
                  WEAPONS-GRADE SECURITY BREACH
                </Badge>
                <Button onClick={validateSystem} variant="destructive">
                  Emergency System Cleanup
                </Button>
              </div>
              
              <p className="text-xs text-red-600">
                System access blocked until all simulations are eliminated and live data compliance is restored.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // System is compliant - render with enhanced monitoring
  return (
    <div>
      <div className="mb-4">
        <Card className={`border-2 ${validationResult.isCompliant ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {validationResult.isCompliant ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                <div>
                  <span className={`font-medium ${validationResult.isCompliant ? 'text-green-800' : 'text-yellow-800'}`}>
                    🔍 A.R.I.A™ Live Intelligence Status
                  </span>
                  <p className={`text-xs ${validationResult.isCompliant ? 'text-green-700' : 'text-yellow-700'}`}>
                    {validationResult.message}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={validationResult.simulationDetected ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                  {validationResult.simulationDetected ? '🚫 SIMULATIONS DETECTED' : '✅ SIMULATION-FREE'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? 'Hide' : 'Show'} Details
                </Button>
              </div>
            </div>
            
            {showDetails && (
              <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                <div className="p-2 bg-white rounded border">
                  <span className="font-medium">Live Data Only:</span>
                  <p className={validationResult.liveDataOnly ? 'text-green-600' : 'text-red-600'}>
                    {validationResult.liveDataOnly ? '✅ ENFORCED' : '❌ COMPROMISED'}
                  </p>
                </div>
                <div className="p-2 bg-white rounded border">
                  <span className="font-medium">Mock Block:</span>
                  <p className={validationResult.mockDataBlocked ? 'text-green-600' : 'text-red-600'}>
                    {validationResult.mockDataBlocked ? '✅ ACTIVE' : '❌ FAILED'}
                  </p>
                </div>
                <div className="p-2 bg-white rounded border">
                  <span className="font-medium">System Status:</span>
                  <p className={validationResult.isCompliant ? 'text-green-600' : 'text-red-600'}>
                    {validationResult.isCompliant ? '✅ SECURE' : '❌ BREACH'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {children}
    </div>
  );
};

export default LiveDataGuard;
