
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Shield, AlertTriangle, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';
import { toast } from 'sonner';

interface ValidationResult {
  isCompliant: boolean;
  mockDataBlocked: boolean;
  liveDataOnly: boolean;
  simulationDetected: boolean;
  message: string;
}

interface DataViolation {
  id: string;
  table: string;
  content: string;
  violation_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detected_at: string;
}

const LiveDataValidator = () => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [violations, setViolations] = useState<DataViolation[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  useEffect(() => {
    runValidation();
  }, []);

  const runValidation = async () => {
    setIsValidating(true);
    try {
      console.log('🔍 A.R.I.A™ Live Data Validator: Starting comprehensive validation');

      const result = await LiveDataEnforcer.validateLiveDataCompliance();
      setValidationResult(result);

      // Check for specific violations
      await detectViolations();

      if (result.isCompliant) {
        toast.success('✅ Live data compliance validated - NO SIMULATIONS');
      } else {
        toast.error('🚫 Data compliance violations detected');
      }
    } catch (error) {
      console.error('Validation failed:', error);
      toast.error('Validation process failed');
    } finally {
      setIsValidating(false);
    }
  };

  const detectViolations = async () => {
    try {
      const violationsData: DataViolation[] = [];

      // Enhanced simulation detection patterns
      const simulationPatterns = [
        { pattern: '%mock%', type: 'mock_data' },
        { pattern: '%test%', type: 'test_data' },
        { pattern: '%demo%', type: 'demo_data' },
        { pattern: '%simulation%', type: 'simulation_data' },
        { pattern: '%sample%', type: 'sample_data' },
        { pattern: '%fake%', type: 'fake_data' },
        { pattern: '%placeholder%', type: 'placeholder_data' },
        { pattern: '%lorem%', type: 'lorem_ipsum' },
        { pattern: '%advanced ai analysis%', type: 'template_response' },
        { pattern: '%target entity%', type: 'generic_placeholder' }
      ];

      // Check scan_results table
      for (const { pattern, type } of simulationPatterns) {
        const { data: scanViolations } = await supabase
          .from('scan_results')
          .select('id, content, platform, created_at')
          .ilike('content', pattern)
          .limit(10);

        if (scanViolations) {
          scanViolations.forEach(violation => {
            violationsData.push({
              id: `scan-${violation.id}`,
              table: 'scan_results',
              content: violation.content.substring(0, 200),
              violation_type: type,
              severity: type.includes('mock') || type.includes('simulation') ? 'critical' : 'high',
              detected_at: violation.created_at
            });
          });
        }
      }

      // Check strategy_responses table
      const { data: strategyViolations } = await supabase
        .from('strategy_responses')
        .select('id, description, entity_name, created_at')
        .or('description.ilike.%mock%,description.ilike.%test%,entity_name.ilike.%undefined%')
        .limit(5);

      if (strategyViolations) {
        strategyViolations.forEach(violation => {
          violationsData.push({
            id: `strategy-${violation.id}`,
            table: 'strategy_responses',
            content: violation.description || 'Undefined entity strategy',
            violation_type: 'strategy_simulation',
            severity: 'high',
            detected_at: violation.created_at
          });
        });
      }

      // Check aria_ops_log for simulation entries
      const { data: opsViolations } = await supabase
        .from('aria_ops_log')
        .select('id, operation_data, module_source, created_at')
        .or('operation_data::text.ilike.%mock%,operation_data::text.ilike.%simulation%')
        .limit(5);

      if (opsViolations) {
        opsViolations.forEach(violation => {
          violationsData.push({
            id: `ops-${violation.id}`,
            table: 'aria_ops_log',
            content: JSON.stringify(violation.operation_data).substring(0, 200),
            violation_type: 'operational_simulation',
            severity: 'medium',
            detected_at: violation.created_at
          });
        });
      }

      setViolations(violationsData);
    } catch (error) {
      console.error('Failed to detect violations:', error);
    }
  };

  const cleanupViolations = async () => {
    setIsCleaningUp(true);
    try {
      let cleanedCount = 0;

      // Clean up scan_results violations
      const scanViolations = violations.filter(v => v.table === 'scan_results');
      for (const violation of scanViolations) {
        const scanId = violation.id.replace('scan-', '');
        const { error } = await supabase
          .from('scan_results')
          .delete()
          .eq('id', scanId);

        if (!error) cleanedCount++;
      }

      // Clean up strategy_responses violations
      const strategyViolations = violations.filter(v => v.table === 'strategy_responses');
      for (const violation of strategyViolations) {
        const strategyId = violation.id.replace('strategy-', '');
        const { error } = await supabase
          .from('strategy_responses')
          .delete()
          .eq('id', strategyId);

        if (!error) cleanedCount++;
      }

      // Clean up aria_ops_log violations
      const opsViolations = violations.filter(v => v.table === 'aria_ops_log');
      for (const violation of opsViolations) {
        const opsId = violation.id.replace('ops-', '');
        const { error } = await supabase
          .from('aria_ops_log')
          .delete()
          .eq('id', opsId);

        if (!error) cleanedCount++;
      }

      // Log cleanup operation
      await supabase.from('aria_ops_log').insert({
        operation_type: 'data_cleanup',
        module_source: 'live_data_validator',
        success: true,
        operation_data: {
          violations_cleaned: cleanedCount,
          cleanup_timestamp: new Date().toISOString(),
          enforcer_action: 'simulation_data_removal'
        }
      });

      toast.success(`✅ Cleaned ${cleanedCount} data violations - Live data compliance restored`);
      
      // Re-run validation
      await runValidation();
    } catch (error) {
      console.error('Cleanup failed:', error);
      toast.error('Data cleanup failed');
    } finally {
      setIsCleaningUp(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const complianceScore = validationResult ? 
    (validationResult.isCompliant ? 100 : violations.length > 0 ? Math.max(0, 100 - violations.length * 10) : 50) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Eye className="h-6 w-6 text-green-600" />
            Live Data Validator
          </h2>
          <p className="text-muted-foreground">Ensures 100% live intelligence - NO SIMULATIONS</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={runValidation} disabled={isValidating} variant="outline">
            <Shield className={`h-4 w-4 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
            {isValidating ? 'Validating...' : 'Run Validation'}
          </Button>
          {violations.length > 0 && (
            <Button 
              onClick={cleanupViolations} 
              disabled={isCleaningUp}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className={`h-4 w-4 mr-2 ${isCleaningUp ? 'animate-spin' : ''}`} />
              {isCleaningUp ? 'Cleaning...' : 'Clean Violations'}
            </Button>
          )}
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${complianceScore === 100 ? 'text-green-600' : 'text-red-600'}`}>
              {complianceScore}%
            </div>
            <Progress value={complianceScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Data Only</CardTitle>
            {validationResult?.liveDataOnly ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <Badge className={validationResult?.liveDataOnly ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
              {validationResult?.liveDataOnly ? 'VERIFIED' : 'VIOLATIONS'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">Intelligence source validation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Simulation Detection</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${validationResult?.simulationDetected ? 'text-red-600' : 'text-green-600'}`}>
              {validationResult?.simulationDetected ? 'DETECTED' : 'CLEAN'}
            </div>
            <p className="text-xs text-muted-foreground">Mock/test data scanning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations Found</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${violations.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {violations.length}
            </div>
            <p className="text-xs text-muted-foreground">Require immediate cleanup</p>
          </CardContent>
        </Card>
      </div>

      {/* Validation Status */}
      {validationResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validationResult.isCompliant ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              Validation Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg ${validationResult.isCompliant ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-medium ${validationResult.isCompliant ? 'text-green-800' : 'text-red-800'}`}>
                {validationResult.message}
              </p>
              <div className="mt-2 text-sm text-muted-foreground">
                <div>✅ Mock Data Blocked: {validationResult.mockDataBlocked ? 'YES' : 'NO'}</div>
                <div>🔍 Live Data Only: {validationResult.liveDataOnly ? 'YES' : 'NO'}</div>
                <div>⚠️ Simulation Detected: {validationResult.simulationDetected ? 'YES' : 'NO'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Violations List */}
      {violations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Data Compliance Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {violations.map((violation) => (
                <div key={violation.id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getSeverityColor(violation.severity)}>
                          {violation.severity.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{violation.table}</span>
                        <span className="text-sm text-muted-foreground">{violation.violation_type}</span>
                      </div>
                      <p className="text-sm text-red-800 mb-1">
                        {violation.content}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Detected: {new Date(violation.detected_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LiveDataValidator;
