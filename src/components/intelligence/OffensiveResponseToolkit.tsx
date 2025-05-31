
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ActorDisruption {
  id: string;
  actor_handle: string;
  platform: string;
  evidence_url: string;
  disruption_type: string;
  status: string;
  reason: string;
}

const OffensiveResponseToolkit = () => {
  const [disruptions, setDisruptions] = useState<ActorDisruption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDisruptions();
  }, []);

  const loadDisruptions = async () => {
    try {
      // Use existing scan_results as substitute for actor disruption events
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .eq('threat_type', 'actor_disruption')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading disruptions:', error);
        return;
      }

      // Transform data to match interface
      const disruptionData: ActorDisruption[] = (data || []).map(item => ({
        id: item.id,
        actor_handle: `Actor_${item.id.slice(0, 8)}`,
        platform: item.platform || 'Unknown',
        evidence_url: item.url || '',
        disruption_type: 'counter_narrative',
        status: item.status || 'pending',
        reason: item.content || 'Automated disruption'
      }));

      setDisruptions(disruptionData);
    } catch (error) {
      console.error('Error in loadDisruptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const executeDisruption = async (id: string) => {
    try {
      // Log disruption execution
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          action: 'execute_disruption',
          details: `Executed disruption for actor: ${id}`,
          entity_type: 'offensive_response'
        });

      if (error) throw error;

      toast.success('Disruption executed successfully');
      loadDisruptions(); // Refresh data
    } catch (error) {
      console.error('Error executing disruption:', error);
      toast.error('Failed to execute disruption');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-6 w-6" />
            Offensive Response Toolkit
          </CardTitle>
          <p className="text-sm text-red-600">
            High-impact response capabilities for threat neutralization
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {disruptions.map((disruption) => (
              <Card key={disruption.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{disruption.actor_handle}</h4>
                      <p className="text-sm text-muted-foreground">
                        Platform: {disruption.platform} • Type: {disruption.disruption_type}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {disruption.reason}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(disruption.status)}>
                        {disruption.status}
                      </Badge>
                      {disruption.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => executeDisruption(disruption.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          Execute
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {disruptions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No active disruption operations</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OffensiveResponseToolkit;
