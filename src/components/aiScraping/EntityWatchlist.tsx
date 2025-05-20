
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Trash2, RefreshCw, AlertCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { EntityWatchlist as EntityWatchlistType } from '@/types/aiScraping';

// Importing this service will be implemented next, we're just defining the interface here
import { 
  getWatchlistEntities, 
  updateWatchlistEntity, 
  deleteWatchlistEntity,
  runWatchlistScan
} from '@/services/watchlistService';

const EntityWatchlist = () => {
  const [watchlistEntities, setWatchlistEntities] = useState<EntityWatchlistType[]>([]);
  const [isAddingEntity, setIsAddingEntity] = useState(false);
  const [newEntity, setNewEntity] = useState<Partial<EntityWatchlistType>>({
    name: '',
    type: 'organization',
    keywords: [],
    sources: [],
    alertThreshold: 5,
    scanFrequency: 'daily',
    autoRespond: false
  });
  const [keyword, setKeyword] = useState('');
  const [availableSources, setAvailableSources] = useState<string[]>([
    'google', 'news', 'rss', 'custom-search', 'headless', 'common-crawl'
  ]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // In a real implementation, this would load from an API or database
    // For now, we'll use a mock implementation
    const loadEntities = async () => {
      try {
        const entities = await getWatchlistEntities();
        setWatchlistEntities(entities);
      } catch (error) {
        console.error("Error loading watchlist entities:", error);
      }
    };
    
    loadEntities();
  }, []);

  const handleAddKeyword = () => {
    if (keyword && !newEntity.keywords?.includes(keyword)) {
      setNewEntity({
        ...newEntity,
        keywords: [...(newEntity.keywords || []), keyword]
      });
      setKeyword('');
    }
  };

  const handleRemoveKeyword = (indexToRemove: number) => {
    setNewEntity({
      ...newEntity,
      keywords: newEntity.keywords?.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleSourceToggle = (source: string) => {
    const currentSources = newEntity.sources || [];
    if (currentSources.includes(source)) {
      setNewEntity({
        ...newEntity,
        sources: currentSources.filter(s => s !== source)
      });
    } else {
      setNewEntity({
        ...newEntity,
        sources: [...currentSources, source]
      });
    }
  };

  const handleAddEntity = async () => {
    if (!newEntity.name) {
      toast.error("Entity name is required");
      return;
    }

    if (!newEntity.keywords?.length) {
      toast.error("At least one keyword is required");
      return;
    }

    if (!newEntity.sources?.length) {
      toast.error("At least one source is required");
      return;
    }

    try {
      const entity: EntityWatchlistType = {
        id: `entity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: newEntity.name,
        type: newEntity.type as 'person' | 'organization' | 'location',
        keywords: newEntity.keywords || [],
        sources: newEntity.sources || [],
        alertThreshold: newEntity.alertThreshold || 5,
        scanFrequency: newEntity.scanFrequency as 'daily' | 'weekly' | 'monthly',
        autoRespond: newEntity.autoRespond || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await updateWatchlistEntity(entity);
      setWatchlistEntities([...watchlistEntities, entity]);
      setIsAddingEntity(false);
      setNewEntity({
        name: '',
        type: 'organization',
        keywords: [],
        sources: [],
        alertThreshold: 5,
        scanFrequency: 'daily',
        autoRespond: false
      });

      toast.success("Entity added to watchlist", {
        description: `${entity.name} will be monitored according to your settings`
      });
    } catch (error) {
      console.error("Error adding watchlist entity:", error);
      toast.error("Failed to add entity to watchlist");
    }
  };

  const handleScanEntity = async (entity: EntityWatchlistType) => {
    setIsScanning(true);
    
    try {
      const results = await runWatchlistScan(entity.id);
      
      toast.success(`Scan complete for ${entity.name}`, {
        description: `Found ${results.length} mentions. Check Results tab for details.`
      });
      
      // Update the entity's last scan timestamp
      const updatedEntity = {
        ...entity,
        lastScan: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await updateWatchlistEntity(updatedEntity);
      
      setWatchlistEntities(
        watchlistEntities.map(e => e.id === entity.id ? updatedEntity : e)
      );
    } catch (error) {
      console.error("Error scanning entity:", error);
      toast.error(`Failed to scan ${entity.name}`);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDeleteEntity = async (id: string) => {
    try {
      await deleteWatchlistEntity(id);
      setWatchlistEntities(watchlistEntities.filter(e => e.id !== id));
      toast.success("Entity removed from watchlist");
    } catch (error) {
      console.error("Error deleting watchlist entity:", error);
      toast.error("Failed to remove entity from watchlist");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Entity Watchlist</h2>
        <Dialog open={isAddingEntity} onOpenChange={setIsAddingEntity}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Entity to Watchlist</DialogTitle>
              <DialogDescription>
                Monitor people, companies, or locations for reputation risks.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Entity Name</Label>
                  <Input 
                    id="name" 
                    value={newEntity.name} 
                    onChange={(e) => setNewEntity({...newEntity, name: e.target.value})}
                    placeholder="e.g., Acme Corporation, John Smith" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Entity Type</Label>
                  <Select 
                    value={newEntity.type} 
                    onValueChange={(value) => setNewEntity({
                      ...newEntity, 
                      type: value as 'person' | 'organization' | 'location'
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="person">Person</SelectItem>
                      <SelectItem value="organization">Organization</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Keywords</Label>
                <div className="flex space-x-2">
                  <Input 
                    value={keyword} 
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Add a keyword" 
                    onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                  />
                  <Button type="button" onClick={handleAddKeyword}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newEntity.keywords?.map((kw, index) => (
                    <Badge key={index} variant="secondary" className="px-2 py-1">
                      {kw}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveKeyword(index)}
                        className="ml-1 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                {newEntity.keywords?.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No keywords added yet</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Data Sources</Label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSources.map((source) => (
                    <div key={source} className="flex items-center space-x-2">
                      <Switch 
                        checked={(newEntity.sources || []).includes(source)}
                        onCheckedChange={() => handleSourceToggle(source)}
                      />
                      <Label>
                        {source.charAt(0).toUpperCase() + source.slice(1).replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertThreshold">
                  Alert Threshold: {newEntity.alertThreshold}/10
                </Label>
                <Slider 
                  id="alertThreshold"
                  min={1} 
                  max={10} 
                  step={1}
                  value={[newEntity.alertThreshold || 5]} 
                  onValueChange={(value) => setNewEntity({...newEntity, alertThreshold: value[0]})}
                />
                <p className="text-xs text-muted-foreground">
                  Only generate alerts for risks at or above this score
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Scan Frequency</Label>
                <Select 
                  value={newEntity.scanFrequency} 
                  onValueChange={(value) => setNewEntity({
                    ...newEntity, 
                    scanFrequency: value as 'daily' | 'weekly' | 'monthly'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scan frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="autoRespond" 
                  checked={newEntity.autoRespond} 
                  onCheckedChange={(checked) => setNewEntity({...newEntity, autoRespond: checked})}
                />
                <Label htmlFor="autoRespond">Generate responses automatically</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingEntity(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEntity}>
                Add Entity
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-4">
            <TabsTrigger value="all">All Entities</TabsTrigger>
            <TabsTrigger value="person">People</TabsTrigger>
            <TabsTrigger value="organization">Organizations</TabsTrigger>
            <TabsTrigger value="location">Locations</TabsTrigger>
          </TabsList>
        </Tabs>

        {watchlistEntities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No entities in watchlist yet. Add your first entity to start monitoring.
          </div>
        ) : (
          <div className="space-y-4">
            {watchlistEntities.map((entity) => (
              <Card key={entity.id} className="p-4 bg-card">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{entity.name}</h3>
                      <Badge variant="outline">
                        {entity.type.charAt(0).toUpperCase() + entity.type.slice(1)}
                      </Badge>
                      {entity.autoRespond && (
                        <Badge variant="secondary">Auto-Response</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {entity.keywords.join(', ')}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Alert threshold: {entity.alertThreshold}/10
                      <Eye className="h-3 w-3 ml-3 mr-1" />
                      Frequency: {entity.scanFrequency}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={isScanning}
                      onClick={() => handleScanEntity(entity)}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
                      Scan Now
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600"
                      onClick={() => handleDeleteEntity(entity.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {entity.lastScan && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last scanned: {new Date(entity.lastScan).toLocaleString()}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EntityWatchlist;
