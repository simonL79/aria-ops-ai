
import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveDataValidator, LiveDataValidationResult } from '@/services/liveDataValidator';

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
  }, []);

  const validateSystem = async () => {
    setIsValidating(true);
    try {
      const result = await LiveDataValidator.validateLiveIntegrity();
      setValidationResult(result);
      
      if (enforceStrict && !result.isValid) {
        console.error('🚨 BLOCKING ACCESS: System failed live data validation');
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
          <h2 className="text-xl font-semibold">Validating A.R.I.A™ Live Data Integrity</h2>
          <p className="text-muted-foreground">Ensuring production-grade standards...</p>
        </div>
      </div>
    );
  }

  if (!validationResult) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Validation Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Unable to validate system integrity. Please check your connection and try again.
            </p>
            <Button onClick={validateSystem} className="w-full">
              Retry Validation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (enforceStrict && !validationResult.isValid) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Production Integrity Check Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                A.R.I.A™ detected critical issues that prevent safe operation:
              </p>
              
              <div className="space-y-2">
                {validationResult.errors.map((error, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded">
                    <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Checks: {validationResult.passedChecks}/{validationResult.totalChecks} passed
                </span>
                <Button onClick={validateSystem} variant="outline">
                  Re-validate System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // System is valid - render children with optional validation status
  return (
    <div>
      {validationResult.warnings.length > 0 && (
        <div className="mb-4">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    System operational with {validationResult.warnings.length} warning(s)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? 'Hide' : 'Show'} Details
                </Button>
              </div>
              
              {showDetails && (
                <div className="mt-3 space-y-1">
                  {validationResult.warnings.map((warning, index) => (
                    <p key={index} className="text-xs text-yellow-700">• {warning}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default LiveDataGuard;
