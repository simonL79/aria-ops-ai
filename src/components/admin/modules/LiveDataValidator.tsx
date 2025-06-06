
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Ban } from 'lucide-react';
import { LiveDataEnforcer, type LiveDataCompliance } from '@/services/ariaCore/liveDataEnforcer';

interface ValidationResult {
  isCompliant: boolean;
  mockDataBlocked: boolean;
  liveDataOnly: boolean;
  simulationDetected: boolean;
  message: string;
}

const LiveDataValidator = () => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    validateSystem();
  }, []);

  const validateSystem = async () => {
    setIsValidating(true);
    try {
      const result = await LiveDataEnforcer.validateLiveDataCompliance();
      
      // Transform LiveDataCompliance to ValidationResult
      const transformedResult: ValidationResult = {
        isCompliant: result.isCompliant,
        mockDataBlocked: !result.simulationDetected,
        liveDataOnly: result.isCompliant,
        simulationDetected: result.simulationDetected,
        message: result.details || (result.isCompliant ? 'System operating with live data' : 'Issues detected with live data compliance')
      };
      
      setValidationResult(transformedResult);
    } catch (error) {
      console.error('Validation failed:', error);
      setValidationResult({
        isCompliant: false,
        mockDataBlocked: false,
        liveDataOnly: false,
        simulationDetected: true,
        message: 'Validation failed - unable to verify system integrity'
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Live Data Validation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isValidating ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-2">Validating live data compliance...</span>
          </div>
        ) : validationResult ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded border">
                <div className="flex items-center gap-2">
                  {validationResult.isCompliant ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium">System Compliance</span>
                </div>
                <p className={`text-sm ${validationResult.isCompliant ? 'text-green-700' : 'text-red-700'}`}>
                  {validationResult.isCompliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded border">
                <div className="flex items-center gap-2">
                  {validationResult.mockDataBlocked ? (
                    <Ban className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium">Mock Data Block</span>
                </div>
                <p className={`text-sm ${validationResult.mockDataBlocked ? 'text-green-700' : 'text-red-700'}`}>
                  {validationResult.mockDataBlocked ? 'ACTIVE' : 'INACTIVE'}
                </p>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-800">{validationResult.message}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <Badge className={validationResult.simulationDetected ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                {validationResult.simulationDetected ? '🚫 SIMULATIONS DETECTED' : '✅ SIMULATION-FREE'}
              </Badge>
              
              <Button variant="outline" size="sm" onClick={validateSystem}>
                Re-validate
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            <p>Click validate to check system compliance</p>
            <Button onClick={validateSystem} className="mt-2">
              Validate System
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveDataValidator;
