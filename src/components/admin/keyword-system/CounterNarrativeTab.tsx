
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CounterNarrativeTabProps {
  entityName: string;
  narratives: any[];
  onRefresh: () => void;
}

const CounterNarrativeTab: React.FC<CounterNarrativeTabProps> = ({ 
  entityName, 
  narratives, 
  onRefresh 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [entityNarratives, setEntityNarratives] = useState<any[]>([]);

  useEffect(() => {
    // Filter narratives for current entity
    const filtered = narratives.filter(n => 
      n.entity_name === entityName || n.message?.includes(entityName)
    );
    setEntityNarratives(filtered);
  }, [narratives, entityName]);

  const generateNarratives = async () => {
    if (!entityName) {
      toast.error('Please select an entity first');
      return;
    }

    setIsGenerating(true);
    try {
      toast.info(`📝 Generating counter narratives for ${entityName}...`);

      // Create sample counter narratives
      const strategies = [
        {
          message: `Strategic response framework for ${entityName} reputation management`,
          platform: 'general',
          tone: 'professional',
          status: 'pending'
        },
        {
          message: `Proactive narrative control strategy for ${entityName}`,
          platform: 'social_media',
          tone: 'empathetic',
          status: 'pending'
        },
        {
          message: `Crisis communication protocol for ${entityName}`,
          platform: 'media',
          tone: 'confident',
          status: 'pending'
        }
      ];

      const { error } = await supabase
        .from('counter_narratives')
        .insert(
          strategies.map(strategy => ({
            ...strategy,
            entity_name: entityName
          }))
        );

      if (error) throw error;

      toast.success(`✅ Generated ${strategies.length} counter narrative strategies`);
      onRefresh();
    } catch (error) {
      console.error('Failed to generate narratives:', error);
      toast.error('❌ Failed to generate counter narratives');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-corporate-accent" />
            Counter Narrative Strategies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Entity: {entityName}</h4>
              <p className="text-corporate-lightGray text-sm">
                Strategic response generation and narrative control
              </p>
            </div>
            <Button
              onClick={generateNarratives}
              disabled={isGenerating || !entityName}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              {isGenerating ? (
                <>
                  <Target className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Strategies
                </>
              )}
            </Button>
          </div>

          {entityNarratives.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-white font-medium">
                Generated Strategies ({entityNarratives.length})
              </h4>
              <div className="space-y-3">
                {entityNarratives.map((narrative) => (
                  <div key={narrative.id} className="p-4 bg-corporate-darkSecondary rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-corporate-accent text-black">
                        {narrative.platform}
                      </Badge>
                      <Badge variant="outline" className="text-corporate-lightGray">
                        {narrative.tone}
                      </Badge>
                    </div>
                    <p className="text-white mb-2">{narrative.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-corporate-lightGray text-sm">
                        Status: {narrative.status}
                      </span>
                      <span className="text-corporate-lightGray text-sm">
                        {new Date(narrative.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {entityNarratives.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
              <p className="text-corporate-lightGray">
                No counter narratives generated yet for {entityName}
              </p>
              <p className="text-corporate-lightGray text-sm">
                Click "Generate Strategies" to create strategic responses
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CounterNarrativeTab;
