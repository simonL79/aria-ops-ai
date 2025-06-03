
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Users, TrendingUp, AlertTriangle, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EntityFingerprint {
  id: string;
  entity_id: string;
  primary_name: string;
  aliases: string[];
  organization?: string;
  locations: string[];
  context_tags: string[];
  false_positive_blocklist: string[];
  created_at: string;
  updated_at: string;
}

interface PrecisionStats {
  total_queries: number;
  total_matched: number;
  avg_precision_score: number;
  confidence_level: string;
  false_positive_rate: number;
}

const EntityPrecisionDashboard = () => {
  const [fingerprints, setFingerprints] = useState<EntityFingerprint[]>([]);
  const [stats, setStats] = useState<PrecisionStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadEntityFingerprints = async () => {
    try {
      const { data, error } = await supabase
        .from('entity_fingerprints_advanced')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform Supabase Json types to proper arrays
      const transformedData = data?.map(item => ({
        ...item,
        aliases: Array.isArray(item.aliases) ? item.aliases : [],
        locations: Array.isArray(item.locations) ? item.locations : [],
        context_tags: Array.isArray(item.context_tags) ? item.context_tags : [],
        false_positive_blocklist: Array.isArray(item.false_positive_blocklist) ? item.false_positive_blocklist : []
      })) || [];

      setFingerprints(transformedData);
    } catch (error) {
      console.error('Error loading entity fingerprints:', error);
      toast.error('Failed to load entity fingerprints');
    }
  };

  const loadPrecisionStats = async () => {
    try {
      const { data, error } = await supabase
        .from('entity_precision_stats')
        .select('*')
        .order('scan_date', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setStats(data);
    } catch (error) {
      console.error('Error loading precision stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadEntityFingerprints(), loadPrecisionStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Precision Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Precision Score</p>
                <p className="text-2xl font-bold">{stats ? (stats.avg_precision_score * 100).toFixed(1) : '0.0'}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Entities Tracked</p>
                <p className="text-2xl font-bold">{fingerprints.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Queries Executed</p>
                <p className="text-2xl font-bold">{stats?.total_queries || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">False Positive Rate</p>
                <p className="text-2xl font-bold">{stats ? (stats.false_positive_rate * 100).toFixed(2) : '0.00'}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entity Fingerprints */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Entity Fingerprints
            </CardTitle>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Entity
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {fingerprints.length === 0 ? (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Entity Fingerprints</h3>
              <p className="text-muted-foreground">Create your first entity fingerprint to enable CIA-level precision</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fingerprints.map(fingerprint => (
                <div key={fingerprint.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{fingerprint.primary_name}</h3>
                    <Badge variant="outline">{fingerprint.aliases.length} aliases</Badge>
                  </div>
                  {fingerprint.organization && (
                    <p className="text-sm text-muted-foreground mb-2">{fingerprint.organization}</p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {fingerprint.locations.map(location => (
                      <Badge key={location} variant="secondary" className="text-xs">
                        {location}
                      </Badge>
                    ))}
                    {fingerprint.context_tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
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

export default EntityPrecisionDashboard;
