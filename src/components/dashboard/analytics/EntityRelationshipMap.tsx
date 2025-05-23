
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ContentAlert } from '@/types/dashboard';
import { Network, User, Building } from 'lucide-react';

interface EntityRelationshipMapProps {
  alerts: ContentAlert[];
}

const EntityRelationshipMap: React.FC<EntityRelationshipMapProps> = ({ alerts }) => {
  const getEntityConnections = () => {
    const entityMap = new Map<string, { type: string; connections: Set<string>; alertCount: number }>();
    
    alerts.forEach(alert => {
      if (alert.detectedEntities) {
        alert.detectedEntities.forEach(entity => {
          if (!entityMap.has(entity)) {
            entityMap.set(entity, { 
              type: entity.includes(' ') ? 'PERSON' : 'ORG', 
              connections: new Set(), 
              alertCount: 0 
            });
          }
          
          const entityData = entityMap.get(entity)!;
          entityData.alertCount++;
          
          // Connect entities that appear in the same alert
          alert.detectedEntities!.forEach(otherEntity => {
            if (otherEntity !== entity) {
              entityData.connections.add(otherEntity);
            }
          });
        });
      }
    });
    
    return Array.from(entityMap.entries()).map(([name, data]) => ({
      name,
      type: data.type,
      connections: Array.from(data.connections),
      alertCount: data.alertCount,
      riskLevel: data.alertCount > 5 ? 'high' : data.alertCount > 2 ? 'medium' : 'low'
    }));
  };

  const entities = getEntityConnections();

  const getEntityIcon = (type: string) => {
    return type === 'PERSON' ? <User className="h-3 w-3" /> : <Building className="h-3 w-3" />;
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Entity Relationship Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entities.slice(0, 10).map((entity, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getEntityIcon(entity.type)}
                    {entity.name}
                  </Badge>
                  <Badge variant={getRiskColor(entity.riskLevel) as any}>
                    {entity.alertCount} alerts
                  </Badge>
                </div>
              </div>
              
              {entity.connections.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Connected to:</p>
                  <div className="flex flex-wrap gap-1">
                    {entity.connections.slice(0, 5).map((connection, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {connection}
                      </Badge>
                    ))}
                    {entity.connections.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{entity.connections.length - 5} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EntityRelationshipMap;
