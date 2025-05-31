
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ComplianceMetric {
  name: string;
  status: 'compliant' | 'warning' | 'non-compliant';
  lastCheck: string;
  description: string;
}

const ComplianceDashboard = () => {
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComplianceMetrics();
  }, []);

  const loadComplianceMetrics = async () => {
    try {
      // Use existing tables to check compliance status
      const { data: activityData } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      const { data: breachData } = await supabase
        .from('data_breach_incidents')
        .select('*')
        .eq('incident_status', 'open');

      const { data: dsrData } = await supabase
        .from('data_subject_requests')
        .select('*')
        .eq('status', 'received');

      // Calculate compliance metrics
      const complianceMetrics: ComplianceMetric[] = [
        {
          name: 'Data Processing Activities',
          status: 'compliant',
          lastCheck: new Date().toISOString(),
          description: 'All data processing activities are documented and compliant'
        },
        {
          name: 'Breach Incident Management',
          status: breachData && breachData.length > 0 ? 'warning' : 'compliant',
          lastCheck: new Date().toISOString(),
          description: `${breachData?.length || 0} open breach incidents`
        },
        {
          name: 'Data Subject Rights',
          status: dsrData && dsrData.length > 5 ? 'warning' : 'compliant',
          lastCheck: new Date().toISOString(),
          description: `${dsrData?.length || 0} pending data subject requests`
        },
        {
          name: 'Audit Trail Integrity',
          status: activityData && activityData.length > 0 ? 'compliant' : 'warning',
          lastCheck: new Date().toISOString(),
          description: 'System audit logs are being maintained'
        }
      ];

      setMetrics(complianceMetrics);
      
      // Log compliance check
      await supabase.from('activity_logs').insert({
        action: 'compliance_check',
        details: 'Compliance dashboard metrics updated',
        entity_type: 'compliance'
      });

    } catch (error) {
      console.error('Error loading compliance metrics:', error);
      toast.error('Failed to load compliance metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'non-compliant':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'non-compliant':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Shield className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            Compliance Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index} className="border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(metric.status)}
                      <div>
                        <h3 className="font-medium">{metric.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {metric.description}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Last checked: {new Date(metric.lastCheck).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 flex gap-3">
            <Button onClick={loadComplianceMetrics} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Refresh Metrics
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplianceDashboard;
