
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { ThreatVector } from "@/types/intelligence";

interface ThreatVectorsDisplayProps {
  threatVectors: ThreatVector[];
}

const ThreatVectorsDisplay = ({ threatVectors }: ThreatVectorsDisplayProps) => {
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
  );
};

export default ThreatVectorsDisplay;
