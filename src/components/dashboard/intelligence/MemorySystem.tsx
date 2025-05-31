
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Brain, PlusCircle, Database } from "lucide-react";
import { anubisMemoryService, AnubisEntityMemory } from "@/services/aria/anubisMemoryService";
import { toast } from "sonner";

const MEMORY_CATEGORIES: Array<AnubisEntityMemory['memory_type']> = [
  'threat',
  'outreach', 
  'response',
  'metadata'
];

const categoryColors: Record<AnubisEntityMemory['memory_type'], string> = {
  threat: "bg-red-100 text-red-800",
  outreach: "bg-blue-100 text-blue-800",
  response: "bg-green-100 text-green-800",
  metadata: "bg-purple-100 text-purple-800"
};

const MemorySystem = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [memories, setMemories] = useState<AnubisEntityMemory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load memories from Anubis system
  const loadMemories = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await anubisMemoryService.recallEntityMemory({
        entity_name: searchTerm
      });
      
      // Filter by category if not "all"
      const filteredResults = activeTab !== "all" 
        ? results.filter(m => m.memory_type === activeTab)
        : results;
        
      setMemories(filteredResults);
    } catch (error) {
      console.error('Error loading memories:', error);
      toast.error('Failed to load memories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      const debounceTimer = setTimeout(() => {
        loadMemories();
      }, 500);
      
      return () => clearTimeout(debounceTimer);
    } else {
      setMemories([]);
    }
  }, [searchTerm, activeTab]);
  
  const handleStoreMemory = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter an entity name first');
      return;
    }

    const success = await anubisMemoryService.storeEntityMemory({
      entity_name: searchTerm,
      memory_type: 'metadata',
      memory_summary: 'Manual memory entry created from Intelligence Hub',
      context_reference: 'intelligence-dashboard',
      created_by: 'operator'
    });
    
    if (success) {
      // Reload memories to show the new one
      loadMemories();
    }
  };

  const handleStorePattern = async () => {
    if (!searchTerm.trim()) {
      toast.error('Please enter an entity name first');
      return;
    }

    const success = await anubisMemoryService.storePattern({
      entity_name: searchTerm,
      pattern_fingerprint: `pattern_${Date.now()}`,
      pattern_summary: 'Manual pattern recognition entry from Intelligence Hub',
      confidence_score: 0.75,
      recommended_response: 'Monitor and analyze'
    });
    
    if (success) {
      toast.success('Pattern stored in Anubis system');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Anubis Memory System
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleStoreMemory}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Store Memory
            </Button>
            <Button variant="outline" size="sm" onClick={handleStorePattern}>
              <Database className="h-4 w-4 mr-2" />
              Store Pattern
            </Button>
          </div>
        </div>
        
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entity memories..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            {MEMORY_CATEGORIES.map(cat => (
              <TabsTrigger key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading memories...</p>
                </div>
              ) : memories.length > 0 ? (
                memories.map(memory => (
                  <div 
                    key={memory.id} 
                    className="p-3 border rounded-md bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={categoryColors[memory.memory_type]}>
                        {memory.memory_type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(memory.last_seen).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <p className="font-medium text-sm">{memory.entity_name}</p>
                      <p className="text-sm">{memory.memory_summary}</p>
                    </div>
                    
                    {memory.context_reference && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Context: {memory.context_reference}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Created: {new Date(memory.created_at).toLocaleString()}
                      </div>
                      {memory.created_by && (
                        <Badge variant="outline" className="text-xs">
                          {memory.created_by}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : searchTerm.trim() ? (
                <div className="py-8 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No memories found for "{searchTerm}"</p>
                  <p className="text-sm text-muted-foreground">Try searching for a different entity</p>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Enter an entity name to search Anubis memory</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MemorySystem;
