
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ThreatPredictionProps {
  prediction: {
    id: string;
    title: string;
    probability: number;
    timeframe: string;
    indicators: string[];
    severity: string;
    action: string;
  };
}

const ThreatPredictionCard = ({ prediction }: ThreatPredictionProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "low": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
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
  );
};

export default ThreatPredictionCard;
