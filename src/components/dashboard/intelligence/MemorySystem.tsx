
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Database, Brain, Clock, Tag } from "lucide-react";
import { MemoryEntry } from "@/types/intelligence";
import { useState } from "react";

// Sample memory entries
const sampleMemories: MemoryEntry[] = [
  {
    id: "mem-1",
    content: "Competitor launched negative campaign on Twitter",
    context: "Social media monitoring detected coordinated pattern",
    timestamp: "2025-05-12T09:15:00Z",
    tags: ["competitor", "social-media", "attack"],
    relatedEntities: ["CompetitorX", "Twitter"],
    importance: 8
  },
  {
    id: "mem-2",
    content: "Legal response template effective for copyright claims",
    context: "Used in 12 cases with 92% success rate",
    timestamp: "2025-05-10T14:30:00Z",
    tags: ["legal", "template", "copyright", "effective"],
    importance: 7
  },
  {
    id: "mem-3",
    content: "Media coverage spike after CSR initiative announcement",
    context: "Press release picked up by 23 outlets within 48 hours",
    timestamp: "2025-05-08T11:20:00Z",
    tags: ["CSR", "press", "positive"],
    relatedEntities: ["GreenInitiative"],
    importance: 6
  },
  {
    id: "mem-4",
    content: "Customer complaint pattern identified in product returns",
    context: "Recurring issue with packaging mentioned in 18% of returns",
    timestamp: "2025-05-05T16:45:00Z",
    tags: ["customer", "complaint", "packaging", "product"],
    importance: 9
  },
  {
    id: "mem-5",
    content: "CEO interview response led to positive sentiment increase",
    context: "Transparency approach increased trust metrics by 14%",
    timestamp: "2025-05-01T10:30:00Z",
    tags: ["interview", "CEO", "positive", "transparency"],
    importance: 7
  }
];

const MemorySystem = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [memories] = useState<MemoryEntry[]>(sampleMemories);

  const filterMemories = () => {
    if (activeTab === "all") return memories;
    return memories.filter(mem => mem.tags.includes(activeTab));
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 8) return "bg-red-500";
    if (importance >= 6) return "bg-amber-500";
    if (importance >= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Intelligence Memory System
            </CardTitle>
            <CardDescription>
              Long-term learning from past incidents and responses
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
            {memories.length} Memories
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium">System Learning Capacity</div>
          <div className="text-sm">75%</div>
        </div>
        <Progress value={75} className="mb-6" />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="competitor">Competitors</TabsTrigger>
            <TabsTrigger value="legal">Legal</TabsTrigger>
            <TabsTrigger value="positive">Positive</TabsTrigger>
            <TabsTrigger value="customer">Customers</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {filterMemories().map(memory => (
            <div key={memory.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-start">
                <div className="font-medium">{memory.content}</div>
                <Badge className={`${getImportanceColor(memory.importance)} text-white`}>
                  {memory.importance}/10
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {memory.context}
              </div>
              
              <div className="flex flex-wrap gap-1 pt-1">
                {memory.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs px-1 py-0 h-5">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <div className="flex items-center">
                  <Database className="h-3 w-3 mr-1" />
                  {memory.relatedEntities?.length || 0} linked entities
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(memory.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-sm text-muted-foreground mt-4">
          The AI memory system continuously learns from each incident to improve future responses.
          Memory vectors are used to retrieve contextually relevant experiences when analyzing new threats.
        </div>
      </CardContent>
    </Card>
  );
};

export default MemorySystem;
