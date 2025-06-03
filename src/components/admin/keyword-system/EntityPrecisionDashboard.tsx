
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

// Helper function to safely convert JSON arrays to string arrays
const jsonArrayToStringArray = (jsonArray: any): string[] => {
  if (!Array.isArray(jsonArray)) return [];
  return jsonArray.filter(item => typeof item === 'string');
};

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

      // Transform Supabase data with proper type conversion
      const transformedData: EntityFingerprint[] = (data || []).map(item => ({
        id: item.id,
        entity_id: item.entity_id,
        primary_name: item.primary_name,
        aliases: jsonArrayToStringArray(item.aliases),
        organization: item.organization || undefined,
        locations: jsonArrayToStringArray(item.locations),
        context_tags: jsonArrayToStringArray(item.context_tags),
        false_positive_blocklist: jsonArrayToStringArray(item.false_positive_blocklist),
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

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
      <Card className="corporate-card">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-corporate-accent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Precision Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="corporate-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Target className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-sm text-corporate-lightGray">Precision Score</p>
                <p className="text-3xl font-bold text-white">{stats ? (stats.avg_precision_score * 100).toFixed(1) : '0.0'}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Users className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-sm text-corporate-lightGray">Entities Tracked</p>
                <p className="text-3xl font-bold text-white">{fingerprints.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-purple-400" />
              <div>
                <p className="text-sm text-corporate-lightGray">Queries Executed</p>
                <p className="text-3xl font-bold text-white">{stats?.total_queries || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="corporate-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-sm text-corporate-lightGray">False Positive Rate</p>
                <p className="text-3xl font-bold text-white">{stats ? (stats.false_positive_rate * 100).toFixed(2) : '0.00'}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entity Fingerprints */}
      <Card className="corporate-card">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-white">
              <Target className="h-7 w-7 text-corporate-accent" />
              Entity Fingerprints
            </CardTitle>
            <Button size="default" className="corporate-button flex items-center gap-2 text-base">
              <Plus className="h-5 w-5" />
              Add Entity
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {fingerprints.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-corporate-lightGray mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-3 text-white">No Entity Fingerprints</h3>
              <p className="text-base text-corporate-lightGray max-w-md mx-auto leading-relaxed">
                Create your first entity fingerprint to enable CIA-level precision
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {fingerprints.map(fingerprint => (
                <div key={fingerprint.id} className="border border-corporate-border rounded-lg p-6 bg-corporate-darkTertiary hover:bg-corporate-darkSecondary transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                    <h3 className="font-semibold text-xl text-white">{fingerprint.primary_name}</h3>
                    <Badge variant="outline" className="border-corporate-border text-corporate-lightGray text-sm w-fit">
                      {fingerprint.aliases.length} aliases
                    </Badge>
                  </div>
                  {fingerprint.organization && (
                    <p className="text-base text-corporate-lightGray mb-4">{fingerprint.organization}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {fingerprint.locations.map(location => (
                      <Badge key={location} variant="secondary" className="text-sm bg-corporate-darkSecondary text-corporate-lightGray">
                        {location}
                      </Badge>
                    ))}
                    {fingerprint.context_tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-sm border-corporate-border text-corporate-lightGray">
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
