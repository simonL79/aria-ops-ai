
import { Badge } from "@/components/ui/badge";
import { PredictionModel } from "@/types/intelligence";

interface PredictionModelCardProps {
  model: PredictionModel;
}

const PredictionModelCard = ({ model }: PredictionModelCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
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
          <div className="font-medium capitalize">{model.predictionType || 'General'} prediction</div>
        </div>
        <div>
          <div className="text-muted-foreground">Last trained</div>
          <div className="font-medium">{model.lastTrained ? formatDate(model.lastTrained) : 'Not available'}</div>
        </div>
      </div>
      
      <div className="pt-1">
        <div className="text-sm font-medium">Active indicators:</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {model.activeIndicators?.map((indicator, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {indicator}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictionModelCard;
