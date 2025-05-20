
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Cpu, Trash2, Zap } from 'lucide-react';
import { ModelConfig } from '@/types/aiScraping';
import { toast } from 'sonner';

interface ModelCardProps {
  model: ModelConfig;
  onToggle: (id: string, active: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onTest: (model: ModelConfig) => Promise<void>;
  isTesting: boolean;
}

export const ModelCard = ({ model, onToggle, onDelete, onTest, isTesting }: ModelCardProps) => {
  const getModelTypeIcon = (type: ModelConfig['type']) => {
    switch(type) {
      case 'openai': return <Cloud className="h-4 w-4 mr-2" />;
      case 'huggingface': return <Cpu className="h-4 w-4 mr-2" />;
      case 'custom': return <Zap className="h-4 w-4 mr-2" />;
      default: return null;
    }
  };

  const getModelDescription = (model: ModelConfig) => {
    const baseDescription = model.type === 'openai' 
      ? 'OpenAI API (cloud based)' 
      : model.type === 'huggingface'
        ? model.config.useLocal 
          ? 'HuggingFace model (locally run)'
          : 'HuggingFace Inference API'
        : 'Custom model deployment';

    const usage = model.usage === 'sentiment' 
      ? 'Sentiment analysis'
      : model.usage === 'classification'
        ? 'Risk classification'
        : model.usage === 'response'
          ? 'Response generation'
          : 'Content summarization';

    return `${baseDescription} - Used for: ${usage}`;
  };

  return (
    <Card key={model.id} className="p-4 bg-card">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            {getModelTypeIcon(model.type)}
            <h3 className="font-medium">{model.name}</h3>
            <Badge variant={model.active ? "default" : "outline"}>
              {model.usage.charAt(0).toUpperCase() + model.usage.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {getModelDescription(model)}
          </p>
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <span className="font-mono">Model: {model.config.model}</span>
            {model.costPerToken !== undefined && (
              <span className="ml-4">Cost: ${model.costPerToken.toFixed(4)}/1K tokens</span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={isTesting}
            onClick={() => onTest(model)}
          >
            Test
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600"
            onClick={() => onDelete(model.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Switch 
            checked={model.active}
            onCheckedChange={(checked) => onToggle(model.id, checked)}
          />
        </div>
      </div>
    </Card>
  );
};

export default ModelCard;
