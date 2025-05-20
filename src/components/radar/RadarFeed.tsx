import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Loader2, Filter, Calendar, RefreshCw, Users, Building, MapPin, BriefcaseBusiness } from "lucide-react";
import { EntityMention, RadarFilters } from "@/types/radar";
import RadarFilterBar from "./RadarFilterBar";
import EntityCard from "./EntityCard";
import { Badge } from "@/components/ui/badge";
import OutreachPanel from "./OutreachPanel";

// Temporary mock data until we have the edge function
const mockEntities: EntityMention[] = [
  {
    id: "1",
    name: "TechCorp Inc",
    type: "organization",
    articles: [
      {
        id: "a1",
        title: "TechCorp Faces Backlash After Data Breach",
        url: "https://example.com/tech-corp-breach",
        source: "Tech News Daily",
        publishDate: "2025-05-20T08:30:00Z",
        snippet: "TechCorp Inc is facing customer backlash and potential lawsuits after a major data breach exposed sensitive information...",
        imageUrl: "https://picsum.photos/seed/techcorp/800/400"
      }
    ],
    sentiment: -0.75,
    riskCategory: "Data Privacy Incident",
    riskScore: 8.2,
    firstDetected: "2025-05-20T10:15:00Z",
    outreachStatus: "pending"
  },
  {
    id: "2",
    name: "Jane Smith",
    type: "person",
    articles: [
      {
        id: "a2",
        title: "Celebrity Jane Smith Apologizes For Controversial Comments",
        url: "https://example.com/jane-smith-apology",
        source: "Entertainment Weekly",
        publishDate: "2025-05-20T11:45:00Z",
        snippet: "Actress Jane Smith issued a public apology today after her controversial statements about climate change sparked outrage...",
        imageUrl: "https://picsum.photos/seed/janesmith/800/400"
      }
    ],
    sentiment: -0.6,
    riskCategory: "Public Relations Crisis",
    riskScore: 7.5,
    firstDetected: "2025-05-20T12:30:00Z",
    outreachStatus: "drafted",
    outreachDraft: "Dear Ms. Smith, We noticed your recent media coverage and wanted to reach out. Our firm specializes in reputation management during challenging media situations..."
  }
];

interface RadarFeedProps {
  onRefresh?: () => Promise<void>;
}

const RadarFeed = ({ onRefresh }: RadarFeedProps) => {
  const [entities, setEntities] = useState<EntityMention[]>(mockEntities);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<EntityMention | null>(null);
  const [filters, setFilters] = useState<RadarFilters>({
    timeframe: 'last24h',
    entityTypes: ['person', 'organization'],
    minRiskScore: 5,
    sources: [],
    categories: []
  });

  const refreshData = async () => {
    setLoading(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
      // In real implementation, fetch data from your API
      // const response = await fetch('/api/radar/entities', { ... });
      // const data = await response.json();
      // setEntities(data);
      toast.success("Radar data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing radar data:", error);
      toast.error("Failed to refresh radar data");
    } finally {
      setLoading(false);
    }
  };

  const handleEntitySelect = (entity: EntityMention) => {
    setSelectedEntity(entity);
  };

  const handleFiltersChange = (newFilters: Partial<RadarFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    // In real implementation, this would filter the data
    // For now, just simulate filtering with a loading state
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const filteredEntities = entities.filter(entity => {
    if (filters.entityTypes.length > 0 && !filters.entityTypes.includes(entity.type)) {
      return false;
    }
    if (entity.riskScore < filters.minRiskScore) {
      return false;
    }
    return true;
  });

  const getEntityTypeIcon = (type: 'person' | 'organization' | 'location') => {
    switch (type) {
      case 'person': return <Users className="h-4 w-4" />;
      case 'organization': return <Building className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      default: return <BriefcaseBusiness className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    // In a real implementation, you would fetch data here
    // Initial data load
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Daily Reputation Radar</h2>
        <Button 
          onClick={refreshData} 
          disabled={loading}
          variant="outline"
        >
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh Data
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Entity Reputation Monitor</CardTitle>
            <div className="flex space-x-2">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {filteredEntities.filter(e => e.riskScore >= 7).length} High Risk
              </Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                {filteredEntities.filter(e => e.riskScore >= 5 && e.riskScore < 7).length} Medium Risk
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b px-4 py-3">
            <RadarFilterBar filters={filters} onChange={handleFiltersChange} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            <div className="lg:col-span-2 border-r">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                </div>
              ) : filteredEntities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                  <Filter className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No entities match your current filters</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => setFilters({
                      timeframe: 'last24h',
                      entityTypes: ['person', 'organization', 'location'],
                      minRiskScore: 0,
                      sources: [],
                      categories: []
                    })}
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredEntities.map(entity => (
                    <EntityCard 
                      key={entity.id} 
                      entity={entity}
                      onClick={() => handleEntitySelect(entity)}
                      isSelected={selectedEntity?.id === entity.id}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              {selectedEntity ? (
                <OutreachPanel entity={selectedEntity} />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 h-full">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-center text-muted-foreground">
                    Select an entity to view details and prepare outreach
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RadarFeed;
