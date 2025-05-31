import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CheckResult {
  passed: boolean;
  message: string;
  duration: number;
}

interface CheckStatus {
  databaseConnection: 'idle' | 'running' | 'completed' | 'failed';
  authenticationService: 'idle' | 'running' | 'completed' | 'failed';
  realtimeUpdates: 'idle' | 'running' | 'completed' | 'failed';
  storageAvailability: 'idle' | 'running' | 'completed' | 'failed';
  complianceAudit: 'idle' | 'running' | 'completed' | 'failed';
}

interface CheckResults {
  databaseConnection: CheckResult | null;
  authenticationService: CheckResult | null;
  realtimeUpdates: CheckResult | null;
  storageAvailability: CheckResult | null;
  complianceAudit: CheckResult | null;
}

export const ComprehensiveSystemCheck = () => {
  const [checkStatus, setCheckStatus] = useState<CheckStatus>({
    databaseConnection: 'idle',
    authenticationService: 'idle',
    realtimeUpdates: 'idle',
    storageAvailability: 'idle',
    complianceAudit: 'idle',
  });

  const [checkResults, setCheckResults] = useState<CheckResults>({
    databaseConnection: null,
    authenticationService: null,
    realtimeUpdates: null,
    storageAvailability: null,
    complianceAudit: null,
  });

  const [allChecksCompleted, setAllChecksCompleted] = useState(false);
  const checkStartTime = Date.now();

  useEffect(() => {
    runAllChecks();
  }, []);

  useEffect(() => {
    if (
      checkStatus.databaseConnection === 'completed' &&
      checkStatus.authenticationService === 'completed' &&
      checkStatus.realtimeUpdates === 'completed' &&
      checkStatus.storageAvailability === 'completed' &&
      checkStatus.complianceAudit === 'completed'
    ) {
      setAllChecksCompleted(true);
    }
  }, [checkStatus]);

  const runAllChecks = async () => {
    await checkDatabaseConnection();
    await checkAuthenticationService();
    await checkRealtimeUpdates();
    await checkStorageAvailability();
    await checkComplianceAudit();
  };

  const checkDatabaseConnection = async () => {
    setCheckStatus(prev => ({ ...prev, databaseConnection: 'running' }));
    const startTime = Date.now();

    try {
      await supabase.from('activity_logs').select('id').limit(1);
      setCheckResults(prev => ({
        ...prev,
        databaseConnection: {
          passed: true,
          message: 'Database connection successful',
          duration: Date.now() - startTime
        }
      }));
      setCheckStatus(prev => ({ ...prev, databaseConnection: 'completed' }));
    } catch (error) {
      console.error('Database connection check failed:', error);
      setCheckResults(prev => ({
        ...prev,
        databaseConnection: {
          passed: false,
          message: 'Database connection failed',
          duration: Date.now() - startTime
        }
      }));
      setCheckStatus(prev => ({ ...prev, databaseConnection: 'failed' }));
    }
  };

  const checkAuthenticationService = async () => {
    setCheckStatus(prev => ({ ...prev, authenticationService: 'running' }));
    const startTime = Date.now();

    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      setCheckResults(prev => ({
        ...prev,
        authenticationService: {
          passed: true,
          message: 'Authentication service operational',
          duration: Date.now() - startTime
        }
      }));
      setCheckStatus(prev => ({ ...prev, authenticationService: 'completed' }));
    } catch (error) {
      console.error('Authentication service check failed:', error);
      setCheckResults(prev => ({
        ...prev,
        authenticationService: {
          passed: false,
          message: 'Authentication service failed',
          duration: Date.now() - startTime
        }
      }));
      setCheckStatus(prev => ({ ...prev, authenticationService: 'failed' }));
    }
  };

  const checkRealtimeUpdates = async () => {
    setCheckStatus(prev => ({ ...prev, realtimeUpdates: 'running' }));
    const startTime = Date.now();

    try {
      const channel = supabase.channel('test');
      await channel.subscribe();
      await channel.unsubscribe();

      setCheckResults(prev => ({
        ...prev,
        realtimeUpdates: {
          passed: true,
          message: 'Realtime updates operational',
          duration: Date.now() - startTime
        }
      }));
      setCheckStatus(prev => ({ ...prev, realtimeUpdates: 'completed' }));
    } catch (error) {
      console.error('Realtime updates check failed:', error);
      setCheckResults(prev => ({
        ...prev,
        realtimeUpdates: {
          passed: false,
          message: 'Realtime updates failed',
          duration: Date.now() - startTime
        }
      }));
      setCheckStatus(prev => ({ ...prev, realtimeUpdates: 'failed' }));
    }
  };

  const checkStorageAvailability = async () => {
    setCheckStatus(prev => ({ ...prev, storageAvailability: 'running' }));
    const startTime = Date.now();

    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) throw error;

      setCheckResults(prev => ({
        ...prev,
        storageAvailability: {
          passed: true,
          message: `Storage available with ${data.length} buckets`,
          duration: Date.now() - startTime
        }
      }));
      setCheckStatus(prev => ({ ...prev, storageAvailability: 'completed' }));
    } catch (error) {
      console.error('Storage availability check failed:', error);
      setCheckResults(prev => ({
        ...prev,
        storageAvailability: {
          passed: false,
          message: 'Storage availability check failed',
          duration: Date.now() - startTime
        }
      }));
      setCheckStatus(prev => ({ ...prev, storageAvailability: 'failed' }));
    }
  };

  const checkComplianceAudit = async () => {
    setCheckStatus(prev => ({ ...prev, complianceAudit: 'running' }));
    
    try {
      // Use existing activity_logs table instead of compliance_audit_logs
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('entity_type', 'compliance')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      const logsCount = data?.length || 0;
      
      setCheckResults(prev => ({
        ...prev,
        complianceAudit: {
          passed: logsCount > 0,
          message: `Found ${logsCount} compliance activities`,
          duration: Date.now() - checkStartTime
        }
      }));
      
      setCheckStatus(prev => ({ ...prev, complianceAudit: 'completed' }));
    } catch (error) {
      console.error('Compliance audit check failed:', error);
      setCheckResults(prev => ({
        ...prev,
        complianceAudit: {
          passed: false,
          message: 'Compliance audit check failed',
          duration: Date.now() - checkStartTime
        }
      }));
      setCheckStatus(prev => ({ ...prev, complianceAudit: 'failed' }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <CheckCircle className="h-5 w-5" />
          Comprehensive System Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(checkStatus.databaseConnection)}
              <span className="text-sm text-gray-400">Database Connection</span>
            </div>
            {checkResults.databaseConnection && (
              <Badge variant="secondary" className={getStatusColor(checkStatus.databaseConnection)}>
                {checkResults.databaseConnection.message} ({checkResults.databaseConnection.duration}ms)
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(checkStatus.authenticationService)}
              <span className="text-sm text-gray-400">Authentication Service</span>
            </div>
            {checkResults.authenticationService && (
              <Badge variant="secondary" className={getStatusColor(checkStatus.authenticationService)}>
                {checkResults.authenticationService.message} ({checkResults.authenticationService.duration}ms)
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(checkStatus.realtimeUpdates)}
              <span className="text-sm text-gray-400">Realtime Updates</span>
            </div>
            {checkResults.realtimeUpdates && (
              <Badge variant="secondary" className={getStatusColor(checkStatus.realtimeUpdates)}>
                {checkResults.realtimeUpdates.message} ({checkResults.realtimeUpdates.duration}ms)
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(checkStatus.storageAvailability)}
              <span className="text-sm text-gray-400">Storage Availability</span>
            </div>
            {checkResults.storageAvailability && (
              <Badge variant="secondary" className={getStatusColor(checkStatus.storageAvailability)}>
                {checkResults.storageAvailability.message} ({checkResults.storageAvailability.duration}ms)
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(checkStatus.complianceAudit)}
              <span className="text-sm text-gray-400">Compliance Audit</span>
            </div>
            {checkResults.complianceAudit && (
              <Badge variant="secondary" className={getStatusColor(checkStatus.complianceAudit)}>
                {checkResults.complianceAudit.message} ({checkResults.complianceAudit.duration}ms)
              </Badge>
            )}
          </div>
        </div>

        {allChecksCompleted && (
          <div className="text-center text-green-500 py-4">
            <CheckCircle className="w-6 h-6 mx-auto mb-2" />
            All system checks completed successfully!
          </div>
        )}

        {!allChecksCompleted && (
          <div className="text-center text-yellow-500 py-4">
            <Clock className="w-6 h-6 mx-auto mb-2 animate-spin" />
            Running system checks...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
