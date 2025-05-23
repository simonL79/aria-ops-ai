
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PlusCircle } from 'lucide-react';
import { ScrapingSource } from '@/types/aiScraping';
import { updateSource } from '@/services/aiScrapingService';
import { toast } from 'sonner';

interface AddSourceDialogProps {
  onSourceAdded: () => void;
}

const AddSourceDialog: React.FC<AddSourceDialogProps> = ({ onSourceAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSource, setNewSource] = useState<Partial<ScrapingSource>>({
    name: '',
    type: 'google',
    enabled: true,
    config: { maxResults: 5 }
  });

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
    onSourceAdded();
    setIsOpen(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddSource}>
            Add Source
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSourceDialog;
