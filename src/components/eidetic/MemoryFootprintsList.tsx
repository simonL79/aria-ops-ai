
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Clock, Target, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MemoryFootprint {
  id: string;
  content_url: string;
  memory_type: string;
  discovered_at: string;
  first_seen: string;
  last_seen: string;
  decay_score: number;
  is_active: boolean;
  memory_context: string;
  ai_memory_tags: string[];
  created_at: string;
}

interface MemoryFootprintsListProps {
  onFootprintAdded: () => void;
}

const MemoryFootprintsList = ({ onFootprintAdded }: MemoryFootprintsListProps) => {
  const [footprints, setFootprints] = useState<MemoryFootprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadFootprints();
  }, []);

  const loadFootprints = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('memory_footprints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFootprints(data || []);
    } catch (error) {
      console.error('Error loading memory footprints:', error);
      toast.error('Failed to load memory footprints');
    } finally {
      setLoading(false);
    }
  };

  const updateFootprintStatus = async (footprintId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('memory_footprints')
        .update({ is_active: isActive })
        .eq('id', footprintId);

      if (error) throw error;
      
      toast.success(`Memory footprint ${isActive ? 'activated' : 'deactivated'}`);
      loadFootprints();
    } catch (error) {
      console.error('Error updating footprint status:', error);
      toast.error('Failed to update status');
    }
  };

  const getDecayColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600';
    if (score >= 0.5) return 'text-orange-600';
    if (score >= 0.3) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getMemoryTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'article': return 'bg-blue-500';
      case 'search_suggestion': return 'bg-green-500';
      case 'forum_cache': return 'bg-purple-500';
      case 'archive_snapshot': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredFootprints = footprints.filter(footprint => {
    const matchesSearch = searchTerm === '' || 
      footprint.content_url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      footprint.memory_context?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || footprint.memory_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Digital Memory Footprints</CardTitle>
        
        {/* Filters */}
        <div className="flex gap-4">
          <Input
            placeholder="Search footprints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="search_suggestion">Search Suggestion</SelectItem>
              <SelectItem value="forum_cache">Forum Cache</SelectItem>
              <SelectItem value="archive_snapshot">Archive Snapshot</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredFootprints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No memory footprints found</p>
            </div>
          ) : (
            filteredFootprints.map((footprint) => (
              <div key={footprint.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${getMemoryTypeColor(footprint.memory_type)} text-white`}>
                        {footprint.memory_type?.replace('_', ' ')}
                      </Badge>
                      {!footprint.is_active && (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {footprint.memory_context}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(footprint.discovered_at).toLocaleDateString()}
                      </span>
                      {footprint.ai_memory_tags && footprint.ai_memory_tags.length > 0 && (
                        <span>Tags: {footprint.ai_memory_tags.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-lg font-bold ${getDecayColor(footprint.decay_score)}`}>
                        {footprint.decay_score.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">Decay Score</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <a 
                    href={footprint.content_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View Content
                  </a>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={footprint.is_active ? "destructive" : "default"}
                      onClick={() => updateFootprintStatus(footprint.id, !footprint.is_active)}
                    >
                      {footprint.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryFootprintsList;
