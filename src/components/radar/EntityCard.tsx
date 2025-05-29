
import { useState } from "react";
import { EntityMention } from "@/types/radar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ExternalLink, ChevronRight, Users, Building, MapPin } from "lucide-react";

interface EntityCardProps {
  entity: EntityMention;
  onClick: () => void;
  isSelected?: boolean;
}

const EntityCard = ({ entity, onClick, isSelected }: EntityCardProps) => {
  const getTypeIcon = () => {
    switch (entity.type) {
      case 'person': return <Users className="h-4 w-4" />;
      case 'organization': return <Building className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 7) return "text-red-600";
    if (score >= 5) return "text-amber-600";
    return "text-blue-600";
  };

  const getOutreachStatusBadge = () => {
    switch (entity.outreachStatus) {
      case 'drafted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Draft Ready</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Sent</Badge>;
      case 'responded':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Responded</Badge>;
      case 'converted':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Converted</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Pending</Badge>;
    }
  };

  // Format the detection date to be relative (e.g., "2 hours ago")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 1) return "Just now";
    if (diffHrs === 1) return "1 hour ago";
    if (diffHrs < 24) return `${diffHrs} hours ago`;
    
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const mainArticle = entity.articles[0]; // Get the first (main) article

  return (
    <div 
      className={`p-4 hover:bg-muted/20 cursor-pointer transition-colors ${isSelected ? 'bg-muted' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <h3 className="font-medium">{entity.name}</h3>
            {entity.riskScore >= 7 && (
              <Badge variant="destructive" className="animate-pulse">High Risk</Badge>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3 mr-1" />
            <span>First detected {getRelativeTime(entity.firstDetected)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          {getOutreachStatusBadge()}
        </div>
      </div>
      
      {mainArticle && (
        <div className="mt-3">
          <div className="flex justify-between items-start mb-1">
            <div className="text-sm font-medium line-clamp-2">{mainArticle.title}</div>
          </div>
          <div className="text-xs text-muted-foreground mb-2">
            {mainArticle.source} • {new Date(mainArticle.publishDate).toLocaleDateString()}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {mainArticle.snippet}
          </p>
        </div>
      )}
      
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium">Risk Score</span>
          <span className={`text-xs font-medium ${getRiskColor(entity.riskScore)}`}>
            {entity.riskScore.toFixed(1)}/10
          </span>
        </div>
        <Progress 
          value={entity.riskScore * 10} 
          className="h-1.5"
        />
      </div>
      
      <div className="mt-3 flex justify-between items-center">
        <Badge variant="outline" className="text-xs">
          {entity.riskCategory || "Reputation Risk"}
        </Badge>
        <Button size="sm" variant="ghost" className="h-8 px-2">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default EntityCard;
