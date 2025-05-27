
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, TrendingDown, Target, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DecayProfile {
  id: string;
  footprint_id: string;
  relevancy_score: number;
  emotional_charge: string;
  legal_outcome: string;
  social_velocity: number;
  recommended_action: string;
  action_status: string;
  scheduled_for: string;
  decay_trigger: string;
  created_at: string;
  memory_footprints?: {
    content_url: string;
    memory_type: string;
    decay_score: number;
  };
}

const DecayProfilesPanel = () => {
  const [profiles, setProfiles] = useState<DecayProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDecayProfiles();
  }, []);

  const loadDecayProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('memory_decay_profiles')
        .select(`
          *,
          memory_footprints (
            content_url,
            memory_type,
            decay_score
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading decay profiles:', error);
      toast.error('Failed to load decay profiles');
    } finally {
      setLoading(false);
    }
  };

  const updateActionStatus = async (profileId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('memory_decay_profiles')
        .update({ action_status: status })
        .eq('id', profileId);

      if (error) throw error;
      
      toast.success(`Action marked as ${status}`);
      loadDecayProfiles();
    } catch (error) {
      console.error('Error updating action status:', error);
      toast.error('Failed to update status');
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'override': return 'bg-red-500';
      case 'contextualize': return 'bg-yellow-500';
      case 'ignore': return 'bg-gray-500';
      case 'saturate': return 'bg-blue-500';
      default: return 'bg-purple-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'executed': return 'bg-green-500';
      case 'pending': return 'bg-orange-500';
      case 'ignored': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  const getChargeIcon = (charge: string) => {
    switch (charge) {
      case 'high': return <Zap className="h-4 w-4 text-red-500" />;
      case 'medium': return <Target className="h-4 w-4 text-yellow-500" />;
      case 'low': return <Clock className="h-4 w-4 text-green-500" />;
      default: return <TrendingDown className="h-4 w-4 text-gray-500" />;
    }
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
        <CardTitle>Temporal Decay Profiles & AI Recommendations</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {profiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No decay profiles generated</p>
            </div>
          ) : (
            profiles.map((profile) => (
              <div key={profile.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getActionColor(profile.recommended_action)} text-white`}>
                        {profile.recommended_action}
                      </Badge>
                      <Badge className={`${getStatusColor(profile.action_status)} text-white`}>
                        {profile.action_status}
                      </Badge>
                      {getChargeIcon(profile.emotional_charge)}
                    </div>
                    
                    {profile.memory_footprints && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {profile.memory_footprints.content_url}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium">Relevancy Score</span>
                        <Progress 
                          value={(profile.relevancy_score || 0) * 100} 
                          className="h-2 mt-1"
                        />
                        <span className="text-xs text-muted-foreground">
                          {((profile.relevancy_score || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Social Velocity</span>
                        <Progress 
                          value={(profile.social_velocity || 0) * 100} 
                          className="h-2 mt-1"
                        />
                        <span className="text-xs text-muted-foreground">
                          {((profile.social_velocity || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                      
                      {profile.memory_footprints && (
                        <div>
                          <span className="text-sm font-medium">Decay Score</span>
                          <Progress 
                            value={(profile.memory_footprints.decay_score || 0) * 100} 
                            className="h-2 mt-1"
                          />
                          <span className="text-xs text-muted-foreground">
                            {((profile.memory_footprints.decay_score || 0) * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Emotional Charge: {profile.emotional_charge}</span>
                      <span>Legal: {profile.legal_outcome}</span>
                      <span>Trigger: {profile.decay_trigger}</span>
                      {profile.scheduled_for && (
                        <span>Scheduled: {new Date(profile.scheduled_for).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {profile.action_status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateActionStatus(profile.id, 'executed')}
                      >
                        Execute Action
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateActionStatus(profile.id, 'ignored')}
                      >
                        Ignore
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DecayProfilesPanel;
