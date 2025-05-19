import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useClientChanges } from "@/hooks/useClientChanges";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface ReputationRiskScoreProps {
  selectedClient?: string;
  className?: string;
}

interface ScoreEvent {
  date: string;
  score: number;
  delta: number;
  reason: string;
}

const ReputationRiskScore = ({ selectedClient, className }: ReputationRiskScoreProps) => {
  const { riskFingerprints } = useClientChanges();
  const [scoreHistory, setScoreHistory] = useState<ScoreEvent[]>([]);
  const [historicalView, setHistoricalView] = useState(false);
  
  // Find client's risk fingerprint
  const fingerprint = selectedClient ? 
    riskFingerprints.find(fp => fp.clientName === selectedClient) : 
    riskFingerprints[0];
  
  const riskScore = fingerprint?.riskScore || 50;
  
  // Generate sample historical data
  useEffect(() => {
    if (!fingerprint) return;
    
    // Create 14 days of history data
    const history: ScoreEvent[] = [];
    const today = new Date();
    let prevScore = riskScore - (Math.floor(Math.random() * 20) - 10); // Start with a different score
    
    if (prevScore > 100) prevScore = 95;
    if (prevScore < 0) prevScore = 15;
    
    const reasons = [
      "Product review sentiment improved",
      "Negative social mention spiked",
      "Competitor comparison article published",
      "CEO interview coverage",
      "Industry report mentioned brand",
      "Product recall media coverage",
      "Social campaign performance",
      "Viral content mentioned brand"
    ];
    
    for (let i = 14; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Change between -5 and +5, but with more stable periods
      let delta = Math.random() > 0.7 ? 
        Math.floor(Math.random() * 10) - 5 : 
        Math.floor(Math.random() * 3) - 1;
        
      // Ensure more stability overall
      if (Math.random() > 0.8) delta = 0;
      
      // Special case to ensure the final score matches the current score
      if (i === 0) {
        delta = riskScore - prevScore;
      } else {
        prevScore += delta;
        // Keep within bounds
        if (prevScore > 100) { prevScore = 100; delta = 0; }
        if (prevScore < 0) { prevScore = 0; delta = 0; }
      }
      
      history.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: prevScore,
        delta,
        reason: delta !== 0 ? reasons[Math.floor(Math.random() * reasons.length)] : "No significant change"
      });
    }
    
    setScoreHistory(history);
  }, [fingerprint, riskScore]);
  
  // Get risk level and color
  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "Critical", color: "text-red-500", bgColor: "bg-red-100" };
    if (score >= 60) return { level: "High", color: "text-orange-500", bgColor: "bg-orange-100" };
    if (score >= 40) return { level: "Moderate", color: "text-yellow-500", bgColor: "bg-yellow-50" };
    if (score >= 20) return { level: "Low", color: "text-green-500", bgColor: "bg-green-50" };
    return { level: "Minimal", color: "text-green-700", bgColor: "bg-green-100" };
  };
  
  const riskLevelInfo = getRiskLevel(riskScore);
  
  // Recent score events (last 3)
  const recentEvents = scoreHistory.slice(-3);
  
  // Format chart data for recharts
  const chartData = scoreHistory.map(event => ({
    name: event.date,
    score: event.score
  }));

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Reputation Risk Score
          </CardTitle>
          
          <Badge 
            variant="outline" 
            className={`${riskLevelInfo.bgColor} ${riskLevelInfo.color.replace('text-', 'border-')}`}
          >
            {riskLevelInfo.level} Risk
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-6">
        {!historicalView ? (
          <>
            <div className="text-center mb-4">
              <div className="text-5xl font-bold mb-1">{riskScore}</div>
              <p className="text-sm text-muted-foreground">Reputation Score (0-100)</p>
            </div>
            
            <Progress 
              value={riskScore} 
              max={100} 
              className={`h-2.5 ${
                riskScore >= 80 ? "bg-red-500" : 
                riskScore >= 60 ? "bg-orange-500" : 
                riskScore >= 40 ? "bg-yellow-500" : 
                "bg-green-500"
              }`}
            />
            
            <div className="flex text-xs justify-between">
              <span className="text-green-600 font-medium">Safe</span>
              <span className="text-yellow-600 font-medium">Moderate</span>
              <span className="text-red-600 font-medium">Critical</span>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Recent Score Changes</h3>
              <div className="space-y-2">
                {recentEvents.reverse().map((event, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-md border bg-muted/30">
                    <div className="flex items-center gap-2">
                      {event.delta > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : event.delta < 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      ) : (
                        <span className="w-4 h-4 flex items-center justify-center">-</span>
                      )}
                      <span className="text-sm">{event.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{event.score}</span>
                      {event.delta !== 0 && (
                        <Badge variant="outline" className={event.delta > 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}>
                          {event.delta > 0 ? `+${event.delta}` : event.delta}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="name" 
                    tick={{fontSize: 12}}
                    tickLine={false}
                    axisLine={false} 
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{fontSize: 12}}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-medium">Factors Affecting Score</h3>
              
              <div className="p-2 rounded-md border bg-yellow-50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Monitored Threats</span>
                </div>
                <p className="text-xs mt-1 text-muted-foreground">
                  Changes in public content, sentiment, and engagement are continuously monitored.
                </p>
              </div>
            </div>
          </>
        )}
        
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={() => setHistoricalView(!historicalView)}
          >
            {historicalView ? "Show Current Score" : "Show Historical Data"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReputationRiskScore;
