
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Clock, Play, Pause, RotateCcw, User } from 'lucide-react';

interface QueueItem {
  id: string;
  employee_id: string;
  priority: number;
  status: string;
  retry_count: number;
  max_retries: number;
  error_message: string;
  created_at: string;
  company_employees: {
    full_name: string;
    email: string;
    companies: { name: string };
  };
}

const ScanQueue = () => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueueItems();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('scan_queue_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'employee_scan_queue' },
        () => {
          fetchQueueItems();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchQueueItems = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_scan_queue')
        .select(`
          *,
          company_employees (
            full_name,
            email,
            companies (name)
          )
        `)
        .order('priority', { ascending: false })
        .order('created_at');

      if (error) throw error;
      setQueueItems(data || []);
    } catch (error) {
      console.error('Error fetching queue items:', error);
      toast.error('Failed to fetch scan queue');
    } finally {
      setLoading(false);
    }
  };

  const updateQueueStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('employee_scan_queue')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      toast.success(`Scan ${status} successfully`);
      fetchQueueItems();
    } catch (error) {
      console.error('Error updating queue status:', error);
      toast.error('Failed to update scan status');
    }
  };

  const retryFailedScan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('employee_scan_queue')
        .update({ 
          status: 'queued',
          retry_count: 0,
          error_message: null
        })
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Scan queued for retry');
      fetchQueueItems();
    } catch (error) {
      console.error('Error retrying scan:', error);
      toast.error('Failed to retry scan');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      queued: { variant: 'outline' as const, text: 'Queued', icon: Clock },
      processing: { variant: 'default' as const, text: 'Processing', icon: Play },
      completed: { variant: 'secondary' as const, text: 'Completed', icon: Play },
      failed: { variant: 'destructive' as const, text: 'Failed', icon: Pause },
      retrying: { variant: 'secondary' as const, text: 'Retrying', icon: RotateCcw }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.queued;
    const Icon = statusInfo.icon;
    
    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 8) return <Badge variant="destructive">High</Badge>;
    if (priority >= 5) return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="outline">Low</Badge>;
  };

  if (loading) {
    return <div className="text-center p-8">Loading scan queue...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scan Queue</h2>
        <div className="text-sm text-gray-600">
          {queueItems.filter(item => item.status === 'queued').length} queued, 
          {queueItems.filter(item => item.status === 'processing').length} processing
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Scan Queue</CardTitle>
        </CardHeader>
        <CardContent>
          {queueItems.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scans in queue</h3>
              <p className="text-gray-500">
                Employee scans will appear here when they are queued for processing.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {queueItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <h3 className="font-semibold">{item.company_employees.full_name}</h3>
                        <p className="text-sm text-gray-600">
                          {item.company_employees.companies.name} • {item.company_employees.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(item.priority)}
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-500">Priority:</span>
                      <div className="font-medium">{item.priority}/10</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Retries:</span>
                      <div className="font-medium">{item.retry_count}/{item.max_retries}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Queued:</span>
                      <div className="font-medium">
                        {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <div className="font-medium">{item.status}</div>
                    </div>
                  </div>

                  {item.error_message && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">
                        <strong>Error:</strong> {item.error_message}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {item.status === 'queued' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => updateQueueStatus(item.id, 'processing')}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    )}
                    
                    {item.status === 'processing' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => updateQueueStatus(item.id, 'queued')}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </Button>
                    )}
                    
                    {item.status === 'failed' && item.retry_count < item.max_retries && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => retryFailedScan(item.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Retry
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanQueue;
