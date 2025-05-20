
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, RefreshCw, Link } from 'lucide-react';
import { ScrapingSource } from '@/types/aiScraping';
import { getAllSources, updateSource, toggleSourceEnabled, deleteSource } from '@/services/aiScrapingService';
import { toast } from 'sonner';

const SourcesManager = () => {
  const [sources, setSources] = useState<ScrapingSource[]>([]);
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newSource, setNewSource] = useState<Partial<ScrapingSource>>({
    name: '',
    type: 'google',
    enabled: true,
    config: { maxResults: 5 }
  });

  useEffect(() => {
    loadSources();
  }, []);

  const loadSources = () => {
    const loadedSources = getAllSources();
    setSources(loadedSources);
  };

  const handleToggleSource = (id: string, enabled: boolean) => {
    toggleSourceEnabled(id, enabled);
    loadSources();
    
    toast.success(`Source ${enabled ? 'enabled' : 'disabled'}`, {
      description: `Changes saved successfully`
    });
  };

  const handleDeleteSource = (id: string) => {
    deleteSource(id);
    loadSources();
    
    toast.success(`Source removed`, {
      description: `The source has been removed`
    });
  };

  const handleAddSource = () => {
    if (!newSource.name) {
      toast.error('Name is required');
      return;
    }
    
    const source: ScrapingSource = {
      id: `source-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newSource.name || '',
      type: (newSource.type as ScrapingSource['type']) || 'google',
      enabled: newSource.enabled || true,
      config: newSource.config
    };
    
    updateSource(source);
    loadSources();
    setIsAddingSource(false);
    setNewSource({
      name: '',
      type: 'google',
      enabled: true,
      config: { maxResults: 5 }
    });
    
    toast.success(`Source added`, {
      description: `"${source.name}" has been added to your sources`
    });
  };

  const handleRefreshSource = (source: ScrapingSource) => {
    // In a real implementation, this would trigger a refresh of the source
    updateSource({
      ...source,
      lastScan: new Date().toISOString()
    });
    loadSources();
    
    toast.success(`Source refreshed`, {
      description: `"${source.name}" has been refreshed`
    });
  };

  const getSourceTypeDescription = (type: ScrapingSource['type']) => {
    switch(type) {
      case 'google': return 'Uses Google Search via proxy APIs to find mentions';
      case 'news': return 'Aggregates news sources for relevant articles';
      case 'manual': return 'Manually entered content for analysis';
      case 'crawler': return 'Custom web crawler for specific sites';
      case 'zapier': return 'Integration with Zapier workflows';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Data Sources</h2>
        <Dialog open={isAddingSource} onOpenChange={setIsAddingSource}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Data Source</DialogTitle>
              <DialogDescription>
                Configure a new source for collecting reputation data
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Source Name</Label>
                <Input 
                  id="name" 
                  value={newSource.name} 
                  onChange={(e) => setNewSource({...newSource, name: e.target.value})}
                  placeholder="e.g., Google Search - Competitors" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Source Type</Label>
                <Select 
                  value={newSource.type} 
                  onValueChange={(value) => setNewSource({
                    ...newSource, 
                    type: value as ScrapingSource['type']
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Search</SelectItem>
                    <SelectItem value="news">News Aggregator</SelectItem>
                    <SelectItem value="crawler">Web Crawler</SelectItem>
                    <SelectItem value="manual">Manual Input</SelectItem>
                    <SelectItem value="zapier">Zapier Integration</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {getSourceTypeDescription(newSource.type as ScrapingSource['type'])}
                </p>
              </div>
              {newSource.type === 'zapier' && (
                <div className="space-y-2">
                  <Label htmlFor="webhook">Zapier Webhook URL</Label>
                  <Input 
                    id="webhook" 
                    value={newSource.config?.url || ''} 
                    onChange={(e) => setNewSource({
                      ...newSource, 
                      config: {...(newSource.config || {}), url: e.target.value}
                    })}
                    placeholder="https://hooks.zapier.com/..." 
                  />
                </div>
              )}
              {(newSource.type === 'google' || newSource.type === 'news') && (
                <div className="space-y-2">
                  <Label htmlFor="maxResults">Max Results</Label>
                  <Input 
                    id="maxResults" 
                    type="number"
                    min="1"
                    max="50"
                    value={newSource.config?.maxResults || 5} 
                    onChange={(e) => setNewSource({
                      ...newSource, 
                      config: {...(newSource.config || {}), maxResults: parseInt(e.target.value)}
                    })}
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="enabled" 
                  checked={newSource.enabled} 
                  onCheckedChange={(checked) => setNewSource({...newSource, enabled: checked})}
                />
                <Label htmlFor="enabled">Enable this source</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingSource(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSource}>
                Add Source
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {sources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No sources configured yet. Add your first source to get started.
          </div>
        ) : (
          sources.map((source) => (
            <div key={source.id} className="border rounded-lg p-4 bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{source.name}</h3>
                    <Badge variant={source.enabled ? "default" : "outline"}>
                      {source.type.charAt(0).toUpperCase() + source.type.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getSourceTypeDescription(source.type)}
                  </p>
                  {source.lastScan && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Last scan: {new Date(source.lastScan).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRefreshSource(source)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  {source.type === 'zapier' && source.config?.url && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-blue-600"
                      title="Open Zapier webhook URL"
                      onClick={() => window.open(source.config?.url, '_blank')}
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={() => handleDeleteSource(source.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Switch 
                    checked={source.enabled}
                    onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SourcesManager;
