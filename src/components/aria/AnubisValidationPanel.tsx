
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Activity,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ValidationResult {
  check_name: string;
  status: 'pass' | 'warning' | 'fail';
  value: number | string | boolean;
  expected?: number | string | boolean;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const AnubisValidationPanel = () => {
  const [isRunningValidation, setIsRunningValidation] = useState(false);

  const { data: anubisState, refetch: refetchState } = useQuery({
    queryKey: ['anubis-validation-state'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('anubis_state')
        .select('*')
        .eq('module', 'System_Validator')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    refetchInterval: 30000 // Auto-refresh every 30 seconds
  });

  const { data: recentValidations } = useQuery({
    queryKey: ['anubis-validation-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('anubis_log')
        .select('*')
        .eq('module', 'Enhanced_Validator')
        .order('logged_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 60000 // Refresh every minute
  });

  const runValidation = async () => {
    setIsRunningValidation(true);
    try {
      const response = await fetch('/functions/v1/anubis-validator', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Validation failed');

      const result = await response.json();
      
      if (result.success) {
        toast.success('Anubis validation completed successfully');
        refetchState();
      } else {
        toast.error('Validation completed with issues');
      }
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Failed to run validation');
    } finally {
      setIsRunningValidation(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#247CFF]/20 bg-[#0A0F2C]/90">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Shield className="h-6 w-6 text-[#247CFF]" />
              Anubis Enhanced Validation
            </CardTitle>
            <Button
              onClick={runValidation}
              disabled={isRunningValidation}
              className="bg-[#247CFF] hover:bg-[#1c63cc] text-white"
            >
              {isRunningValidation ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Run Validation
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          {anubisState && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-[#1C1C1E]/50 border-[#247CFF]/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#D8DEE9]/60">System Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(anubisState.status)}
                        <span className="text-white font-medium capitalize">
                          {anubisState.status}
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(anubisState.status)} text-white border-0`}
                    >
                      {anubisState.status}
                    </Badge>
                  </div>
                  {anubisState.issue_summary && (
                    <p className="text-sm text-[#D8DEE9]/80 mt-2">
                      {anubisState.issue_summary}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#1C1C1E]/50 border-[#247CFF]/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#D8DEE9]/60">Validation Checks</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Activity className="h-4 w-4 text-[#247CFF]" />
                        <span className="text-white font-medium">
                          {anubisState.record_count || 0} Total
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`${anubisState.anomaly_detected ? 'bg-red-500' : 'bg-green-500'} text-white border-0`}
                    >
                      {anubisState.anomaly_detected ? 'Issues' : 'Clean'}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#D8DEE9]/80 mt-2">
                    Last updated: {new Date(anubisState.updated_at).toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Validation History */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Recent Validation History</h3>
            <div className="space-y-2">
              {recentValidations?.map((validation, index) => (
                <Card key={index} className="bg-[#1C1C1E]/30 border-[#247CFF]/10">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(validation.result_status)}
                        <div>
                          <p className="text-white text-sm font-medium">
                            {validation.check_type.replace(/_/g, ' ').toUpperCase()}
                          </p>
                          <p className="text-[#D8DEE9]/60 text-xs">
                            {new Date(validation.logged_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(validation.result_status)} text-white border-0 text-xs`}
                      >
                        {validation.result_status}
                      </Badge>
                    </div>
                    {validation.details && (
                      <p className="text-[#D8DEE9]/80 text-sm mt-2">
                        {validation.details}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Validation Progress Indicator */}
          {isRunningValidation && (
            <Card className="bg-[#247CFF]/10 border-[#247CFF]/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-[#247CFF] animate-spin" />
                  <div className="flex-1">
                    <p className="text-white font-medium">Running Anubis Enhanced Validation</p>
                    <p className="text-[#D8DEE9]/60 text-sm">
                      Checking system integrity, RLS policies, and data quality...
                    </p>
                  </div>
                </div>
                <Progress value={undefined} className="mt-3" />
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnubisValidationPanel;
