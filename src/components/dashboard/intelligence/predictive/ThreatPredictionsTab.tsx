
import ThreatPredictionCard from "./ThreatPredictionCard";

interface ThreatPrediction {
  id: string;
  title: string;
  probability: number;
  timeframe: string;
  indicators: string[];
  severity: string;
  action: string;
}

interface ThreatPredictionsTabProps {
  predictions: ThreatPrediction[];
}

const ThreatPredictionsTab = ({ predictions }: ThreatPredictionsTabProps) => {
  return (
    <div className="space-y-4">
      {predictions.map(prediction => (
        <ThreatPredictionCard key={prediction.id} prediction={prediction} />
      ))}
    </div>
  );
};

export default ThreatPredictionsTab;
