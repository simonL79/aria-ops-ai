
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Mail, MessageSquare, Clock, User, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { 
  getHighPriorityThreats, 
  generateSuggestedActions, 
  generateEmailScript,
  updateThreatResponseStatus,
  type ThreatResponse 
} from "@/services/strategicResponse";

const ThreatResponsePanel = () => {
  const [threats, setThreats] = useState<ThreatResponse[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<ThreatResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [responseNotes, setResponseNotes] = useState('');
  const [emailDraft, setEmailDraft] = useState<any>(null);

  useEffect(() => {
    loadHighPriorityThreats();
  }, []);

  const loadHighPriorityThreats = async () => {
    setIsLoading(true);
    try {
      const data = await getHighPriorityThreats();
      setThreats(data);
    } catch (error) {
      console.error('Error loading threats:', error);
      toast.error('Failed to load threats');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectThreat = (threat: ThreatResponse) => {
    setSelectedThreat(threat);
    setResponseNotes(threat.response_notes || '');
    setEmailDraft(null);
  };

  const handleGenerateEmail = (type: 'internal' | 'external') => {
    if (!selectedThreat) return;
    
    const draft = generateEmailScript(selectedThreat, type);
    setEmailDraft(draft);
    toast.success(`${type === 'internal' ? 'Internal' : 'External'} email draft generated`);
  };

  const handleUpdateStatus = async (status: 'pending' | 'in_progress' | 'resolved') => {
    if (!selectedThreat) return;

    const success = await updateThreatResponseStatus(
      selectedThreat.id, 
      status, 
      responseNotes
    );

    if (success) {
      setSelectedThreat({ ...selectedThreat, response_status: status, response_notes: responseNotes });
      loadHighPriorityThreats(); // Refresh the list
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
      case 'critical':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Strategic Threat Response
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Threats List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            High-Priority Threats ({threats.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {threats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No high-priority threats detected</p>
            </div>
          ) : (
            threats.map((threat) => (
              <div
                key={threat.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedThreat?.id === threat.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleSelectThreat(threat)}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getSeverityColor(threat.priority_level || threat.severity)}>
                    {(threat.priority_level || threat.severity).toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={getStatusColor(threat.response_status)}>
                    {threat.response_status.replace('_', ' ')}
                  </Badge>
                </div>
                
                <p className="text-sm font-medium mb-1">{threat.platform}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {threat.content}
                </p>
                
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(threat.created_at).toLocaleDateString()}
                  </span>
                  {threat.risk_entity_name && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {threat.risk_entity_name}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Response Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Response Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedThreat ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-2" />
              <p>Select a threat to view response options</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Suggested Actions */}
              <div>
                <h3 className="font-medium mb-3">Suggested Actions</h3>
                <div className="space-y-2">
                  {generateSuggestedActions(selectedThreat).actions.map((action, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary">•</span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email Generation */}
              <div>
                <h3 className="font-medium mb-3">Generate Response Email</h3>
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleGenerateEmail('internal')}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Internal Alert
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleGenerateEmail('external')}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    External Outreach
                  </Button>
                </div>

                {emailDraft && (
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div className="text-sm">
                      <strong>To:</strong> {emailDraft.to}
                    </div>
                    <div className="text-sm">
                      <strong>Subject:</strong> {emailDraft.subject}
                    </div>
                    <div className="text-sm">
                      <strong>Body:</strong>
                      <div className="mt-1 bg-white p-3 rounded border text-xs whitespace-pre-wrap">
                        {emailDraft.body}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Response Notes */}
              <div>
                <h3 className="font-medium mb-3">Response Notes</h3>
                <Textarea
                  placeholder="Add notes about your response actions..."
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-medium mb-3">Update Status</h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateStatus('pending')}
                  >
                    Mark Pending
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUpdateStatus('in_progress')}
                  >
                    In Progress
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleUpdateStatus('resolved')}
                  >
                    Mark Resolved
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatResponsePanel;
