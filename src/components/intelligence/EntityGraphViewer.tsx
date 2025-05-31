
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Network, Search, Users, Link } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EntityRelation {
  id: string;
  source_entity: string;
  related_entity: string;
  relationship_type: string;
  frequency: number;
  last_seen: string;
}

const EntityGraphViewer = () => {
  const [relations, setRelations] = useState<EntityRelation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEntityGraph();
  }, []);

  const loadEntityGraph = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('entity_graph')
        .select('*')
        .order('frequency', { ascending: false })
        .limit(20);

      if (error) throw error;
      setRelations(data || []);
    } catch (error) {
      console.error('Error loading entity graph:', error);
      toast.error('Failed to load entity relationships');
    } finally {
      setLoading(false);
    }
  };

  const searchEntities = async () => {
    if (!searchTerm) {
      loadEntityGraph();
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('entity_graph')
        .select('*')
        .or(`source_entity.ilike.%${searchTerm}%,related_entity.ilike.%${searchTerm}%`)
        .order('frequency', { ascending: false })
        .limit(20);

      if (error) throw error;
      setRelations(data || []);
    } catch (error) {
      console.error('Error searching entities:', error);
      toast.error('Failed to search entities');
    } finally {
      setLoading(false);
    }
  };

  const getRelationshipColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'associated': return 'text-blue-400';
      case 'mentioned': return 'text-green-400';
      case 'linked': return 'text-yellow-400';
      default: return 'text-corporate-lightGray';
    }
  };

  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 corporate-heading">
          <Network className="h-5 w-5 text-corporate-accent" />
          Entity Relationship Graph
        </CardTitle>
        <div className="flex gap-2">
          <Input
            placeholder="Search entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
            onKeyPress={(e) => e.key === 'Enter' && searchEntities()}
          />
          <Button onClick={searchEntities} size="sm">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <Network className="h-8 w-8 animate-pulse mx-auto mb-4 text-corporate-accent" />
              <p className="text-corporate-lightGray">Loading entity graph...</p>
            </div>
          ) : relations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
              <p className="text-corporate-lightGray">No entity relationships found</p>
            </div>
          ) : (
            relations.map((relation) => (
              <div key={relation.id} className="flex items-center justify-between p-3 border border-corporate-border rounded-lg bg-corporate-darkSecondary">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-sm">
                    <span className="text-white font-medium">{relation.source_entity}</span>
                    <Link className="h-3 w-3 mx-2 inline text-corporate-accent" />
                    <span className="text-white font-medium">{relation.related_entity}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${getRelationshipColor(relation.relationship_type)}`}>
                    {relation.relationship_type}
                  </span>
                  <span className="text-xs text-corporate-lightGray">
                    {relation.frequency}x
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EntityGraphViewer;
