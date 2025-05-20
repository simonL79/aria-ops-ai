
import { Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModelConfig } from '@/types/aiScraping';
import ModelCard from './ModelCard';

interface ModelsListProps {
  models: ModelConfig[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleToggleModel: (id: string, active: boolean) => Promise<void>;
  handleDeleteModel: (id: string) => Promise<void>;
  handleTestModel: (model: ModelConfig) => Promise<void>;
  isTesting: boolean;
}

const ModelsList = ({
  models,
  activeTab,
  setActiveTab,
  handleToggleModel,
  handleDeleteModel,
  handleTestModel,
  isTesting
}: ModelsListProps) => {
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full mb-4">
          <TabsTrigger value="all">All Models</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
          <TabsTrigger value="classification">Classification</TabsTrigger>
          <TabsTrigger value="response">Response</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
      </Tabs>

      {models.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="font-medium">No AI models configured yet</h3>
          <p className="text-sm mt-2">
            A.R.I.A™ comes with built-in GPT-3.5 capabilities,<br />
            but you can add custom models to reduce costs and increase speed.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {models
            .filter(model => activeTab === 'all' || model.usage === activeTab)
            .map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onToggle={handleToggleModel}
                onDelete={handleDeleteModel}
                onTest={handleTestModel}
                isTesting={isTesting}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default ModelsList;
