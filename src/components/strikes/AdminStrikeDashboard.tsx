
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  XCircle, 
  Zap, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  FileText,
  Shield
} from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface StrikeRequest {
  id: string;
  batch_id: string;
  url: string;
  platform: string;
  reason: string;
  strike_type: string;
  status: string;
  requested_by: string;
  approved_by?: string;
  created_at: string;
  approved_at?: string;
  executed_at?: string;
  evidence_pdf?: string;
  execution_result?: any;
}

interface BatchGroup {
  batch_id: string;
  requests: StrikeRequest[];
  status: string;
  created_at: string;
  requester_email?: string;
}

const AdminStrikeDashboard = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<BatchGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [executingBatch, setExecutingBatch] = useState<string | null>(null);
  const [adminReason, setAdminReason] = useState('');

  useEffect(() => {
    loadStrikeRequests();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadStrikeRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStrikeRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('strike_requests')
        .select(`
          *,
          profiles:requested_by(email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by batch_id
      const batchMap = new Map<string, StrikeRequest[]>();
      
      data.forEach(request => {
        if (!batchMap.has(request.batch_id)) {
          batchMap.set(request.batch_id, []);
        }
        batchMap.get(request.batch_id)!.push(request);
      });

      // Create batch groups
      const batchGroups: BatchGroup[] = Array.from(batchMap.entries()).map(([batch_id, requests]) => {
        const statuses = requests.map(r => r.status);
        let batchStatus = 'pending';
        
        if (statuses.every(s => s === 'completed')) batchStatus = 'completed';
        else if (statuses.some(s => s === 'executing')) batchStatus = 'executing';
        else if (statuses.some(s => s === 'approved')) batchStatus = 'approved';
        else if (statuses.every(s => s === 'rejected')) batchStatus = 'rejected';
        else if (statuses.some(s => s === 'failed')) batchStatus = 'failed';

        return {
          batch_id,
          requests: requests.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
          status: batchStatus,
          created_at: requests[0].created_at,
          requester_email: requests[0].profiles?.email
        };
      });

      setBatches(batchGroups.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (error) {
      console.error('Error loading strike requests:', error);
      toast.error('Failed to load strike requests');
    } finally {
      setLoading(false);
    }
  };

  const approveBatch = async (batchId: string) => {
    if (!adminReason.trim()) {
      toast.error('Please provide a reason for approval');
      return;
    }

    try {
      const { error } = await supabase
        .from('strike_requests')
        .update({
          status: 'approved',
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('batch_id', batchId)
        .eq('status', 'pending');

      if (error) throw error;

      toast.success('Batch approved successfully');
      setAdminReason('');
      loadStrikeRequests();
    } catch (error) {
      console.error('Error approving batch:', error);
      toast.error('Failed to approve batch');
    }
  };

  const rejectBatch = async (batchId: string) => {
    if (!adminReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    try {
      const { error } = await supabase
        .from('strike_requests')
        .update({
          status: 'rejected',
          approved_by: user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('batch_id', batchId)
        .eq('status', 'pending');

      if (error) throw error;

      toast.success('Batch rejected');
      setAdminReason('');
      loadStrikeRequests();
    } catch (error) {
      console.error('Error rejecting batch:', error);
      toast.error('Failed to reject batch');
    }
  };

  const executeBatch = async (batchId: string) => {
    setExecutingBatch(batchId);
    
    try {
      const { data, error } = await supabase.functions.invoke('execute-batch-strikes', {
        body: {
          batch_id: batchId,
          admin_id: user?.id
        }
      });

      if (error) throw error;

      toast.success(
        `✅ Batch execution completed!\n${data.message}`,
        { duration: 5000 }
      );

      loadStrikeRequests();
    } catch (error) {
      console.error('Error executing batch:', error);
      toast.error('Failed to execute batch strikes');
    } finally {
      setExecutingBatch(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'executing': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStrikeTypeIcon = (type: string) => {
    switch (type) {
      case 'dmca': return '📋';
      case 'gdpr': return '🛡️';
      case 'platform_flag': return '🚩';
      case 'deindex': return '🔍';
      case 'legal_escalation': return '⚖️';
      default: return '🎯';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2 text-red-600 font-semibold">Loading A.R.I.A/EX™ Strike Dashboard...</span>
      </div>
    );
  }

  const pendingBatches = batches.filter(b => b.status === 'pending');
  const approvedBatches = batches.filter(b => b.status === 'approved');
  const executingBatches = batches.filter(b => b.status === 'executing');
  const completedBatches = batches.filter(b => ['completed', 'failed'].includes(b.status));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-red-600">
            <Shield className="h-6 w-6" />
            A.R.I.A/EX™ Strike Dashboard
          </h1>
          <p className="text-muted-foreground">
            Admin control center for reviewing and executing strike requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Pending Review</p>
              <p className="text-lg font-bold text-yellow-600">{pendingBatches.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Ready to Execute</p>
              <p className="text-lg font-bold text-blue-600">{approvedBatches.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Executing</p>
              <p className="text-lg font-bold text-purple-600">{executingBatches.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-lg font-bold text-green-600">{completedBatches.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending ({pendingBatches.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Approved ({approvedBatches.length})
          </TabsTrigger>
          <TabsTrigger value="executing" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Executing ({executingBatches.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-1">
            <FileText className="h-3 w-3" />
            Completed ({completedBatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-4">
            {pendingBatches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No pending batches requiring review
              </div>
            ) : (
              pendingBatches.map(batch => (
                <Card key={batch.batch_id} className="border-yellow-200">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <span>Batch {batch.batch_id.slice(0, 8)}...</span>
                        <Badge className={getStatusColor(batch.status)} variant="secondary">
                          {batch.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">
                        {batch.requests.length} URLs • {batch.requester_email}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {batch.requests.map(request => (
                        <div key={request.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono">{getStrikeTypeIcon(request.strike_type)}</span>
                              <span className="text-sm font-medium">{request.platform}</span>
                              <Badge variant="outline" className="text-xs">
                                {request.strike_type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 truncate">{request.url}</p>
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={request.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm font-medium mb-1">Reason:</p>
                      <p className="text-sm text-gray-700">{batch.requests[0].reason}</p>
                    </div>

                    <Textarea
                      placeholder="Admin decision reason..."
                      value={adminReason}
                      onChange={(e) => setAdminReason(e.target.value)}
                      className="min-h-[60px]"
                    />

                    <div className="flex gap-2">
                      <Button
                        onClick={() => approveBatch(batch.batch_id)}
                        disabled={!adminReason.trim()}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Batch
                      </Button>
                      <Button
                        onClick={() => rejectBatch(batch.batch_id)}
                        disabled={!adminReason.trim()}
                        variant="destructive"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Batch
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="approved">
          <div className="space-y-4">
            {approvedBatches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No approved batches awaiting execution
              </div>
            ) : (
              approvedBatches.map(batch => (
                <Card key={batch.batch_id} className="border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Batch {batch.batch_id.slice(0, 8)}...</span>
                        <Badge className={getStatusColor(batch.status)} variant="secondary">
                          READY TO EXECUTE
                        </Badge>
                        <p className="text-sm text-gray-600">{batch.requests.length} URLs</p>
                      </div>
                      <Button
                        onClick={() => executeBatch(batch.batch_id)}
                        disabled={executingBatch === batch.batch_id}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {executingBatch === batch.batch_id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Executing...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Execute Strike Batch
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="executing">
          <div className="space-y-4">
            {executingBatches.map(batch => (
              <Card key={batch.batch_id} className="border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span className="font-medium">Executing Batch {batch.batch_id.slice(0, 8)}...</span>
                    <Badge className={getStatusColor(batch.status)} variant="secondary">
                      IN PROGRESS
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-4">
            {completedBatches.map(batch => (
              <Card key={batch.batch_id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Batch {batch.batch_id.slice(0, 8)}...</span>
                      <Badge className={getStatusColor(batch.status)} variant="secondary">
                        {batch.status.toUpperCase()}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        {batch.requests.filter(r => r.status === 'completed').length}/{batch.requests.length} successful
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {batch.requests[0]?.executed_at && 
                        new Date(batch.requests[0].executed_at).toLocaleString()
                      }
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStrikeDashboard;
