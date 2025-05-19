
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Save, X, Plus, Edit2 } from 'lucide-react';
import { getAvailableSources } from '@/services/dataIngestionService';
import { connectDataSource } from '@/services/dataIngestionService';
import { toast } from 'sonner';

const MonitorConfig = () => {
  const [keywords, setKeywords] = useState<string[]>(['Brand Name', 'Company', 'Product']);
  const [newKeyword, setNewKeyword] = useState('');
  const [editingKeyword, setEditingKeyword] = useState<{index: number, value: string} | null>(null);
  const [availableSources] = useState(getAvailableSources());
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
      toast.success(`Added "${newKeyword.trim()}" to monitored keywords`);
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const removed = keywords[index];
    setKeywords(keywords.filter((_, i) => i !== index));
    toast.info(`Removed "${removed}" from monitored keywords`);
  };

  const handleEditKeyword = (index: number) => {
    setEditingKeyword({ index, value: keywords[index] });
  };

  const handleSaveEdit = () => {
    if (editingKeyword && editingKeyword.value.trim()) {
      const newKeywords = [...keywords];
      newKeywords[editingKeyword.index] = editingKeyword.value.trim();
      setKeywords(newKeywords);
      setEditingKeyword(null);
      toast.success(`Updated keyword successfully`);
    }
  };

  const handleCancelEdit = () => {
    setEditingKeyword(null);
  };

  const handleConnectSource = async (sourceId: string) => {
    setConnecting(sourceId);
    try {
      // In a real app, we would show a form to collect credentials
      // For this demo, we'll just simulate a successful connection
      const credentials = { type: 'api', apiKey: 'mock-api-key' };
      
      const success = await connectDataSource(sourceId, credentials);
      if (success) {
        toast.success(`Connected to ${availableSources.find(s => s.id === sourceId)?.name}`);
      } else {
        toast.error(`Failed to connect to ${availableSources.find(s => s.id === sourceId)?.name}`);
      }
    } catch (error) {
      console.error('Error connecting source:', error);
      toast.error('Failed to connect data source');
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Monitored Keywords</CardTitle>
          <CardDescription>Add keywords to track across all platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter keyword to track..."
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddKeyword}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            <ScrollArea className="h-[250px] w-full rounded-md border p-2">
              <div className="space-y-2">
                {keywords.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    {editingKeyword && editingKeyword.index === index ? (
                      <>
                        <Input 
                          value={editingKeyword.value} 
                          onChange={(e) => setEditingKeyword({ ...editingKeyword, value: e.target.value })} 
                          className="flex-1 mr-2"
                        />
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={handleSaveEdit}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-sm">{keyword}</span>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditKeyword(index)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveKeyword(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {keywords.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No keywords added yet. Add keywords to start monitoring.
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="text-right">
              <Button variant="outline">
                <Save className="h-4 w-4 mr-1" />
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
          <CardDescription>Configure monitoring platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full">
            <div className="space-y-3">
              {availableSources.map((source) => (
                <div key={source.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${source.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div>
                        <div className="font-medium">{source.name}</div>
                        <div className="text-xs text-muted-foreground">{source.type.charAt(0).toUpperCase() + source.type.slice(1)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {source.active ? (
                        <Badge variant="outline" className="bg-green-50">Connected</Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-xs"
                          disabled={connecting === source.id}
                          onClick={() => handleConnectSource(source.id)}
                        >
                          {connecting === source.id ? 'Connecting...' : 'Connect'}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {source.active && source.lastScan && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Last scan: {source.lastScan}
                    </div>
                  )}
                  
                  {!source.active && source.credentials && source.credentials.status === 'invalid' && (
                    <div className="text-xs text-red-500 mt-2">
                      Authentication required
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitorConfig;
