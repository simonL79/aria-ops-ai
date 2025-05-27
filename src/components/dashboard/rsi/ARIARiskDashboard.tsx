
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  Target, 
  Zap,
  RefreshCw,
  TrendingUp,
  Activity
} from "lucide-react";
import { 
  getEntityRiskDashboard, 
  updateEntityRiskScores, 
  triggerRiskEscalations,
  type EntityRiskDashboard 
} from '@/services/aria/ariaThreatPulse';
import { toast } from 'sonner';

const ARIARiskDashboard = () => {
  const [riskData, setRiskData] = useState<EntityRiskDashboard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadRiskDashboard();
  }, []);

  const loadRiskDashboard = async () => {
    setIsLoading(true);
    try {
      const data = await getEntityRiskDashboard();
      setRiskData(data);
    } catch (error) {
      console.error('Error loading risk dashboard:', error);
      toast.error('Failed to load risk dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateScores = async () => {
    setIsUpdating(true);
    try {
      await updateEntityRiskScores();
      await loadRiskDashboard();
    } catch (error) {
      console.error('Error updating scores:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTriggerEscalations = async () => {
    try {
      await triggerRiskEscalations();
      await loadRiskDashboard();
    } catch (error) {
      console.error('Error triggering escalations:', error);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600 bg-red-100';
    if (score >= 0.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 0.8) return 'HIGH';
    if (score >= 0.5) return 'MEDIUM';
    return 'LOW';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading A.R.I.A™ Risk Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            A.R.I.A™ Integrated Risk Dashboard
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time entity risk scoring with RSI™/EIDETIC™ integration
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUpdateScores} disabled={isUpdating} size="sm" variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
            Update Scores
          </Button>
          <Button onClick={handleTriggerEscalations} size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Trigger Escalations
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entities</p>
                <p className="text-2xl font-bold">{riskData.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-red-600">
                  {riskData.filter(e => e.risk_score >= 0.8).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">RSI™ Triggered</p>
                <p className="text-2xl font-bold text-orange-600">
                  {riskData.filter(e => e.rsi_triggered).length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">EIDETIC™ Queued</p>
                <p className="text-2xl font-bold text-purple-600">
                  {riskData.filter(e => e.eidetic_queued).length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Entity List */}
      <Card>
        <CardHeader>
          <CardTitle>Entity Risk Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskData.length > 0 ? (
              riskData.slice(0, 20).map((entity) => (
                <div key={entity.entity_name} className="border rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{entity.entity_name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(entity.risk_score)}>
                        {getRiskLabel(entity.risk_score)}
                      </Badge>
                      <span className="text-sm font-medium">
                        {(entity.risk_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <Progress value={entity.risk_score * 100} className="mb-3" />
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Signals: {entity.total_signals}</span>
                    <div className="flex gap-4">
                      {entity.rsi_triggered && (
                        <Badge variant="outline" className="text-orange-600">
                          RSI™ Active
                        </Badge>
                      )}
                      {entity.eidetic_queued && (
                        <Badge variant="outline" className="text-purple-600">
                          EIDETIC™ Queued
                        </Badge>
                      )}
                      {entity.alert_pending && (
                        <Badge variant="outline" className="text-red-600">
                          Alert: {entity.alert_pending}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-2">
                    Last Updated: {new Date(entity.updated_at).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p>No risk profiles available</p>
                <p className="text-sm">Risk scores will appear as entities are detected</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ARIARiskDashboard;
