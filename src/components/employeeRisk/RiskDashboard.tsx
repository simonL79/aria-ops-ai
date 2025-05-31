
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RiskSummary {
  id: string;
  entity_name: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  threat_count: number;
  last_updated: string;
}

const RiskDashboard = () => {
  const [riskSummaries, setRiskSummaries] = useState<RiskSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = async () => {
    try {
      // Use existing scan_results table to generate risk summaries
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Transform scan results into risk summaries
      const summaries: RiskSummary[] = (data || []).map((result, index) => ({
        id: result.id,
        entity_name: `Entity ${index + 1}`,
        risk_level: result.severity as 'low' | 'medium' | 'high' | 'critical',
        threat_count: 1,
        last_updated: result.created_at
      }));

      setRiskSummaries(summaries);
    } catch (error) {
      console.error('Error loading risk data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Users className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Risk Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {riskSummaries.map((summary) => (
              <Card key={summary.id} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{summary.entity_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {summary.threat_count} threats detected
                      </p>
                    </div>
                    <Badge className={`${getRiskColor(summary.risk_level)} text-white`}>
                      {summary.risk_level}
                    </Badge>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Last updated: {new Date(summary.last_updated).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {riskSummaries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No risk data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskDashboard;
