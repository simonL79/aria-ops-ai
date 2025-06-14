
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";
import { PredictionModel } from "@/types/intelligence";
import PredictionHeader from "./predictive/PredictionHeader";
import ThreatPredictionsTab from "./predictive/ThreatPredictionsTab";
import PredictionModelsTab from "./predictive/PredictionModelsTab";

// Sample prediction models
const models: PredictionModel[] = [
  {
    id: "model-1",
    name: "Virality Predictor",
    description: "Forecasts potential viral spread of negative content",
    accuracy: 87,
    lastUpdated: "2025-05-15T08:30:00Z",
    predictionTimeframe: "days",
    dataPoints: ["Share velocity", "Engagement depth", "Network spread", "Influencer pickup"],
    confidenceScore: 0.87,
    active: true,
    lastTrained: "2025-05-15T08:30:00Z",
    predictionType: "virality",
    activeIndicators: ["Share velocity", "Engagement depth", "Network spread", "Influencer pickup"]
  },
  {
    id: "model-2",
    name: "SEO Threat Detector",
    description: "Predicts search engine poisoning attempts",
    accuracy: 82,
    lastUpdated: "2025-05-12T15:45:00Z",
    predictionTimeframe: "weeks",
    dataPoints: ["Search volume change", "Keyword targeting", "Link patterns", "Domain authority"],
    confidenceScore: 0.82,
    active: true,
    lastTrained: "2025-05-12T15:45:00Z",
    predictionType: "seo",
    activeIndicators: ["Search volume change", "Keyword targeting", "Link patterns", "Domain authority"]
  },
  {
    id: "model-3",
    name: "Coordinated Attack Predictor",
    description: "Identifies early signs of coordinated smear campaigns",
    accuracy: 79,
    lastUpdated: "2025-05-10T11:20:00Z",
    predictionTimeframe: "days",
    dataPoints: ["Account clustering", "Timing patterns", "Content similarity", "Platform spread"],
    confidenceScore: 0.79,
    active: true,
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
  const [predictions, setPredictions] = useState(threatPredictions);

  const handleRefreshPredictions = () => {
    setRefreshing(true);
    
    // Simulate API call to refresh predictions
    setTimeout(() => {
      // Generate a new prediction to show refresh effect
      const newPrediction = {
        id: `pred-${Date.now()}`,
        title: "New emerging sentiment shift on social platforms",
        probability: Math.floor(Math.random() * 30) + 50, // 50-80
        timeframe: "Next 48 hours",
        indicators: ["Algorithm change detected", "Engagement pattern shift", "Topic clustering"],
        severity: Math.random() > 0.5 ? "medium" : "high",
        action: "Prepare monitoring strategy"
      };
      
      // Add new prediction at top of list
      setPredictions([newPrediction, ...predictions.slice(0, 2)]);
      setRefreshing(false);
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <PredictionHeader 
          refreshing={refreshing} 
          onRefresh={handleRefreshPredictions} 
        />
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="threats">Predicted Threats</TabsTrigger>
            <TabsTrigger value="models">AI Models</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {activeTab === "threats" && (
          <ThreatPredictionsTab predictions={predictions} />
        )}
        
        {activeTab === "models" && (
          <PredictionModelsTab models={models} />
        )}
      </CardContent>
    </Card>
  );
};

export default PredictiveAnalysis;
