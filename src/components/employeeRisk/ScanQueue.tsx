
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Play, Pause } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QueueItem {
  id: string;
  employee_name: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  priority: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
}

const ScanQueue = () => {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQueueData();
  }, []);

  const loadQueueData = async () => {
    try {
      // Use existing employee_scan_queue table
      const { data, error } = await supabase
        .from('employee_scan_queue')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform data to match interface
      const items: QueueItem[] = (data || []).map(item => ({
        id: item.id,
        employee_name: `Employee ${item.employee_id?.slice(0, 8)}`,
        status: item.status as QueueItem['status'],
        priority: item.priority || 5,
        created_at: item.created_at,
        started_at: item.started_at,
        completed_at: item.completed_at,
        error_message: item.error_message
      }));

      setQueueItems(items);
    } catch (error) {
      console.error('Error loading queue data:', error);
      toast.error('Failed to load scan queue');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 8) return <Badge className="bg-red-100 text-red-800">High</Badge>;
    if (priority >= 5) return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    return <Badge className="bg-green-100 text-green-800">Low</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Clock className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-blue-500" />
            Scan Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {queueItems.map((item) => (
              <Card key={item.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{item.employee_name}</h4>
                        {getPriorityBadge(item.priority)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Created: {new Date(item.created_at).toLocaleString()}</span>
                        {item.started_at && (
                          <span>Started: {new Date(item.started_at).toLocaleString()}</span>
                        )}
                        {item.completed_at && (
                          <span>Completed: {new Date(item.completed_at).toLocaleString()}</span>
                        )}
                      </div>
                      {item.error_message && (
                        <p className="text-sm text-red-600 mt-2">{item.error_message}</p>
                      )}
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {queueItems.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No items in scan queue</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={loadQueueData} variant="outline">
              <Play className="w-4 h-4 mr-2" />
              Refresh Queue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanQueue;
