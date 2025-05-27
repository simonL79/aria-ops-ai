import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Target, Zap, TrendingDown, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import MemoryFootprintsList from './MemoryFootprintsList';
import DecayProfilesPanel from './DecayProfilesPanel';
import MemoryRecalibratorsPanel from './MemoryRecalibratorsPanel';
import AddMemoryFootprintDialog from './AddMemoryFootprintDialog';

interface EideticStats {
  totalFootprints: number;
  activeFootprints: number;
  avgDecayScore: number;
  pendingActions: number;
  deployedRecalibrators: number;
  effectivenessScore: number;
}

const EideticDashboard = () => {
  const [stats, setStats] = useState<EideticStats>({
    totalFootprints: 0,
    activeFootprints: 0,
    avgDecayScore: 0,
    pendingActions: 0,
    deployedRecalibrators: 0,
    effectivenessScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      // Get memory footprints stats
      const { data: footprints, error: footprintsError } = await supabase
        .from('memory_footprints')
        .select('decay_score, is_active');

      if (footprintsError) throw footprintsError;

      // Get decay profiles stats
      const { data: profiles, error: profilesError } = await supabase
        .from('memory_decay_profiles')
        .select('action_status');

      if (profilesError) throw profilesError;

      // Get recalibrators stats
      const { data: recalibrators, error: recalibratorsError } = await supabase
        .from('memory_recalibrators')
        .select('is_deployed, effectiveness_score');

      if (recalibratorsError) throw recalibratorsError;

      const totalFootprints = footprints?.length || 0;
      const activeFootprints = footprints?.filter(f => f.is_active).length || 0;
      const avgDecayScore = footprints?.length ? 
        footprints.reduce((sum, f) => sum + (f.decay_score || 0), 0) / footprints.length : 0;
      
      const pendingActions = profiles?.filter(p => p.action_status === 'pending').length || 0;
      const deployedRecalibrators = recalibrators?.filter(r => r.is_deployed).length || 0;
      const effectivenessScore = recalibrators?.length ? 
        recalibrators.reduce((sum, r) => sum + (r.effectiveness_score || 0), 0) / recalibrators.length : 0;

      setStats({
        totalFootprints,
        activeFootprints,
        avgDecayScore: Math.round(avgDecayScore * 100) / 100,
        pendingActions,
        deployedRecalibrators,
        effectivenessScore: Math.round(effectivenessScore * 100) / 100
      });

    } catch (error) {
      console.error('Error loading EIDETIC stats:', error);
      toast.error('Failed to load EIDETIC statistics');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      toast.success('EIDETIC™ data refreshed');
      loadStats();
    } catch (error) {
      console.error('Error refreshing EIDETIC data:', error);
      toast.error('Failed to refresh data');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Brain className="h-8 w-8 animate-pulse mx-auto mb-2" />
            <p>Loading EIDETIC™ Memory Firewall...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8" />
            A.R.I.A™ EIDETIC™ Memory Firewall
          </h1>
          <p className="text-muted-foreground mt-1">
            Digital memory management, decay analysis & content recalibration
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={refreshData} variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            Add Memory Footprint
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Footprints</p>
                <p className="text-2xl font-bold">{stats.totalFootprints}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.activeFootprints}</p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Decay</p>
                <p className="text-2xl font-bold">{stats.avgDecayScore}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Actions</p>
                <p className="text-2xl font-bold">{stats.pendingActions}</p>
              </div>
              <Target className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Deployed</p>
                <p className="text-2xl font-bold">{stats.deployedRecalibrators}</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Effectiveness</p>
                <p className="text-2xl font-bold">{stats.effectivenessScore}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="footprints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="footprints">Memory Footprints</TabsTrigger>
          <TabsTrigger value="decay">Decay Profiles</TabsTrigger>
          <TabsTrigger value="recalibrators">Recalibrators</TabsTrigger>
        </TabsList>

        <TabsContent value="footprints">
          <MemoryFootprintsList onFootprintAdded={loadStats} />
        </TabsContent>

        <TabsContent value="decay">
          <DecayProfilesPanel />
        </TabsContent>

        <TabsContent value="recalibrators">
          <MemoryRecalibratorsPanel />
        </TabsContent>
      </Tabs>

      <AddMemoryFootprintDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onFootprintAdded={loadStats}
      />
    </div>
  );
};

export default EideticDashboard;
