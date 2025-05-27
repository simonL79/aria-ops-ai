
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import DPIAManagement from './DPIAManagement';
import LIAManagement from './LIAManagement';
import DSRManagement from './DSRManagement';
import AuditLog from '../security/AuditLog';
import DataRetentionManager from './DataRetentionManager';
import PrivacyNoticeManager from './PrivacyNoticeManager';

const ComplianceDashboard = () => {
  const [stats, setStats] = useState({
    totalDPIAs: 0,
    activeLIAs: 0,
    pendingDSRs: 0,
    auditLogs: 0,
    complianceScore: 0
  });

  useEffect(() => {
    fetchComplianceStats();
    logComplianceActivity('compliance_dashboard_accessed', 'User accessed compliance dashboard');
  }, []);

  const fetchComplianceStats = async () => {
    try {
      // Fetch DPIA count
      const { count: dpiaCount } = await supabase
        .from('dpia_records')
        .select('*', { count: 'exact', head: true });

      // Fetch LIA count
      const { count: liaCount } = await supabase
        .from('lia_records')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Fetch pending DSR count
      const { count: dsrCount } = await supabase
        .from('data_subject_requests')
        .select('*', { count: 'exact', head: true })
        .in('status', ['received', 'under_review', 'processing']);

      // Fetch recent audit logs count
      const { count: auditCount } = await supabase
        .from('compliance_audit_logs')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalDPIAs: dpiaCount || 0,
        activeLIAs: liaCount || 0,
        pendingDSRs: dsrCount || 0,
        auditLogs: auditCount || 0,
        complianceScore: calculateComplianceScore(dpiaCount || 0, liaCount || 0, dsrCount || 0)
      });
    } catch (error) {
      console.error('Error fetching compliance stats:', error);
      toast.error('Failed to load compliance statistics');
    }
  };

  const calculateComplianceScore = (dpias: number, lias: number, pendingDSRs: number) => {
    let score = 0;
    if (dpias > 0) score += 30;
    if (lias > 0) score += 30;
    if (pendingDSRs === 0) score += 20;
    score += 20; // Base score for having audit logging
    return Math.min(score, 100);
  };

  const logComplianceActivity = async (activityType: string, description: string) => {
    try {
      await supabase.rpc('log_compliance_activity', {
        p_activity_type: activityType,
        p_description: description,
        p_legal_basis: 'Legal Obligation'
      });
    } catch (error) {
      console.error('Error logging compliance activity:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">GDPR Compliance Centre</h1>
          </div>
          <p className="text-gray-600">
            Comprehensive data protection and compliance management for A.R.I.A™
          </p>
        </div>

        {/* Compliance Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
              <Shield className={`h-4 w-4 ${stats.complianceScore >= 80 ? 'text-green-500' : stats.complianceScore >= 60 ? 'text-yellow-500' : 'text-red-500'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.complianceScore >= 80 ? 'text-green-600' : stats.complianceScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {stats.complianceScore}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">DPIAs</CardTitle>
              <FileText className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDPIAs}</div>
              <p className="text-xs text-muted-foreground">Total assessments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active LIAs</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeLIAs}</div>
              <p className="text-xs text-muted-foreground">Approved assessments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending DSRs</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingDSRs}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Audit Logs</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.auditLogs}</div>
              <p className="text-xs text-muted-foreground">Total activities logged</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Compliance Tabs */}
        <Tabs defaultValue="dpia" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dpia">DPIAs</TabsTrigger>
            <TabsTrigger value="lia">LIAs</TabsTrigger>
            <TabsTrigger value="dsr">Data Requests</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="retention">Data Retention</TabsTrigger>
            <TabsTrigger value="notices">Privacy Notices</TabsTrigger>
          </TabsList>

          <TabsContent value="dpia">
            <DPIAManagement />
          </TabsContent>

          <TabsContent value="lia">
            <LIAManagement />
          </TabsContent>

          <TabsContent value="dsr">
            <DSRManagement />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLog />
          </TabsContent>

          <TabsContent value="retention">
            <DataRetentionManager />
          </TabsContent>

          <TabsContent value="notices">
            <PrivacyNoticeManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComplianceDashboard;
