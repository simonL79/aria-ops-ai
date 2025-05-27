
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Zap, Target, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MemoryRecalibrator {
  id: string;
  footprint_id: string;
  asset_url: string;
  recalibration_type: string;
  content_excerpt: string;
  full_text: string;
  is_deployed: boolean;
  deployed_at: string;
  effectiveness_score: number;
  created_at: string;
  memory_footprints?: {
    content_url: string;
    memory_type: string;
  };
}

const MemoryRecalibratorsPanel = () => {
  const [recalibrators, setRecalibrators] = useState<MemoryRecalibrator[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecalibrators();
  }, []);

  const loadRecalibrators = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('memory_recalibrators')
        .select(`
          *,
          memory_footprints (
            content_url,
            memory_type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecalibrators(data || []);
    } catch (error) {
      console.error('Error loading memory recalibrators:', error);
      toast.error('Failed to load memory recalibrators');
    } finally {
      setLoading(false);
    }
  };

  const deployRecalibrator = async (recalibratorId: string) => {
    try {
      const { error } = await supabase
        .from('memory_recalibrators')
        .update({ 
          is_deployed: true,
          deployed_at: new Date().toISOString()
        })
        .eq('id', recalibratorId);

      if (error) throw error;
      
      toast.success('Memory recalibrator deployed successfully');
      loadRecalibrators();
    } catch (error) {
      console.error('Error deploying recalibrator:', error);
      toast.error('Failed to deploy recalibrator');
    }
  };

  const updateEffectiveness = async (recalibratorId: string, score: number) => {
    try {
      const { error } = await supabase
        .from('memory_recalibrators')
        .update({ effectiveness_score: score })
        .eq('id', recalibratorId);

      if (error) throw error;
      
      toast.success('Effectiveness score updated');
      loadRecalibrators();
    } catch (error) {
      console.error('Error updating effectiveness:', error);
      toast.error('Failed to update effectiveness');
    }
  };

  const getRecalibrationType = (type: string) => {
    switch (type) {
      case 'counter-article': return { color: 'bg-red-500', icon: Target };
      case 'timeline-reframing': return { color: 'bg-blue-500', icon: Clock };
      case 'archive-saturation': return { color: 'bg-purple-500', icon: Zap };
      default: return { color: 'bg-gray-500', icon: Target };
    }
  };

  const getEffectivenessColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    if (score >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory Recalibrators & Counter-Content</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {recalibrators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No memory recalibrators created</p>
            </div>
          ) : (
            recalibrators.map((recalibrator) => {
              const typeInfo = getRecalibrationType(recalibrator.recalibration_type);
              const IconComponent = typeInfo.icon;
              
              return (
                <div key={recalibrator.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${typeInfo.color} text-white flex items-center gap-1`}>
                          <IconComponent className="h-3 w-3" />
                          {recalibrator.recalibration_type?.replace('-', ' ')}
                        </Badge>
                        {recalibrator.is_deployed ? (
                          <Badge className="bg-green-500 text-white">Deployed</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </div>
                      
                      <h3 className="font-medium mb-2">
                        Target: {recalibrator.memory_footprints?.content_url}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {recalibrator.content_excerpt}
                      </p>
                      
                      {recalibrator.effectiveness_score > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Effectiveness</span>
                            <span className={`text-sm font-bold ${getEffectivenessColor(recalibrator.effectiveness_score)}`}>
                              {(recalibrator.effectiveness_score * 100).toFixed(0)}%
                            </span>
                          </div>
                          <Progress 
                            value={recalibrator.effectiveness_score * 100} 
                            className="h-2"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Created: {new Date(recalibrator.created_at).toLocaleDateString()}</span>
                        {recalibrator.deployed_at && (
                          <span>Deployed: {new Date(recalibrator.deployed_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {recalibrator.asset_url && (
                      <a 
                        href={recalibrator.asset_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Asset
                      </a>
                    )}
                    
                    <div className="flex gap-2">
                      {!recalibrator.is_deployed && (
                        <Button
                          size="sm"
                          onClick={() => deployRecalibrator(recalibrator.id)}
                        >
                          Deploy Recalibrator
                        </Button>
                      )}
                      
                      {recalibrator.is_deployed && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateEffectiveness(recalibrator.id, 0.9)}
                          >
                            High Effectiveness
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateEffectiveness(recalibrator.id, 0.5)}
                          >
                            Medium
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateEffectiveness(recalibrator.id, 0.2)}
                          >
                            Low
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryRecalibratorsPanel;
