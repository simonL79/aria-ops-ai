
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, XCircle, Scale, FileText, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LegalCompliance {
  id: string;
  entity_id: string | null;
  regulation: string;
  compliance_status: string | null;
  audit_score: number | null;
  last_audit: string;
  notes: string | null;
}

interface IncidentLog {
  id: string;
  entity_id: string | null;
  incident_type: string | null;
  severity: string | null;
  occurred_at: string;
  resolved: boolean | null;
  resolution_notes: string | null;
}

interface ConsentLog {
  id: string;
  entity_id: string | null;
  consent_type: string | null;
  consent_given: boolean | null;
  recorded_at: string;
  recorded_by: string | null;
}

export const ShieldhavenPanel = () => {
  const [compliance, setCompliance] = useState<LegalCompliance[]>([]);
  const [incidents, setIncidents] = useState<IncidentLog[]>([]);
  const [consents, setConsents] = useState<ConsentLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadShieldhavenData();
    subscribeToUpdates();
  }, []);

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('shieldhaven-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'shieldhaven_legal_compliance' },
        () => loadCompliance()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'shieldhaven_incident_log' },
        () => loadIncidents()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'shieldhaven_consent_log' },
        () => loadConsents()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadShieldhavenData = async () => {
    await Promise.all([loadCompliance(), loadIncidents(), loadConsents()]);
  };

  const loadCompliance = async () => {
    try {
      const { data, error } = await supabase
        .from('shieldhaven_legal_compliance')
        .select('*')
        .order('last_audit', { ascending: false })
        .limit(10);

      if (error) throw error;
      setCompliance(data || []);
    } catch (error) {
      console.error('Error loading compliance:', error);
    }
  };

  const loadIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('shieldhaven_incident_log')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(15);

      if (error) throw error;
      setIncidents(data || []);
    } catch (error) {
      console.error('Error loading incidents:', error);
    }
  };

  const loadConsents = async () => {
    try {
      const { data, error } = await supabase
        .from('shieldhaven_consent_log')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(15);

      if (error) throw error;
      setConsents(data || []);
    } catch (error) {
      console.error('Error loading consents:', error);
    }
  };

  const getComplianceColor = (status: string | null) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'non-compliant':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getComplianceIcon = (status: string | null) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'non-compliant':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getSeverityIcon = (severity: string | null) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const simulateComplianceAudit = async () => {
    setIsLoading(true);
    try {
      const regulations = ['GDPR', 'DPA 2018', 'CCPA', 'PIPEDA', 'SOX'];
      const statuses = ['compliant', 'non-compliant', 'pending'];
      
      const randomRegulation = regulations[Math.floor(Math.random() * regulations.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const auditScore = Math.floor(Math.random() * 100);
      
      await supabase
        .from('shieldhaven_legal_compliance')
        .insert({
          regulation: randomRegulation,
          compliance_status: randomStatus,
          audit_score: auditScore,
          notes: `Automated compliance audit: ${randomStatus} status with ${auditScore}% score`
        });

      toast.success('Compliance audit executed');
      loadCompliance();
    } catch (error) {
      console.error('Error executing compliance audit:', error);
      toast.error('Failed to execute compliance audit');
    } finally {
      setIsLoading(false);
    }
  };

  const logIncident = async () => {
    setIsLoading(true);
    try {
      const incidentTypes = ['data_breach', 'policy_violation', 'unauthorized_access', 'consent_violation'];
      const severities = ['low', 'medium', 'high', 'critical'];
      
      const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)];
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
      
      await supabase
        .from('shieldhaven_incident_log')
        .insert({
          incident_type: randomType,
          severity: randomSeverity,
          resolved: Math.random() > 0.7, // 30% chance of being resolved
          resolution_notes: `Incident type: ${randomType}. Severity: ${randomSeverity}. Auto-logged by SHIELDHAVEN™`
        });

      toast.success('Legal incident logged');
      loadIncidents();
    } catch (error) {
      console.error('Error logging incident:', error);
      toast.error('Failed to log incident');
    } finally {
      setIsLoading(false);
    }
  };

  const recordConsent = async () => {
    setIsLoading(true);
    try {
      const consentTypes = ['tracking', 'data_retention', 'marketing', 'analytics', 'third_party_sharing'];
      const randomType = consentTypes[Math.floor(Math.random() * consentTypes.length)];
      const consentGiven = Math.random() > 0.3; // 70% chance of consent being given
      
      await supabase
        .from('shieldhaven_consent_log')
        .insert({
          consent_type: randomType,
          consent_given: consentGiven,
          recorded_by: 'SHIELDHAVEN™ Compliance AI'
        });

      toast.success('Consent decision recorded');
      loadConsents();
    } catch (error) {
      console.error('Error recording consent:', error);
      toast.error('Failed to record consent');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Legal Compliance Tracker */}
      <Card className="bg-black border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
            <Scale className="h-4 w-4" />
            SHIELDHAVEN™ Legal Compliance Tracker
            <Button
              size="sm"
              onClick={simulateComplianceAudit}
              disabled={isLoading}
              className="ml-auto text-xs bg-blue-600 hover:bg-blue-700"
            >
              <Shield className="h-3 w-3 mr-1" />
              Run Audit
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {compliance.length === 0 ? (
            <div className="text-gray-500 text-sm">No compliance records available</div>
          ) : (
            compliance.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getComplianceIcon(item.compliance_status)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-blue-300">[{item.regulation}]</span> Compliance Check
                  </div>
                  <div className="text-xs text-blue-400 mb-1">
                    Audit Score: {item.audit_score !== null ? `${item.audit_score}%` : 'N/A'}
                  </div>
                  {item.notes && (
                    <div className="text-xs text-gray-400 mb-1">{item.notes}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(item.last_audit).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getComplianceColor(item.compliance_status)}>
                  {item.compliance_status || 'unknown'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Incident Registry */}
      <Card className="bg-black border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Legal Incident Registry
            <Button
              size="sm"
              onClick={logIncident}
              disabled={isLoading}
              className="ml-auto text-xs bg-red-600 hover:bg-red-700"
            >
              <FileText className="h-3 w-3 mr-1" />
              Log Incident
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {incidents.length === 0 ? (
            <div className="text-gray-500 text-sm">No incidents recorded</div>
          ) : (
            incidents.map((incident) => (
              <div key={incident.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getSeverityIcon(incident.severity)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-red-300">[{incident.incident_type}]</span> Legal Incident
                  </div>
                  {incident.resolution_notes && (
                    <div className="text-xs text-red-400 mb-1">{incident.resolution_notes}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(incident.occurred_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity || 'unknown'}
                  </Badge>
                  <Badge className={incident.resolved ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-orange-500/20 text-orange-400 border-orange-500/50'}>
                    {incident.resolved ? 'resolved' : 'open'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Consent Ledger */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Audit-Proof Consent Ledger
            <Button
              size="sm"
              onClick={recordConsent}
              disabled={isLoading}
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700"
            >
              <Users className="h-3 w-3 mr-1" />
              Record Consent
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {consents.length === 0 ? (
            <div className="text-gray-500 text-sm">No consent records available</div>
          ) : (
            consents.map((consent) => (
              <div key={consent.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {consent.consent_given ? 
                  <CheckCircle className="h-4 w-4 text-green-400" /> : 
                  <XCircle className="h-4 w-4 text-red-400" />
                }
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-purple-300">[{consent.consent_type}]</span> Consent Decision
                  </div>
                  <div className="text-xs text-purple-400 mb-1">
                    Recorded by: {consent.recorded_by}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(consent.recorded_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={consent.consent_given ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-400 border-red-500/50'}>
                  {consent.consent_given ? 'granted' : 'denied'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
