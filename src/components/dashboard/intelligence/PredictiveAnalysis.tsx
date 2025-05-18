
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, AlertTriangle, Search, RefreshCw, Clock } from "lucide-react";
import { PredictionModel } from "@/types/intelligence";

// Sample prediction models
const models: PredictionModel[] = [
  {
    id: "model-1",
    name: "Virality Predictor",
    description: "Forecasts potential viral spread of negative content",
    accuracy: 87,
    lastTrained: "2025-05-15T08:30:00Z",
    predictionType: "virality",
    activeIndicators: ["Share velocity", "Engagement depth", "Network spread", "Influencer pickup"]
  },
  {
    id: "model-2",
    name: "SEO Threat Detector",
    description: "Predicts search engine poisoning attempts",
    accuracy: 82,
    lastTrained: "2025-05-12T15:45:00Z",
    predictionType: "seo",
    activeIndicators: ["Search volume change", "Keyword targeting", "Link patterns", "Domain authority"]
  },
  {
    id: "model-3",
    name: "Coordinated Attack Predictor",
    description: "Identifies early signs of coordinated smear campaigns",
    accuracy: 79,
    lastTrained: "2025-05-10T11:20:00Z",
    predictionType: "attack",
    activeIndicators: ["Account clustering", "Timing patterns", "Content similarity", "Platform spread"]
  }
];

// Sample threat predictions
const threatPredictions = [
  {
    id: "pred-1",
    title: "Potential viral spread of product complaint",
    probability: 76,
    timeframe: "Next 24 hours",
    indicators: ["Picked up by 2 micro-influencers", "43% engagement increase", "Cross-platform sharing"],
    severity: "medium",
    action: "Monitor closely"
  },
  {
    id: "pred-2",
    title: "SEO attack on branded keywords",
    probability: 64,
    timeframe: "Next 72 hours",
    indicators: ["New negative domains ranking", "Unusual backlink patterns", "Competitor IP ranges"],
    severity: "high",
    action: "Preventative content needed"
  },
  {
    id: "pred-3",
    title: "Possible industry press coverage (negative)",
    probability: 58,
    timeframe: "Next week",
    indicators: ["Journalist inquiries increased", "Industry forum discussions", "Competitor PR activity"],
    severity: "medium",
    action: "Prepare statements"
  }
];

const PredictiveAnalysis = () => {
  const [activeTab, setActiveTab] = useState<string>("threats");
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefreshPredictions = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Predictive Reputation Intelligence
            </CardTitle>
            <CardDescription>
              Forecasting potential threats before they materialize
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefreshPredictions}
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Refreshing
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Predictions
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="threats">Predicted Threats</TabsTrigger>
            <TabsTrigger value="models">AI Models</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {activeTab === "threats" && (
          <div className="space-y-4">
            {threatPredictions.map(prediction => (
              <div key={prediction.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">{prediction.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {prediction.timeframe}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${getSeverityColor(prediction.severity)}`}>
                    {prediction.severity.charAt(0).toUpperCase() + prediction.severity.slice(1)}
                  </Badge>
                </div>
                
                <div>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>Probability</span>
                    <span>{prediction.probability}%</span>
                  </div>
                  <Progress value={prediction.probability} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm font-medium">Indicators:</div>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {prediction.indicators.map((indicator, idx) => (
                      <li key={idx}>{indicator}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-1">
                  <div className="text-sm font-medium">Recommended Action:</div>
                  <div className="text-sm">{prediction.action}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === "models" && (
          <div className="space-y-4">
            {models.map(model => (
              <div key={model.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">{model.description}</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    {model.accuracy}% accurate
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Type</div>
                    <div className="font-medium capitalize">{model.predictionType} prediction</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Last trained</div>
                    <div className="font-medium">{formatDate(model.lastTrained)}</div>
                  </div>
                </div>
                
                <div className="pt-1">
                  <div className="text-sm font-medium">Active indicators:</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {model.activeIndicators.map((indicator, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {indicator}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PredictiveAnalysis;
