
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building, AtSign, Mail, Globe, TrendingUp } from 'lucide-react';
import { ContentAlert } from '@/types/dashboard';
import { EntityExtractor, ExtractedEntity } from '@/services/entityExtraction/entityExtractor';

interface EntitySummaryPanelProps {
  alerts: ContentAlert[];
}

const EntitySummaryPanel = ({ alerts }: EntitySummaryPanelProps) => {
  // Process all alerts to extract entities
  const allEntities: ExtractedEntity[] = [];
  
  alerts.forEach(alert => {
    const processedAlert = EntityExtractor.processAlert(alert);
    allEntities.push(...processedAlert.extractedEntities);
  });

  // Group entities by type and count occurrences
  const entityStats = {
    people: new Map<string, { count: number; confidence: number; sources: Set<string> }>(),
    companies: new Map<string, { count: number; confidence: number; sources: Set<string> }>(),
    socialHandles: new Map<string, { count: number; confidence: number; sources: Set<string> }>(),
    emails: new Map<string, { count: number; confidence: number; sources: Set<string> }>(),
    websites: new Map<string, { count: number; confidence: number; sources: Set<string> }>()
  };

  allEntities.forEach(entity => {
    let targetMap;
    switch (entity.type) {
      case 'person':
        targetMap = entityStats.people;
        break;
      case 'company':
        targetMap = entityStats.companies;
        break;
      case 'social_handle':
        targetMap = entityStats.socialHandles;
        break;
      case 'email':
        targetMap = entityStats.emails;
        break;
      case 'website':
        targetMap = entityStats.websites;
        break;
      default:
        return;
    }

    const existing = targetMap.get(entity.name);
    if (existing) {
      existing.count++;
      existing.sources.add(entity.source);
      existing.confidence = Math.max(existing.confidence, entity.confidence);
    } else {
      targetMap.set(entity.name, {
        count: 1,
        confidence: entity.confidence,
        sources: new Set([entity.source])
      });
    }
  });

  const getTopEntities = (entityMap: Map<string, any>, limit = 5) => {
    return Array.from(entityMap.entries())
      .sort(([,a], [,b]) => b.count - a.count)
      .slice(0, limit);
  };

  const EntitySection = ({ 
    title, 
    icon, 
    entities, 
    color 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    entities: [string, any][]; 
    color: string;
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="font-medium text-sm">{title}</h4>
        <Badge variant="outline" className="text-xs">
          {entities.length}
        </Badge>
      </div>
      {entities.length > 0 ? (
        <div className="space-y-1">
          {entities.map(([name, data]) => (
            <div key={name} className="flex items-center justify-between text-sm">
              <span className="font-medium truncate flex-1">{name}</span>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className={`text-xs ${color}`}>
                  {data.count}
                </Badge>
                <span className="text-xs text-gray-500">
                  {Math.round(data.confidence * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-500">None detected</p>
      )}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          Entity Intelligence Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <EntitySection
          title="Key People"
          icon={<User className="h-4 w-4 text-blue-600" />}
          entities={getTopEntities(entityStats.people)}
          color="bg-blue-50 text-blue-700 border-blue-200"
        />
        
        <EntitySection
          title="Companies & Organizations"
          icon={<Building className="h-4 w-4 text-green-600" />}
          entities={getTopEntities(entityStats.companies)}
          color="bg-green-50 text-green-700 border-green-200"
        />
        
        <EntitySection
          title="Social Media Handles"
          icon={<AtSign className="h-4 w-4 text-purple-600" />}
          entities={getTopEntities(entityStats.socialHandles)}
          color="bg-purple-50 text-purple-700 border-purple-200"
        />
        
        <EntitySection
          title="Email Addresses"
          icon={<Mail className="h-4 w-4 text-orange-600" />}
          entities={getTopEntities(entityStats.emails)}
          color="bg-orange-50 text-orange-700 border-orange-200"
        />
        
        <EntitySection
          title="Websites"
          icon={<Globe className="h-4 w-4 text-gray-600" />}
          entities={getTopEntities(entityStats.websites)}
          color="bg-gray-50 text-gray-700 border-gray-200"
        />

        {allEntities.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No entities detected in current threats</p>
            <p className="text-xs">Run a new scan to gather intelligence</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EntitySummaryPanel;
