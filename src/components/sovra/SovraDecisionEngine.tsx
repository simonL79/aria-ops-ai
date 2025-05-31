
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Zap
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Using existing tables instead of non-existent ones
interface ThreatItem {
  id: string;
  content: string;
  platform: string;
  severity: string;
  threat_type?: string;
  status?: string;
  created_at: string;
}

interface NotificationItem {
  id: string;
  event_type?: string;
  entity_name?: string;
  summary?: string;
  priority?: string;
  created_at?: string;
}

const SovraDecisionEngine = () => {
  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<ThreatItem | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Use existing tables from the schema
      const [threatsData, notificationsData] = await Promise.all([
        supabase.from('high_priority_threats').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('aria_notifications').select('*').order('created_at', { ascending: false }).limit(20)
      ]);

      if (threatsData.data) {
        const threatItems: ThreatItem[] = threatsData.data.map(item => ({
          id: item.id || '',
          content: item.content || '',
          platform: item.platform || '',
          severity: item.severity || 'medium',
          threat_type: item.threat_type || 'unknown',
          status: item.status || 'pending',
          created_at: item.created_at || new Date().toISOString()
        }));
        setThreats(threatItems);
      }

      if (notificationsData.data) {
        setNotifications(notificationsData.data);
      }
    } catch (error) {
      console.error('Error loading SOVRA data:', error);
      toast.error('Failed to load SOVRA data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminDecision = async (threatId: string, approved: boolean) => {
    if (!adminComment.trim()) {
      toast.error('Please add a comment explaining your decision');
      return;
    }

    setIsProcessing(true);
    try {
      // Log the decision to activity logs instead of non-existent tables
      await supabase.from('activity_logs').insert({
        action: approved ? 'threat_approved' : 'threat_rejected',
        details: `Admin decision on threat ${threatId}: ${adminComment}`,
        entity_type: 'sovra_decision',
        entity_id: threatId
      });

      toast.success(`Threat ${approved ? 'approved' : 'rejected'} successfully`);
      setAdminComment('');
      setSelectedThreat(null);
      loadAllData();
    } catch (error) {
      console.error('Error processing admin decision:', error);
      toast.error('Failed to process decision');
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'awaiting_admin': return 'bg-orange-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'executed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading SOVRA™ Decision Engine...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            SOVRA™ Decision Engine
          </h1>
          <p className="text-muted-foreground">
            Human-Authorized Threat Response System
          </p>
        </div>
        <div className="text-sm text-gray-600">
          {threats.length} threats available for review
        </div>
      </div>

      <Tabs defaultValue="threats">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="threats" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Threat Queue
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="threats">
          <Card>
            <CardHeader>
              <CardTitle>High Priority Threats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {threats.length > 0 ? (
                  threats.map((threat) => (
                    <div key={threat.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{threat.threat_type || 'Unknown Threat'}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(threat.status || 'pending')} text-white`}>
                            {(threat.status || 'pending').toUpperCase()}
                          </Badge>
                          <span className={`font-medium ${getSeverityColor(threat.severity)}`}>
                            {threat.severity}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Platform:</span>
                          <div className="font-medium">{threat.platform}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Detected:</span>
                          <div className="font-medium">{new Date(threat.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {threat.content}
                      </p>

                      {(threat.status === 'pending' || !threat.status) && (
                        <div className="space-y-3 pt-3 border-t">
                          <Textarea
                            placeholder="Add your decision comment..."
                            value={selectedThreat?.id === threat.id ? adminComment : ''}
                            onChange={(e) => {
                              setSelectedThreat(threat);
                              setAdminComment(e.target.value);
                            }}
                            className="min-h-[60px]"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAdminDecision(threat.id, true)}
                              disabled={isProcessing || !adminComment.trim()}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleAdminDecision(threat.id, false)}
                              disabled={isProcessing || !adminComment.trim()}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No threats in queue
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{notification.event_type || 'System Event'}</span>
                        <Badge variant="outline">
                          {notification.priority || 'medium'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{notification.summary}</p>
                      <div className="text-xs text-gray-500">
                        {notification.created_at ? new Date(notification.created_at).toLocaleString() : 'Unknown time'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No notifications available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SovraDecisionEngine;
