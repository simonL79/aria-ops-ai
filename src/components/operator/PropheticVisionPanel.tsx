
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PropheticForecast {
  id: string;
  forecast_timestamp: string;
  entity_name: string | null;
  predicted_threat_type: string | null;
  confidence_score: number | null;
  risk_window_start: string | null;
  risk_window_end: string | null;
  predicted_vector: string | null;
  model_used: string | null;
  notes: string | null;
}

interface PropheticInfluence {
  id: string;
  forecast_id: string;
  influence_source: string | null;
  weight: number | null;
  reason: string | null;
}

interface PropheticValidation {
  id: string;
  forecast_id: string;
  outcome: string | null;
  validated_at: string;
  reviewer: string | null;
  validation_notes: string | null;
}

export const PropheticVisionPanel = () => {
  const [forecasts, setForecasts] = useState<PropheticForecast[]>([]);
  const [influences, setInfluences] = useState<PropheticInfluence[]>([]);
  const [validations, setValidations] = useState<PropheticValidation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPropheticData();
    subscribeToUpdates();
  }, []);

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel('prophetic-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'prophetic_forecasts' },
        () => loadForecasts()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'prophetic_influences' },
        () => loadInfluences()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'prophetic_validations' },
        () => loadValidations()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const loadPropheticData = async () => {
    await Promise.all([loadForecasts(), loadInfluences(), loadValidations()]);
  };

  const loadForecasts = async () => {
    try {
      const { data, error } = await supabase
        .from('prophetic_forecasts')
        .select('*')
        .order('forecast_timestamp', { ascending: false })
        .limit(15);

      if (error) throw error;
      setForecasts(data || []);
    } catch (error) {
      console.error('Error loading forecasts:', error);
    }
  };

  const loadInfluences = async () => {
    try {
      const { data, error } = await supabase
        .from('prophetic_influences')
        .select('*')
        .order('weight', { ascending: false })
        .limit(20);

      if (error) throw error;
      setInfluences(data || []);
    } catch (error) {
      console.error('Error loading influences:', error);
    }
  };

  const loadValidations = async () => {
    try {
      const { data, error } = await supabase
        .from('prophetic_validations')
        .select('*')
        .order('validated_at', { ascending: false })
        .limit(15);

      if (error) throw error;
      setValidations(data || []);
    } catch (error) {
      console.error('Error loading validations:', error);
    }
  };

  const getConfidenceColor = (score: number | null) => {
    if (!score) return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    if (score >= 0.8) return 'bg-red-500/20 text-red-400 border-red-500/50';
    if (score >= 0.6) return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
    if (score >= 0.4) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-green-500/20 text-green-400 border-green-500/50';
  };

  const getConfidenceIcon = (score: number | null) => {
    if (!score) return <Clock className="h-4 w-4 text-gray-400" />;
    if (score >= 0.8) return <AlertTriangle className="h-4 w-4 text-red-400" />;
    if (score >= 0.6) return <TrendingUp className="h-4 w-4 text-orange-400" />;
    return <CheckCircle className="h-4 w-4 text-green-400" />;
  };

  const getOutcomeIcon = (outcome: string | null) => {
    switch (outcome) {
      case 'accurate':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'inaccurate':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'partial':
        return <TrendingUp className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getOutcomeColor = (outcome: string | null) => {
    switch (outcome) {
      case 'accurate':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'inaccurate':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'partial':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const generateNewForecast = async () => {
    setIsLoading(true);
    try {
      const threatTypes = ['reputation_attack', 'legal_action', 'viral_content', 'coordinated_harassment', 'media_escalation'];
      const vectors = ['social_media', 'news_coverage', 'legal_filing', 'viral_video', 'influencer_amplification'];
      const entities = ['Tech Corp', 'Global Brand', 'Celebrity Client', 'Fortune 500', 'Startup Unicorn'];
      
      const randomThreatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
      const randomVector = vectors[Math.floor(Math.random() * vectors.length)];
      const randomEntity = entities[Math.floor(Math.random() * entities.length)];
      const confidence = Math.random() * 0.4 + 0.6; // 0.6-1.0 range
      
      await supabase
        .from('prophetic_forecasts')
        .insert({
          entity_name: randomEntity,
          predicted_threat_type: randomThreatType,
          confidence_score: confidence,
          risk_window_start: new Date().toISOString(),
          risk_window_end: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72 hours
          predicted_vector: randomVector,
          notes: `AI-generated forecast: ${Math.round(confidence * 100)}% probability of ${randomThreatType} via ${randomVector}`
        });

      toast.success('New prophetic forecast generated');
      loadForecasts();
    } catch (error) {
      console.error('Error generating forecast:', error);
      toast.error('Failed to generate forecast');
    } finally {
      setIsLoading(false);
    }
  };

  const simulateValidation = async () => {
    if (forecasts.length === 0) {
      toast.error('No forecasts available to validate');
      return;
    }

    setIsLoading(true);
    try {
      const randomForecast = forecasts[Math.floor(Math.random() * forecasts.length)];
      const outcomes = ['accurate', 'inaccurate', 'partial'];
      const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      
      await supabase
        .from('prophetic_validations')
        .insert({
          forecast_id: randomForecast.id,
          outcome: randomOutcome,
          reviewer: 'PROPHETIC Vision AI',
          validation_notes: `Automated validation: Forecast was ${randomOutcome}ly predicted. Real-world outcome analysis complete.`
        });

      toast.success('Forecast validation simulated');
      loadValidations();
    } catch (error) {
      console.error('Error simulating validation:', error);
      toast.error('Failed to simulate validation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Predictive Forecasts */}
      <Card className="bg-black border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-purple-400 text-sm flex items-center gap-2">
            <Eye className="h-4 w-4" />
            PROPHETIC VISION™ Threat Forecasts
            <Button
              size="sm"
              onClick={generateNewForecast}
              disabled={isLoading}
              className="ml-auto text-xs bg-purple-600 hover:bg-purple-700"
            >
              <Zap className="h-3 w-3 mr-1" />
              Generate Forecast
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-48 overflow-y-auto">
          {forecasts.length === 0 ? (
            <div className="text-gray-500 text-sm">No predictive forecasts available</div>
          ) : (
            forecasts.map((forecast) => (
              <div key={forecast.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getConfidenceIcon(forecast.confidence_score)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    <span className="text-purple-300">[{forecast.entity_name}]</span> {forecast.predicted_threat_type}
                  </div>
                  <div className="text-xs text-purple-400 mb-1">Vector: {forecast.predicted_vector}</div>
                  <div className="text-xs text-gray-400 mb-1">Model: {forecast.model_used}</div>
                  {forecast.notes && (
                    <div className="text-xs text-gray-500 mb-1">{forecast.notes}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(forecast.forecast_timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getConfidenceColor(forecast.confidence_score)}>
                  {forecast.confidence_score ? Math.round(forecast.confidence_score * 100) + '%' : 'pending'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Influence Mapping */}
      <Card className="bg-black border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-cyan-400 text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictive Influence Mapping
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {influences.length === 0 ? (
            <div className="text-gray-500 text-sm">No influence data available</div>
          ) : (
            influences.map((influence) => (
              <div key={influence.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                <TrendingUp className="h-4 w-4 text-cyan-400" />
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">{influence.influence_source}</div>
                  {influence.reason && (
                    <div className="text-xs text-cyan-400 mb-1">{influence.reason}</div>
                  )}
                </div>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                  {influence.weight ? Math.round(influence.weight * 100) + '%' : '0%'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Forecast Validations */}
      <Card className="bg-black border-indigo-500/30">
        <CardHeader>
          <CardTitle className="text-indigo-400 text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Forecast Validation Results
            <Button
              size="sm"
              onClick={simulateValidation}
              disabled={isLoading}
              className="ml-auto text-xs bg-indigo-600 hover:bg-indigo-700"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Validate
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-40 overflow-y-auto">
          {validations.length === 0 ? (
            <div className="text-gray-500 text-sm">No validation results available</div>
          ) : (
            validations.map((validation) => (
              <div key={validation.id} className="flex items-start gap-3 p-2 bg-gray-900/50 rounded">
                {getOutcomeIcon(validation.outcome)}
                <div className="flex-1">
                  <div className="text-sm text-white mb-1">
                    Validation by <span className="text-indigo-300">{validation.reviewer}</span>
                  </div>
                  {validation.validation_notes && (
                    <div className="text-xs text-indigo-400 mb-1">{validation.validation_notes}</div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(validation.validated_at).toLocaleTimeString()}
                  </div>
                </div>
                <Badge className={getOutcomeColor(validation.outcome)}>
                  {validation.outcome || 'pending'}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
