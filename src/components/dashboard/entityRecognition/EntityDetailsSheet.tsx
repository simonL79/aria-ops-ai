
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Building, AtSign } from "lucide-react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

interface EntityDetailsSheetProps {
  selectedEntity: {
    name: string;
    type: 'person' | 'organization' | 'handle' | 'unknown';
    mentions: number;
  } | null;
  entityResults: any[];
}

const EntityDetailsSheet: React.FC<EntityDetailsSheetProps> = ({ selectedEntity, entityResults }) => {
  if (!selectedEntity) return null;
  
  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'person': return <Users className="h-4 w-4" />;
      case 'organization': return <Building className="h-4 w-4" />;
      case 'handle': return <AtSign className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
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
  );
};

export default EntityDetailsSheet;
