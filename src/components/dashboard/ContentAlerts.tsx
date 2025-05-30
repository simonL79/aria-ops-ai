import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ExternalLink, Eye, CheckCircle, Ban, MessageSquare, User, Building, AtSign, Mail, Globe } from "lucide-react";
import { ContentAlert } from "@/types/dashboard";
import { requestContentRemoval, markAlertAsRead } from "@/services/contentActionService";
import { EntityExtractor, ExtractedEntity } from "@/services/entityExtraction/entityExtractor";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ContentAlertsProps {
  alerts: ContentAlert[];
  isLoading?: boolean;
}

const ContentAlerts = ({ alerts, isLoading }: ContentAlertsProps) => {
  const navigate = useNavigate();
  const [processingAlerts, setProcessingAlerts] = useState<Set<string>>(new Set());

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'negative': return 'text-red-600';
      case 'positive': return 'text-green-600';
      case 'threatening': return 'text-red-800 font-bold';
      default: return 'text-gray-600';
    }
  };

  const getEntityIcon = (type: ExtractedEntity['type']) => {
    switch (type) {
      case 'person': return <User className="h-3 w-3" />;
      case 'company': return <Building className="h-3 w-3" />;
      case 'social_handle': return <AtSign className="h-3 w-3" />;
      case 'email': return <Mail className="h-3 w-3" />;
      case 'website': return <Globe className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const getEntityColor = (type: ExtractedEntity['type']) => {
    switch (type) {
      case 'person': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'company': return 'bg-green-50 text-green-700 border-green-200';
      case 'social_handle': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'email': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'website': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleAnalysis = (alert: ContentAlert) => {
    // Store the alert in sessionStorage for the Engagement Hub
    sessionStorage.setItem('selectedAlert', JSON.stringify(alert));
    
    // Navigate to Engagement Hub with alert ID
    navigate(`/engagement-hub?alert=${alert.id}`);
    
    toast.info("Opening detailed analysis...", {
      description: "Redirecting to Engagement Hub for comprehensive threat analysis"
    });
  };

  const handleRequestRemoval = async (alert: ContentAlert) => {
    if (processingAlerts.has(alert.id)) return;
    
    setProcessingAlerts(prev => new Set(prev).add(alert.id));
    
    try {
      const success = await requestContentRemoval(alert);
      if (success) {
        toast.success("Removal request submitted", {
          description: "Content has been flagged for removal review"
        });
      }
    } catch (error) {
      console.error("Failed to request removal:", error);
      toast.error("Failed to request content removal");
    } finally {
      setProcessingAlerts(prev => {
        const newSet = new Set(prev);
        newSet.delete(alert.id);
        return newSet;
      });
    }
  };

  const handleRespond = (alert: ContentAlert) => {
    // Store the alert for response generation
    sessionStorage.setItem('selectedAlert', JSON.stringify(alert));
    
    // Navigate to Engagement Hub for response generation
    navigate(`/engagement-hub?alert=${alert.id}&action=respond`);
    
    toast.info("Preparing response tools...", {
      description: "Opening response generation interface"
    });
  };

  const handleMarkAsRead = async (alert: ContentAlert) => {
    try {
      await markAlertAsRead(alert);
      toast.success("Alert marked as read");
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark alert as read");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Live OSINT Intelligence Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter for only live OSINT data and process entities
  const liveAlerts = alerts
    .filter(alert => 
      alert.sourceType === 'live_osint' || 
      alert.sourceType === 'live_scan' || 
      alert.sourceType === 'osint_intelligence' ||
      alert.platform === 'Reddit' ||
      alert.platform === 'RSS'
    )
    .map(alert => EntityExtractor.processAlert(alert));

  if (liveAlerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Live OSINT Intelligence Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Live Threats Detected</h3>
            <p className="text-sm text-gray-500 mb-4">
              A.R.I.A™ OSINT systems are monitoring. All intelligence sources active.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live monitoring active • Use Operator Console for manual sweeps</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Live OSINT Intelligence Feed
          <Badge className="bg-green-100 text-green-800 border-green-300">
            {liveAlerts.length} Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {liveAlerts.slice(0, 10).map((alert) => (
            <div
              key={alert.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {alert.platform}
                  </Badge>
                  {alert.sourceType && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      LIVE OSINT
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500">{alert.date}</span>
              </div>

              <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                {alert.content}
              </p>

              {/* Enhanced Entity Display */}
              {alert.extractedEntities && alert.extractedEntities.length > 0 && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
                  <h4 className="text-xs font-medium text-gray-600 mb-2">Detected Entities:</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {alert.extractedEntities.slice(0, 6).map((entity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getEntityColor(entity.type)}`}>
                          <div className="flex items-center gap-1">
                            {getEntityIcon(entity.type)}
                            <span className="capitalize">{entity.type.replace('_', ' ')}</span>
                          </div>
                        </Badge>
                        <span className="text-sm font-medium">{entity.name}</span>
                        <span className="text-xs text-gray-500">({Math.round(entity.confidence * 100)}%)</span>
                      </div>
                    ))}
                    {alert.extractedEntities.length > 6 && (
                      <div className="text-xs text-gray-500">
                        +{alert.extractedEntities.length - 6} more entities detected
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {alert.sentiment && (
                    <span className={`font-medium ${getSentimentColor(alert.sentiment)}`}>
                      Sentiment: {alert.sentiment}
                    </span>
                  )}
                  {alert.confidenceScore && (
                    <span>Confidence: {alert.confidenceScore}%</span>
                  )}
                  {alert.potentialReach && alert.potentialReach > 0 && (
                    <span>Reach: {alert.potentialReach.toLocaleString()}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {alert.url && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={alert.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Source
                      </a>
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleAnalysis(alert)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Analysis
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleRequestRemoval(alert)}
                    disabled={processingAlerts.has(alert.id)}
                  >
                    <Ban className="h-3 w-3 mr-1" />
                    {processingAlerts.has(alert.id) ? 'Processing...' : 'Request Removal'}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="default"
                    onClick={() => handleRespond(alert)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Respond
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentAlerts;
