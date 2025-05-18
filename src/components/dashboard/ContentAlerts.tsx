
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ban, Loader, Eye, Shield, Flag, AlertTriangle, MessageSquareWarning, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import { useState } from "react";

interface ContentAlert {
  id: string;
  platform: string;
  content: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
  status: 'new' | 'reviewing' | 'actioned';
  threatType?: 'falseReviews' | 'coordinatedAttack' | 'competitorSmear' | 'botActivity' | 'misinformation' | 'legalRisk' | 'viralThreat';
  confidenceScore?: number;
  sourceType?: 'social' | 'review' | 'news' | 'forum' | 'darkweb';
  sentiment?: 'negative' | 'neutral' | 'sarcastic' | 'threatening';
  potentialReach?: number;
  detectedEntities?: string[];
}

interface ContentAlertsProps {
  alerts: ContentAlert[];
  isLoading?: boolean;
}

const ContentAlerts = ({ alerts, isLoading = false }: ContentAlertsProps) => {
  const [expandedAlerts, setExpandedAlerts] = useState<Record<string, boolean>>({});
  
  const toggleAlertExpansion = (id: string) => {
    setExpandedAlerts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-alert-negative text-white';
      case 'medium': return 'bg-alert-warning text-white';
      case 'low': return 'bg-brand-light text-white';
      default: return 'bg-gray-200';
    }
  };

  const getThreatTypeIcon = (threatType?: string) => {
    if (!threatType) return null;
    
    switch (threatType) {
      case 'falseReviews': 
        return <MessageSquareWarning className="h-4 w-4 text-yellow-600" />;
      case 'coordinatedAttack': 
        return <Users className="h-4 w-4 text-red-600" />;
      case 'competitorSmear': 
        return <Ban className="h-4 w-4 text-purple-600" />;
      case 'botActivity': 
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'misinformation': 
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'legalRisk': 
        return <Shield className="h-4 w-4 text-red-800" />;
      case 'viralThreat': 
        return <Globe className="h-4 w-4 text-pink-600" />;
      default: 
        return <Flag className="h-4 w-4 text-gray-600" />;
    }
  };
  
  const getSourceTypeLabel = (sourceType?: string) => {
    if (!sourceType) return null;
    
    const colors: Record<string, string> = {
      social: 'bg-blue-100 text-blue-800',
      review: 'bg-green-100 text-green-800',
      news: 'bg-purple-100 text-purple-800',
      forum: 'bg-amber-100 text-amber-800',
      darkweb: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[sourceType] || 'bg-gray-100 text-gray-800'}`}>
        {sourceType.charAt(0).toUpperCase() + sourceType.slice(1)}
      </span>
    );
  };

  const formatThousands = (num?: number) => {
    if (num === undefined) return '';
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num.toString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex justify-between items-center">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-5 w-16" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {[1, 2, 3].map((item) => (
              <div key={item}>
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-3 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <Skeleton className="h-4 w-11/12 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-36" />
                  </div>
                </div>
                {item < 3 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Recent Content Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-2">No alerts match your current filters</p>
            <Button variant="outline" size="sm">Reset Filters</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex justify-between items-center">
          <span>Reputation Threat Intelligence</span>
          <Badge variant="outline" className="font-normal">{alerts.length} active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {alerts.map((alert, idx) => (
            <Collapsible 
              key={alert.id} 
              open={expandedAlerts[alert.id]} 
              onOpenChange={() => toggleAlertExpansion(alert.id)}
            >
              <div>
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium flex items-center">
                      {alert.platform}
                      {alert.threatType && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="ml-2">
                                {getThreatTypeIcon(alert.threatType)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">
                                {alert.threatType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                {alert.confidenceScore && ` (${alert.confidenceScore}% confidence)`}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {alert.sourceType && (
                        <span className="ml-2">
                          {getSourceTypeLabel(alert.sourceType)}
                        </span>
                      )}
                    </div>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity === 'high' ? 'Critical Threat' : 
                       alert.severity === 'medium' ? 'Medium Impact' : 'Low Impact'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2 flex justify-between">
                    <span>{alert.date}</span>
                    {alert.potentialReach && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        Reach: {formatThousands(alert.potentialReach)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm mb-3">{alert.content}</p>
                  <div className="flex gap-2">
                    <CollapsibleTrigger asChild>
                      <Button variant="outline" size="sm">
                        {expandedAlerts[alert.id] ? 'Less Details' : 'Analysis'}
                      </Button>
                    </CollapsibleTrigger>
                    <Button variant="destructive" size="sm" className="gap-1">
                      <Ban className="h-4 w-4" />
                      <span>Request Removal</span>
                    </Button>
                    <Button variant="outline" size="sm" className="ml-auto gap-1">
                      <Shield className="h-4 w-4" />
                      <span>Respond</span>
                    </Button>
                  </div>
                </div>
                
                <CollapsibleContent>
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Threat Assessment</h4>
                        <div className="text-sm">
                          {alert.threatType && (
                            <div className="flex items-center mb-1">
                              <span className="font-medium mr-2">Type:</span>
                              <span>{alert.threatType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                            </div>
                          )}
                          {alert.confidenceScore && (
                            <div className="flex items-center mb-1">
                              <span className="font-medium mr-2">AI Confidence:</span>
                              <span>{alert.confidenceScore}%</span>
                            </div>
                          )}
                          {alert.sentiment && (
                            <div className="flex items-center mb-1">
                              <span className="font-medium mr-2">Sentiment:</span>
                              <span className="capitalize">{alert.sentiment}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Recommended Actions</h4>
                        <ul className="text-sm list-disc pl-5">
                          {alert.severity === 'high' && (
                            <>
                              <li>Immediate response required</li>
                              <li>Escalate to communications team</li>
                              <li>Monitor for spread across platforms</li>
                            </>
                          )}
                          {alert.severity === 'medium' && (
                            <>
                              <li>Prepare response within 24 hours</li>
                              <li>Track engagement metrics</li>
                            </>
                          )}
                          {alert.severity === 'low' && (
                            <>
                              <li>Monitor for changes in engagement</li>
                              <li>No immediate action required</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                    
                    {alert.detectedEntities && alert.detectedEntities.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Named Entities</h4>
                        <div className="flex flex-wrap gap-1">
                          {alert.detectedEntities.map((entity, idx) => (
                            <Badge key={idx} variant="outline" className="bg-gray-100">
                              {entity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-3">
                      <Button size="sm" variant="secondary" className="gap-1">
                        <Shield className="h-4 w-4" />
                        <span>AI Response Suggestions</span>
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
              {idx < alerts.length - 1 && <Separator />}
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentAlerts;
