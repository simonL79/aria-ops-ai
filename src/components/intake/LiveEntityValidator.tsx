
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Globe, CheckCircle, AlertTriangle, RefreshCw, Shield, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  sources: string[];
  details: {
    googleResults: number;
    redditMentions: number;
    socialPresence: boolean;
    lastUpdated: string;
  };
  osintData?: {
    threats: any[];
    sentiment: number;
    riskScore: number;
  };
}

interface LiveEntityValidatorProps {
  entityName: string;
  onValidation: (result: ValidationResult) => void;
  enableOSINT?: boolean;
}

export const LiveEntityValidator = ({ entityName, onValidation, enableOSINT = false }: LiveEntityValidatorProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [autoValidated, setAutoValidated] = useState(false);

  // Auto-validate when entity name changes (debounced)
  useEffect(() => {
    if (entityName && entityName.length > 2 && !autoValidated) {
      const timer = setTimeout(() => {
        performValidation();
        setAutoValidated(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [entityName, autoValidated]);

  const performValidation = async () => {
    if (!entityName || entityName.length < 2) return;

    setIsValidating(true);
    try {
      console.log(`🔍 A.R.I.A™ Live Entity Validation: ${entityName}`);
      
      // Call live validation edge function
      const { data, error } = await supabase.functions.invoke('live-entity-validator', {
        body: {
          entityName: entityName,
          validationType: enableOSINT ? 'osint_scan' : 'entity_validation',
          platforms: ['google', 'reddit', 'social']
        }
      });
      
      if (error) {
        console.error('Live validation error:', error);
        throw new Error('Live validation failed');
      }
      
      if (data?.success && data?.result) {
        const result = data.result;
        setValidationResult(result);
        onValidation(result);
        
        if (result.isValid) {
          toast.success('Entity validated with live data', {
            description: `Found across ${result.sources.length} sources with ${Math.round(result.confidence * 100)}% confidence`
          });
          
          if (enableOSINT && result.osintData) {
            const threatsFound = result.osintData.threats.length;
            if (threatsFound > 0) {
              toast.warning(`OSINT scan complete: ${threatsFound} threats detected`, {
                description: `Risk score: ${Math.round(result.osintData.riskScore * 100)}%`
              });
            }
          }
        } else {
          toast.warning('Entity validation inconclusive', {
            description: 'Consider manual verification or use override mode'
          });
        }
      } else {
        throw new Error('Invalid response from validation service');
      }
      
    } catch (error) {
      console.error('Entity validation error:', error);
      toast.error('Live validation failed', {
        description: 'Unable to verify entity existence using live web data'
      });
    } finally {
      setIsValidating(false);
    }
  };

  const forceRevalidation = () => {
    setAutoValidated(false);
    setValidationResult(null);
    performValidation();
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">
              {enableOSINT ? 'Live OSINT Scanning' : 'Live Entity Validation'}
            </span>
            {enableOSINT && <Eye className="h-4 w-4 text-orange-600" />}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={forceRevalidation}
            disabled={isValidating}
          >
            <RefreshCw className={`h-3 w-3 ${isValidating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {isValidating && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>
              {enableOSINT 
                ? 'Performing live OSINT scan across web sources...' 
                : 'Validating entity across live sources...'
              }
            </span>
          </div>
        )}
        
        {validationResult && !isValidating && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {validationResult.isValid ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
              <span className="text-sm font-medium">
                {validationResult.isValid ? 'Entity Verified (Live)' : 'Verification Inconclusive'}
              </span>
              <Badge variant={validationResult.isValid ? 'default' : 'secondary'}>
                {Math.round(validationResult.confidence * 100)}% confidence
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Google Results:</span>
                <span className="ml-1 font-medium">
                  {validationResult.details.googleResults.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Reddit Mentions:</span>
                <span className="ml-1 font-medium">
                  {validationResult.details.redditMentions.toLocaleString()}
                </span>
              </div>
            </div>

            {enableOSINT && validationResult.osintData && (
              <div className="p-3 bg-orange-50 rounded border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">OSINT Intelligence</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-orange-700">Threats Found:</span>
                    <span className="ml-1 font-medium">
                      {validationResult.osintData.threats.length}
                    </span>
                  </div>
                  <div>
                    <span className="text-orange-700">Risk Score:</span>
                    <span className="ml-1 font-medium">
                      {Math.round(validationResult.osintData.riskScore * 100)}%
                    </span>
                  </div>
                </div>
                {validationResult.osintData.threats.length > 0 && (
                  <div className="mt-2">
                    <span className="text-xs text-orange-700">Recent threats detected across news sources</span>
                  </div>
                )}
              </div>
            )}
            
            {validationResult.sources.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-xs text-muted-foreground">Live sources:</span>
                {validationResult.sources.map((source, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {source}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="text-xs text-blue-600 flex items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>Validated using live web scraping - No simulation data</span>
            </div>
          </div>
        )}
        
        {!validationResult && !isValidating && (
          <div className="text-sm text-muted-foreground">
            Enter entity name to begin live validation
          </div>
        )}
      </CardContent>
    </Card>
  );
};
