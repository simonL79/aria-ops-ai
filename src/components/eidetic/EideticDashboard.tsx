import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Search, TrendingDown, Archive } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { scanMemoryFootprints, calculateDecayScores, triggerMemoryRecalibration } from '@/services/eidetic/eideticService';
import MemoryFootprintsList from './MemoryFootprintsList';
import DecayProfilesPanel from './DecayProfilesPanel';
import MemoryRecalibratorsPanel from './MemoryRecalibratorsPanel';
import AddMemoryFootprintDialog from './AddMemoryFootprintDialog';
import { toast } from 'sonner';

const EideticDashboard = () => {
  const [searchEntity, setSearchEntity] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [memoryFootprints, setMemoryFootprints] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [stats, setStats] = useState({
    totalFootprints: 0,
    activeFootprints: 0,
    decayingFootprints: 0,
    archivedFootprints: 0
  });

  useEffect(() => {
    loadMemoryFootprints();
  }, []);

  const loadMemoryFootprints = async () => {
    try {
      // Load from database
      const { data, error } = await supabase
        .from('memory_footprints')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setMemoryFootprints(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error loading memory footprints:', error);
    }
  };

  const calculateStats = (footprints) => {
    setStats({
      totalFootprints: footprints.length,
      activeFootprints: footprints.filter(f => f.is_active === true).length,
      decayingFootprints: footprints.filter(f => f.decay_score > 0.5).length,
      archivedFootprints: footprints.filter(f => f.is_active === false).length
    });
  };

  const handleScanEntity = async () => {
    if (!searchEntity.trim()) {
      toast.error('Please enter an entity name');
      return;
    }

    setIsScanning(true);
    try {
      const footprints = await scanMemoryFootprints(searchEntity);
      if (footprints.length > 0) {
        loadMemoryFootprints(); // Refresh the list
      }
    } catch (error) {
      console.error('Error scanning entity:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleRecalculateDecay = async () => {
    try {
      const activeFootprintIds = memoryFootprints
        .filter(f => f.is_active === true)
        .map(f => f.id);
      
      if (activeFootprintIds.length > 0) {
        await calculateDecayScores(activeFootprintIds);
        loadMemoryFootprints();
      }
    } catch (error) {
      console.error('Error recalculating decay:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            A.R.I.A™ EIDETIC™
          </h1>
          <p className="text-muted-foreground mt-1">
            Memory footprint analysis & decay management
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button onClick={handleRecalculateDecay} variant="outline" size="sm">
            Recalculate Decay
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            Add Memory Footprint
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Footprints</p>
                <p className="text-2xl font-bold">{stats.totalFootprints}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
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
              <Search className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Decaying</p>
                <p className="text-2xl font-bold">{stats.decayingFootprints}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Archived</p>
                <p className="text-2xl font-bold">{stats.archivedFootprints}</p>
              </div>
              <Archive className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Entity Scanner */}
      <Card>
        <CardHeader>
          <CardTitle>Memory Footprint Scanner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchEntity}
              onChange={(e) => setSearchEntity(e.target.value)}
              placeholder="Enter entity name to scan memory footprints..."
              className="flex-1"
            />
            <Button 
              onClick={handleScanEntity} 
              disabled={isScanning}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {isScanning ? 'Scanning...' : 'Scan Entity'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="footprints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="footprints">Memory Footprints</TabsTrigger>
          <TabsTrigger value="decay">Decay Profiles</TabsTrigger>
          <TabsTrigger value="recalibrators">Memory Recalibrators</TabsTrigger>
        </TabsList>

        <TabsContent value="footprints">
          <MemoryFootprintsList 
            onFootprintAdded={loadMemoryFootprints}
          />
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
        onFootprintAdded={loadMemoryFootprints}
      />
    </div>
  );
};

export default EideticDashboard;
