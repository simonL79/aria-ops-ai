
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader, AlertTriangle, Clock, BarChart3, RefreshCw, AlertCircle } from "lucide-react";
import { IntelligenceReport, ThreatVector, DataSourceStats } from "@/types/intelligence";
import { Progress } from "@/components/ui/progress";
import { runMonitoringScan, getMonitoringStatus, startMonitoring } from "@/services/monitoringService";
import { getAvailableSources } from "@/services/dataIngestionService";
import { ThreatClassificationResult } from "@/services/openaiService";
import ThreatAnalysisHub from "@/components/dashboard/ThreatAnalysisHub";
import DarkWebSurveillance from "@/components/dashboard/DarkWebSurveillance";

// Sample data for MVP
const sampleReport: IntelligenceReport = {
  id: "rep-1",
  title: "Weekly Reputation Analysis",
  date: "May 18, 2025",
  summary: "Overall positive sentiment with isolated negative mentions. One coordinated attack identified from competitor sources.",
  threatLevel: 4.2,
  topics: ["Customer Service", "Product Quality", "Pricing", "Delivery Times"],
  sources: 7,
  mentions: 156,
  sentiment: {
    positive: 62,
    neutral: 21,
    negative: 17
  }
};

const threatVectors: ThreatVector[] = [
  {
    type: "coordinatedAttack",
    count: 1,
    severity: 8,
    trend: "increasing",
    examples: ["Multiple identical negative posts appeared across platforms within 30 minutes"]
  },
  {
    type: "falseReviews",
    count: 12,
    severity: 6,
    trend: "stable",
    examples: ["Reviews mentioning products we don't sell", "Reviews from users who purchased elsewhere"]
  },
  {
    type: "misinformation",
    count: 5,
    severity: 7,
    trend: "decreasing",
    examples: ["False claims about manufacturing locations", "Incorrect statements about ingredients"]
  }
];

const sourceStats: DataSourceStats[] = [
  { source: "Twitter", mentions: 78, sentiment: -2, coverage: 85 },
  { source: "Reddit", mentions: 34, sentiment: 4, coverage: 70 },
  { source: "Google News", mentions: 12, sentiment: 1, coverage: 90 },
  { source: "Review Sites", mentions: 32, sentiment: -5, coverage: 60 }
];

interface IntelligenceDashboardProps {
  onAlertDetected?: (alert: ThreatClassificationResult) => void;
}

const IntelligenceDashboard = ({ onAlertDetected }: IntelligenceDashboardProps) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isRunningAnalysis, setIsRunningAnalysis] = useState<boolean>(false);
  const [availableSources, setAvailableSources] = useState<any[]>([]);
  const [monitoringStatus, setMonitoringStatus] = useState<any>(null);
  
  useEffect(() => {
    // Get available sources
    setAvailableSources(getAvailableSources());
    
    // Get monitoring status
    setMonitoringStatus(getMonitoringStatus());
    
    // Set up monitoring if not yet active
    if (!getMonitoringStatus().isActive) {
      startMonitoring();
    }
    
    // Refresh monitoring status every minute
    const statusInterval = setInterval(() => {
      setMonitoringStatus(getMonitoringStatus());
    }, 60000);
    
    return () => {
      clearInterval(statusInterval);
    };
  }, []);
  
  const handleRunAnalysis = async () => {
    setIsRunningAnalysis(true);
    
    try {
      await runMonitoringScan();
    } finally {
      setIsRunningAnalysis(false);
    }
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <span className="text-red-500">↑</span>;
      case 'decreasing':
        return <span className="text-green-500">↓</span>;
      default:
        return <span className="text-gray-500">→</span>;
    }
  };
  
  const getSeverityColor = (severity: number) => {
    if (severity <= 3) return "bg-green-500";
    if (severity <= 5) return "bg-blue-500";
    if (severity <= 7) return "bg-yellow-500";
    if (severity <= 8) return "bg-orange-500";
    return "bg-red-500";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reputation Intelligence</h2>
        <Button 
          onClick={handleRunAnalysis} 
          disabled={isRunningAnalysis}
          variant="default"
        >
          {isRunningAnalysis ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Running Analysis...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Full Analysis
            </>
          )}
        </Button>
      </div>
      
      {monitoringStatus && (
        <Alert variant="default" className="bg-blue-50 border-blue-200 text-blue-800">
          <Clock className="h-4 w-4" />
          <AlertTitle>Monitoring Active</AlertTitle>
          <AlertDescription>
            Last scan: {new Date(monitoringStatus.lastRun).toLocaleTimeString()}
            {monitoringStatus.nextRun && (
              <> • Next scan: {new Date(monitoringStatus.nextRun).toLocaleTimeString()}</>
            )}
            {' • '}{monitoringStatus.sources} sources monitored
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="threats">Threat Vectors</TabsTrigger>
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium">{sampleReport.title}</h3>
                      <p className="text-sm text-muted-foreground">{sampleReport.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Threat Level</div>
                      <div className="text-3xl font-bold">{sampleReport.threatLevel}/10</div>
                    </div>
                  </div>
                  
                  <p>{sampleReport.summary}</p>
                  
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{sampleReport.sources}</div>
                      <div className="text-sm text-muted-foreground">Sources</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{sampleReport.mentions}</div>
                      <div className="text-sm text-muted-foreground">Mentions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{sampleReport.topics.length}</div>
                      <div className="text-sm text-muted-foreground">Topics</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Sentiment Analysis</div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-green-500 h-full" 
                        style={{ width: `${sampleReport.sentiment.positive}%` }}
                      ></div>
                      <div 
                        className="bg-gray-400 h-full" 
                        style={{ width: `${sampleReport.sentiment.neutral}%` }}
                      ></div>
                      <div 
                        className="bg-red-500 h-full" 
                        style={{ width: `${sampleReport.sentiment.negative}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <div>Positive: {sampleReport.sentiment.positive}%</div>
                      <div>Neutral: {sampleReport.sentiment.neutral}%</div>
                      <div>Negative: {sampleReport.sentiment.negative}%</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-2">Topics</div>
                    <div className="flex flex-wrap gap-2">
                      {sampleReport.topics.map((topic) => (
                        <Badge key={topic} variant="secondary">{topic}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="threats" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Active Threat Vectors</h3>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        {threatVectors.length} Detected
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {threatVectors.map((threat) => (
                        <div key={threat.type} className="border rounded-md p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-amber-500" />
                              <h4 className="font-medium">{threat.type.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</h4>
                            </div>
                            <Badge className={`${getSeverityColor(threat.severity)} text-white`}>
                              {threat.severity}/10
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            <div>
                              <div className="text-sm text-muted-foreground">Instances</div>
                              <div className="font-medium">{threat.count}</div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Trend</div>
                              <div className="font-medium flex items-center">
                                {getTrendIcon(threat.trend)}
                                <span className="ml-1">{threat.trend.charAt(0).toUpperCase() + threat.trend.slice(1)}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-muted-foreground">Action</div>
                              <div className="font-medium text-amber-600">Required</div>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="text-sm text-muted-foreground">Examples</div>
                            <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                              {threat.examples.map((example, i) => (
                                <li key={i}>{example}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sources" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Data Sources</h3>
                      <Badge variant="outline">
                        {availableSources.filter(s => s.active).length}/{availableSources.length} Connected
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {availableSources.map((source) => (
                        <div key={source.id} className="border rounded-md p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${source.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              <div>
                                <div className="font-medium">{source.name}</div>
                                <div className="text-xs text-muted-foreground">{source.type.charAt(0).toUpperCase() + source.type.slice(1)}</div>
                              </div>
                            </div>
                            <div className="text-right text-sm">
                              {source.active ? (
                                <div className="text-green-600">Connected</div>
                              ) : (
                                <Button size="sm" variant="outline" className="h-7 text-xs">Connect</Button>
                              )}
                            </div>
                          </div>
                          
                          {source.active && source.lastScan && (
                            <div className="text-xs text-muted-foreground mt-2">
                              Last scan: {source.lastScan}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-3">Source Intelligence Coverage</h3>
                      {sourceStats.map((stat) => (
                        <div key={stat.source} className="mb-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{stat.source}</span>
                            <span>{stat.coverage}%</span>
                          </div>
                          <Progress value={stat.coverage} max={100} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <ThreatAnalysisHub />
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Active Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col">
                <div className="text-sm font-medium">Priority Mentions</div>
                <div className="text-3xl font-bold mt-2">37 <span className="text-sm text-muted-foreground font-normal">in the last 24h</span></div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div className="font-medium text-green-600">19</div>
                    <div className="text-xs text-muted-foreground">Positive</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-600">8</div>
                    <div className="text-xs text-muted-foreground">Neutral</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-red-600">10</div>
                    <div className="text-xs text-muted-foreground">Negative</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium mb-2">Real-Time Systems</div>
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Social Monitoring</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">News Alerts</span>
                    </div>
                    <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                      <span className="text-sm">Dark Web Surveillance</span>
                    </div>
                    <Badge variant="outline" className="text-amber-600 bg-amber-50">Limited</Badge>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
                    Risk Score
                  </div>
                  <div className="text-xl font-bold">42%</div>
                </div>
                <Progress value={42} max={100} className="h-2 mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  Your brand's risk score is lower than 67% of similar companies in your industry.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <DarkWebSurveillance />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Trend visualization will be available with more data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceDashboard;
