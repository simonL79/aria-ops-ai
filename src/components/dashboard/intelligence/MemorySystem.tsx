
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Brain, PlusCircle } from "lucide-react";
import { MemoryEntry } from "@/types/intelligence/memory";
import { getMemories, storeMemory } from "@/services/intelligence/memoryService";
import { toast } from "sonner";

const MEMORY_CATEGORIES: Array<MemoryEntry['category']> = [
  'insight',
  'threat',
  'pattern',
  'response',
  'feedback'
];

const categoryColors: Record<MemoryEntry['category'], string> = {
  insight: "bg-blue-100 text-blue-800",
  threat: "bg-red-100 text-red-800",
  pattern: "bg-purple-100 text-purple-800",
  response: "bg-green-100 text-green-800",
  feedback: "bg-amber-100 text-amber-800"
};

const MemorySystem = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  
  // Load memories based on active tab and search term
  useEffect(() => {
    const category = activeTab !== "all" ? activeTab as MemoryEntry['category'] : undefined;
    const results = getMemories({
      category,
      searchTerm: searchTerm,
      limit: 20
    });
    
    setMemories(results);
  }, [activeTab, searchTerm]);
  
  const handleAddMemory = () => {
    // In a real implementation, this would open a form to create a new memory
    // For demo purposes, we'll just add a predefined memory
    const newMemory: MemoryEntry = {
      id: `mem-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'insight',
      content: 'New AI-generated insight based on recent data patterns',
      source: 'ai-analysis',
      confidence: 0.85,
      tags: ['ai-generated', 'recent-insight']
    };
    
    storeMemory(newMemory);
    setMemories(prev => [newMemory, ...prev]);
    
    toast.success("New memory created and stored", {
      description: "AI intelligence memory system updated"
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Intelligence Memory System
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleAddMemory}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Memory
          </Button>
        </div>
        
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search memories..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            {MEMORY_CATEGORIES.map(cat => (
              <TabsTrigger key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
              {memories.length > 0 ? (
                memories.map(memory => (
                  <div 
                    key={memory.id} 
                    className="p-3 border rounded-md bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={categoryColors[memory.category]}>
                        {memory.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(memory.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-sm mb-2">{memory.content}</p>
                    
                    {memory.context && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Context: {memory.context}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {memory.tags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-xs bg-slate-50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Confidence: {Math.round(memory.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No memories found</p>
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
