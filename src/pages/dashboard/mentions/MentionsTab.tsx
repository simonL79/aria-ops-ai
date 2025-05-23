
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentAlert } from "@/types/dashboard";
import { getMentionsAsAlerts } from "@/services/monitoring";
import { Loader2, AlertTriangle, MessageSquare, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface MentionsTabProps {
  mentions: ContentAlert[];
  setMentions: (mentions: ContentAlert[]) => void;
  onViewDetail: (mention: ContentAlert) => void;
  onMarkResolved: (id: string) => void;
  onEscalate: (id: string) => void;
}

const MentionsTab = ({ 
  mentions, 
  setMentions, 
  onViewDetail, 
  onMarkResolved, 
  onEscalate 
}: MentionsTabProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  useEffect(() => {
    loadMentions();
  }, []);

  const loadMentions = async () => {
    setIsLoading(true);
    try {
      const alerts = await getMentionsAsAlerts();
      const formattedMentions: ContentAlert[] = alerts.map(alert => ({
        id: alert.id,
        platform: alert.platform,
        content: alert.content,
        date: new Date(alert.date).toLocaleDateString(),
        severity: alert.severity as 'high' | 'medium' | 'low',
        status: alert.status as ContentAlert['status'],
        url: alert.url || '',
        threatType: alert.threatType,
        detectedEntities: alert.detectedEntities || []
      }));
      setMentions(formattedMentions);
    } catch (error) {
      console.error('Error loading mentions:', error);
      toast.error("Failed to load mentions");
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'read': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredMentions = selectedSeverity === 'all' 
    ? mentions 
    : mentions.filter(mention => mention.severity === selectedSeverity);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading mentions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Brand Mentions</h2>
        <div className="flex gap-2">
          <Button
            variant={selectedSeverity === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity('all')}
          >
            All ({mentions.length})
          </Button>
          <Button
            variant={selectedSeverity === 'high' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity('high')}
          >
            High ({mentions.filter(m => m.severity === 'high').length})
          </Button>
          <Button
            variant={selectedSeverity === 'medium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity('medium')}
          >
            Medium ({mentions.filter(m => m.severity === 'medium').length})
          </Button>
          <Button
            variant={selectedSeverity === 'low' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSeverity('low')}
          >
            Low ({mentions.filter(m => m.severity === 'low').length})
          </Button>
        </div>
      </div>

      {filteredMentions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mentions found</h3>
            <p className="text-gray-500">
              {selectedSeverity === 'all' 
                ? "No brand mentions have been detected yet." 
                : `No ${selectedSeverity} severity mentions found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredMentions.map((mention) => (
            <Card key={mention.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {mention.platform}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getSeverityColor(mention.severity)}`}
                    >
                      {mention.severity.toUpperCase()}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(mention.status)}`}
                    >
                      {mention.status.toUpperCase()}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">{mention.date}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-900 mb-3 line-clamp-3">{mention.content}</p>
                
                {mention.detectedEntities && mention.detectedEntities.length > 0 && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-700 mr-2">Entities:</span>
                    <div className="flex flex-wrap gap-1">
                      {mention.detectedEntities.map((entity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewDetail(mention)}
                    >
                      View Details
                    </Button>
                    {mention.url && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a href={mention.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Source
                        </a>
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {mention.status === 'new' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onEscalate(mention.id)}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Escalate
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onMarkResolved(mention.id)}
                    >
                      Mark Resolved
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentionsTab;
