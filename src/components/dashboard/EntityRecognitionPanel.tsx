
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, Users, Building, AtSign, RefreshCcw, Eye } from "lucide-react";
import { getAllEntities, batchProcessEntities, getEntityStatistics, getScanResultsByEntity } from '@/services/entityRecognition';
import { toast } from "sonner";

interface Entity {
  name: string;
  type: 'person' | 'organization' | 'handle' | 'unknown';
  confidence: number;
  mentions: number;
}

const EntityRecognitionPanel = () => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [entityResults, setEntityResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState({
    totalEntities: 0,
    personEntities: 0,
    orgEntities: 0,
    handleEntities: 0,
    mostMentioned: null as Entity | null
  });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadEntities();
  }, []);

  const loadEntities = async () => {
    setLoading(true);
    try {
      const allEntities = await getAllEntities();
      setEntities(allEntities);
      
      const statistics = await getEntityStatistics();
      setStats(statistics);
    } catch (error) {
      console.error('Error loading entities:', error);
      toast.error('Failed to load entity data');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessEntities = async () => {
    setProcessing(true);
    try {
      const processedCount = await batchProcessEntities();
      if (processedCount > 0) {
        await loadEntities();
        toast.success(`Processed ${processedCount} items for entity recognition`);
      } else {
        toast.info('No new items to process');
      }
    } catch (error) {
      console.error('Error processing entities:', error);
      toast.error('Failed to process entities');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewEntity = async (entity: Entity) => {
    setSelectedEntity(entity);
    try {
      const results = await getScanResultsByEntity(entity.name);
      setEntityResults(results);
    } catch (error) {
      console.error('Error fetching entity results:', error);
      setEntityResults([]);
    }
  };

  const filteredEntities = entities.filter(entity => {
    if (activeTab === 'all') return true;
    return entity.type === activeTab;
  });

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'person': return <Users className="h-4 w-4" />;
      case 'organization': return <Building className="h-4 w-4" />;
      case 'handle': return <AtSign className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Entity Recognition</CardTitle>
            <CardDescription>Extracted people, organizations, and social handles</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleProcessEntities} 
            disabled={processing}
          >
            {processing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2" />
            )}
            Process New Items
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <Users className="h-5 w-5 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.personEntities}</div>
            <div className="text-xs text-muted-foreground">People</div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <Building className="h-5 w-5 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.orgEntities}</div>
            <div className="text-xs text-muted-foreground">Organizations</div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg text-center">
            <AtSign className="h-5 w-5 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.handleEntities}</div>
            <div className="text-xs text-muted-foreground">Social Handles</div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="person">People</TabsTrigger>
            <TabsTrigger value="organization">Organizations</TabsTrigger>
            <TabsTrigger value="handle">Handles</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredEntities.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <p>No entities found in this category</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredEntities.slice(0, 10).map((entity, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      {getEntityIcon(entity.type)}
                      <span className="font-medium">{entity.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {entity.mentions} {entity.mentions === 1 ? 'mention' : 'mentions'}
                      </Badge>
                    </div>
                    
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewEntity(entity)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only sm:not-sr-only sm:inline-flex">View</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full sm:w-[540px]">
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-2">
                            {getEntityIcon(selectedEntity?.type || 'unknown')}
                            {selectedEntity?.name}
                          </SheetTitle>
                        </SheetHeader>
                        <div className="mt-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <span className="text-sm font-medium">Type:</span>{' '}
                              <Badge>
                                {selectedEntity?.type.charAt(0).toUpperCase() + selectedEntity?.type.slice(1)}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Mentions:</span>{' '}
                              <Badge variant="outline">{selectedEntity?.mentions}</Badge>
                            </div>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <h4 className="text-sm font-medium mb-2">Mentioned In:</h4>
                          
                          {entityResults.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No results found</p>
                          ) : (
                            <div className="space-y-3">
                              {entityResults.slice(0, 5).map((result) => (
                                <div key={result.id} className="p-3 bg-muted rounded-md">
                                  <div className="flex items-center justify-between mb-1">
                                    <Badge variant="outline">{result.platform}</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(result.created_at).toLocaleString()}
                                    </span>
                                  </div>
                                  <p className="text-sm line-clamp-3">{result.content}</p>
                                </div>
                              ))}
                              
                              {entityResults.length > 5 && (
                                <Button 
                                  variant="outline" 
                                  className="w-full text-xs"
                                  onClick={() => {}}
                                >
                                  View All {entityResults.length} Mentions
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                ))}
                {filteredEntities.length > 10 && (
                  <Button variant="outline" className="w-full mt-2">
                    View All {filteredEntities.length} Entities
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EntityRecognitionPanel;
