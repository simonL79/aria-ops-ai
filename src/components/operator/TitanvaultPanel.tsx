
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, XCircle, Scale, FileText, Users } from 'lucide-react';
import { toast } from 'sonner';

interface DataSubjectRequest {
  id: string;
  subject_email: string;
  request_type: string;
  status: string;
  received_at: string;
  processed_at?: string;
  response_notes?: string;
}

interface DPIALog {
  id: string;
  related_entity_id?: string;
  entity_name?: string;
  description: string;
  risk_level?: string;
  mitigations?: string;
  created_at: string;
  reviewed_at?: string;
}

interface BreachIncident {
  id: string;
  description: string;
  severity?: string;
  detected_at: string;
  resolved_at?: string;
  resolution_notes?: string;
}

export const TitanvaultPanel = () => {
  const [dataRequests, setDataRequests] = useState<DataSubjectRequest[]>([]);
  const [dpiaLogs, setDpiaLogs] = useState<DPIALog[]>([]);
  const [breachIncidents, setBreachIncidents] = useState<BreachIncident[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTitanvaultData();
  }, []);

  const loadTitanvaultData = async () => {
    await Promise.all([loadDataRequests(), loadDPIALogs(), loadBreachIncidents()]);
  };

  const loadDataRequests = async () => {
    try {
      // Use mock data since the tables are newly created
      const mockData: DataSubjectRequest[] = [
        {
          id: '1',
          subject_email: 'user@example.com',
          request_type: 'access',
          status: 'pending',
          received_at: new Date().toISOString(),
          response_notes: 'Data access request received and under review'
        },
        {
          id: '2',
          subject_email: 'customer@domain.com',
          request_type: 'erasure',
          status: 'processed',
          received_at: new Date(Date.now() - 86400000).toISOString(),
          processed_at: new Date().toISOString(),
          response_notes: 'Personal data successfully erased from all systems'
        },
        {
          id: '3',
          subject_email: 'contact@business.org',
          request_type: 'correction',
          status: 'pending',
          received_at: new Date(Date.now() - 172800000).toISOString(),
          response_notes: 'Data correction request awaiting verification'
        }
      ];
      setDataRequests(mockData);
    } catch (error) {
      console.error('Error loading data subject requests:', error);
      setDataRequests([]);
    }
  };

  const loadDPIALogs = async () => {
    try {
      const mockData: DPIALog[] = [
        {
          id: '1',
          entity_name: 'Customer Analytics System',
          description: 'DPIA for new customer behavior tracking system',
          risk_level: 'medium',
          mitigations: 'Pseudonymization and access controls implemented',
          created_at: new Date().toISOString(),
          reviewed_at: new Date().toISOString()
        },
        {
          id: '2',
          entity_name: 'Employee Monitoring Platform',
          description: 'DPIA for workplace productivity monitoring tools',
          risk_level: 'high',
          mitigations: 'Consent mechanisms and data minimization principles applied',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      setDpiaLogs(mockData);
    } catch (error) {
      console.error('Error loading DPIA logs:', error);
      setDpiaLogs([]);
    }
  };

  const loadBreachIncidents = async () => {
    try {
      const mockData: BreachIncident[] = [
        {
          id: '1',
          description: 'Unauthorized access to customer database detected',
          severity: 'high',
          detected_at: new Date().toISOString(),
          resolution_notes: 'Investigation ongoing, affected customers notified'
        },
        {
          id: '2',
          description: 'Email containing personal data sent to wrong recipient',
          severity: 'medium',
          detected_at: new Date(Date.now() - 43200000).toISOString(),
          resolved_at: new Date().toISOString(),
          resolution_notes: 'Recall successful, recipient confirmed deletion'
        }
      ];
      setBreachIncidents(mockData);
    } catch (error) {
      console.error('Error loading breach incidents:', error);
      setBreachIncidents([]);
    }
  };

  const getRequestTypeColor = (type: string) => {
    switch (type) {
      case 'access':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'erasure':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'correction':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'portability':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getRiskLevelColor = (level?: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getSeverityColor = (severity?: string) => {
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

  const simulateDataRequest = async () => {
    setIsLoading(true);
    try {
      const requestTypes = ['access', 'erasure', 'correction', 'portability'];
      const emails = ['newuser@example.com', 'requestor@domain.org', 'subject@company.co.uk'];
      
      const randomType = requestTypes[Math.floor(Math.random() * requestTypes.length)];
      const randomEmail = emails[Math.floor(Math.random() * emails.length)];
      
      const newRequest: DataSubjectRequest = {
        id: Date.now().toString(),
        subject_email: randomEmail,
        request_type: randomType,
        status: 'pending',
        received_at: new Date().toISOString(),
        response_notes: `${randomType.charAt(0).toUpperCase() + randomType.slice(1)} request submitted via TITANVAULT™`
      };

      setDataRequests(prev => [newRequest, ...prev.slice(0, 9)]);
      toast.success('Data subject request logged');
    } catch (error) {
      console.error('Error simulating data request:', error);
      toast.error('Failed to log data request');
    } finally {
      setIsLoading(false);
    }
  };

  const conductDPIA = async () => {
    setIsLoading(true);
    try {
      const systems = ['AI Training Pipeline', 'Customer Segmentation Engine', 'Behavioral Analytics Platform'];
      const riskLevels = ['low', 'medium', 'high'];
      
      const randomSystem = systems[Math.floor(Math.random() * systems.length)];
      const randomRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
      
      const newDPIA: DPIALog = {
        id: Date.now().toString(),
        entity_name: randomSystem,
        description: `DPIA assessment for ${randomSystem} processing activities`,
        risk_level: randomRisk,
        mitigations: 'Data minimization, encryption, and access controls implemented',
        created_at: new Date().toISOString()
      };

      setDpiaLogs(prev => [newDPIA, ...prev.slice(0, 9)]);
      toast.success('DPIA assessment conducted');
    } catch (error) {
      console.error('Error conducting DPIA:', error);
      toast.error('Failed to conduct DPIA');
    } finally {
      setIsLoading(false);
    }
  };

  const logBreachIncident = async () => {
    setIsLoading(true);
    try {
      const incidents = [
        'Phishing email accessed employee credentials',
        'Laptop containing customer data reported stolen',
        'Database backup exposed due to misconfiguration',
        'Third-party vendor data breach affecting our customers'
      ];
      const severities = ['low', 'medium', 'high', 'critical'];
      
      const randomIncident = incidents[Math.floor(Math.random() * incidents.length)];
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
      
      const newIncident: BreachIncident = {
        id: Date.now().toString(),
        description: randomIncident,
        severity: randomSeverity,
        detected_at: new Date().toISOString(),
        resolution_notes: `${randomSeverity.charAt(0).toUpperCase() + randomSeverity.slice(1)} severity incident logged by TITANVAULT™`
      };

      setBreachIncidents(prev => [newIncident, ...prev.slice(0, 9)]);
      toast.success('Breach incident logged');
    } catch (error) {
      console.error('Error logging breach incident:', error);
      toast.error('Failed to log breach incident');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Data Subject Requests Panel */}
      <Card className="bg-black border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-blue-400 text-sm flex items-center gap-2">
            <Scale className="h-4 w-4" />
            TITANVAULT™ Data Subject Requests
            <Button
              size="sm"
              onClick={simulateDataRequest}
              disabled={isLoading}
              className="ml-auto text-xs bg-blue-600 hover:bg-blue-700"
            >
              <FileText className="h-3 w-3 mr-1" />
              Log Request
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {dataRequests.length === 0 ? (
            <div className="text-gray-500 text-sm">No data subject requests logged</div>
          ) : (
            dataRequests.map((request) => (
              <div key={request.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <FileText className="h-4 w-4 text-blue-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-blue-300">[{request.subject_email}]</span>
                  </div>
                  <div className="text-xs text-blue-400 mb-1">
                    {request.response_notes || 'No response notes available'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Received: {new Date(request.received_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getRequestTypeColor(request.request_type)}>
                    {request.request_type}
                  </Badge>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* DPIA Management Panel */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Data Protection Impact Assessments
            <Button
              size="sm"
              onClick={conductDPIA}
              disabled={isLoading}
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700"
            >
              <Shield className="h-3 w-3 mr-1" />
              Conduct DPIA
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {dpiaLogs.length === 0 ? (
            <div className="text-gray-500 text-sm">No DPIA assessments recorded</div>
          ) : (
            dpiaLogs.map((dpia) => (
              <div key={dpia.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <Shield className="h-4 w-4 text-purple-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-purple-300">[{dpia.entity_name || 'Unknown Entity'}]</span>
                  </div>
                  <div className="text-xs text-purple-400 mb-1">{dpia.description}</div>
                  {dpia.mitigations && (
                    <div className="text-xs text-gray-400 mb-1">Mitigations: {dpia.mitigations}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Created: {new Date(dpia.created_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getRiskLevelColor(dpia.risk_level)}>
                    {dpia.risk_level || 'unassessed'}
                  </Badge>
                  <Badge className={dpia.reviewed_at ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-orange-500/20 text-orange-400 border-orange-500/50'}>
                    {dpia.reviewed_at ? 'reviewed' : 'pending'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Breach Incident Logging */}
      <Card className="bg-black border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Breach Incident Management
            <Button
              size="sm"
              onClick={logBreachIncident}
              disabled={isLoading}
              className="ml-auto text-xs bg-red-600 hover:bg-red-700"
            >
              <AlertTriangle className="h-3 w-3 mr-1" />
              Log Incident
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {breachIncidents.length === 0 ? (
            <div className="text-gray-500 text-sm">No breach incidents recorded</div>
          ) : (
            breachIncidents.map((incident) => (
              <div key={incident.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-red-300">[BREACH DETECTED]</span>
                  </div>
                  <div className="text-xs text-red-400 mb-1">{incident.description}</div>
                  {incident.resolution_notes && (
                    <div className="text-xs text-gray-400 mb-1">Resolution: {incident.resolution_notes}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    Detected: {new Date(incident.detected_at).toLocaleTimeString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity || 'unknown'}
                  </Badge>
                  <Badge className={incident.resolved_at ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-orange-500/20 text-orange-400 border-orange-500/50'}>
                    {incident.resolved_at ? 'resolved' : 'investigating'}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
