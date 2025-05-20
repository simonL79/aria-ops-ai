
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { PlusCircle, Trash2, Cloud, Cpu, Zap, Info } from 'lucide-react';
import { toast } from 'sonner';
import { ModelConfig } from '@/types/aiScraping';

// These services will be implemented later
import { 
  getModels, 
  updateModel, 
  deleteModel,
  testModel
} from '@/services/modelsService';

const ModelSettings = () => {
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isTesting, setIsTesting] = useState(false);
  const [newModel, setNewModel] = useState<Partial<ModelConfig>>({
    name: '',
    type: 'huggingface',
    usage: 'sentiment',
    config: {
      model: '',
      temperature: 0.7,
      maxTokens: 500,
      useLocal: false
    },
    active: true
  });

  useEffect(() => {
    // In a real implementation, this would load from an API or database
    // For now, we'll use a mock implementation
    const loadModels = async () => {
      try {
        const modelsList = await getModels();
        setModels(modelsList);
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };
    
    loadModels();
  }, []);

  const handleAddModel = async () => {
    if (!newModel.name) {
      toast.error("Model name is required");
      return;
    }

    if (!newModel.config?.model) {
      toast.error("Model identifier is required");
      return;
    }

    try {
      const model: ModelConfig = {
        id: `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: newModel.name || '',
        type: (newModel.type as ModelConfig['type']) || 'huggingface',
        usage: (newModel.usage as ModelConfig['usage']) || 'sentiment',
        config: {
          model: newModel.config?.model || '',
          temperature: newModel.config?.temperature || 0.7,
          maxTokens: newModel.config?.maxTokens || 500,
          apiKey: newModel.config?.apiKey,
          endpoint: newModel.config?.endpoint,
          useLocal: newModel.config?.useLocal || false
        },
        costPerToken: newModel.costPerToken,
        active: newModel.active || true
      };

      await updateModel(model);
      setModels([...models, model]);
      setIsAddingModel(false);
      setNewModel({
        name: '',
        type: 'huggingface',
        usage: 'sentiment',
        config: {
          model: '',
          temperature: 0.7,
          maxTokens: 500,
          useLocal: false
        },
        active: true
      });

      toast.success("Model added", {
        description: `${model.name} has been added to your models`
      });
    } catch (error) {
      console.error("Error adding model:", error);
      toast.error("Failed to add model");
    }
  };

  const handleDeleteModel = async (id: string) => {
    try {
      await deleteModel(id);
      setModels(models.filter(model => model.id !== id));
      toast.success("Model removed", {
        description: "The model has been removed"
      });
    } catch (error) {
      console.error("Error deleting model:", error);
      toast.error("Failed to remove model");
    }
  };

  const handleToggleModel = async (id: string, active: boolean) => {
    try {
      const updatedModels = models.map(model => 
        model.id === id ? { ...model, active } : model
      );
      
      const model = models.find(m => m.id === id);
      if (!model) return;
      
      await updateModel({ ...model, active });
      setModels(updatedModels);
      
      toast.success(`Model ${active ? 'activated' : 'deactivated'}`, {
        description: `${model.name} is now ${active ? 'active' : 'inactive'}`
      });
    } catch (error) {
      console.error("Error toggling model:", error);
      toast.error("Failed to update model status");
    }
  };

  const handleTestModel = async (model: ModelConfig) => {
    setIsTesting(true);
    
    try {
      const result = await testModel(model.id);
      
      toast.success(`Test successful for ${model.name}`, {
        description: result?.message || "Model working correctly"
      });
    } catch (error) {
      console.error("Error testing model:", error);
      toast.error(`Test failed for ${model.name}`, {
        description: error instanceof Error ? error.message : "Unknown error occurred"
      });
    } finally {
      setIsTesting(false);
    }
  };

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

  const getModelTypeOptions = () => {
    if (newModel.type === 'openai') {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input 
              id="apiKey" 
              type="password"
              value={newModel.config?.apiKey || ''} 
              onChange={(e) => setNewModel({
                ...newModel, 
                config: {...newModel.config, apiKey: e.target.value}
              })}
              placeholder="sk-..." 
            />
            <p className="text-xs text-muted-foreground">
              API key will be stored securely. Only you can view this key.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="openaiModel">OpenAI Model</Label>
            <Select 
              value={newModel.config?.model}
              onValueChange={(value) => setNewModel({
                ...newModel, 
                config: {...newModel.config, model: value}
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select OpenAI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );
    } else if (newModel.type === 'huggingface') {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="hfModel">HuggingFace Model</Label>
            <Input 
              id="hfModel" 
              value={newModel.config?.model || ''} 
              onChange={(e) => setNewModel({
                ...newModel, 
                config: {...newModel.config, model: e.target.value}
              })}
              placeholder="e.g., facebook/bart-large-mnli" 
            />
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Switch 
              id="useLocal" 
              checked={newModel.config?.useLocal}
              onCheckedChange={(checked) => setNewModel({
                ...newModel, 
                config: {...newModel.config, useLocal: checked}
              })}
            />
            <Label htmlFor="useLocal">Run model locally in browser</Label>
          </div>
          {!newModel.config?.useLocal && (
            <div className="space-y-2 mt-4">
              <Label htmlFor="hfApiKey">HuggingFace API Key (optional)</Label>
              <Input 
                id="hfApiKey" 
                type="password"
                value={newModel.config?.apiKey || ''} 
                onChange={(e) => setNewModel({
                  ...newModel, 
                  config: {...newModel.config, apiKey: e.target.value}
                })}
                placeholder="hf_..." 
              />
            </div>
          )}
        </>
      );
    } else {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="endpoint">Model Endpoint</Label>
            <Input 
              id="endpoint" 
              value={newModel.config?.endpoint || ''} 
              onChange={(e) => setNewModel({
                ...newModel, 
                config: {...newModel.config, endpoint: e.target.value}
              })}
              placeholder="https://..." 
            />
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="customModel">Model Identifier</Label>
            <Input 
              id="customModel" 
              value={newModel.config?.model || ''} 
              onChange={(e) => setNewModel({
                ...newModel, 
                config: {...newModel.config, model: e.target.value}
              })}
              placeholder="Custom model name/identifier" 
            />
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="customApiKey">API Key (if required)</Label>
            <Input 
              id="customApiKey" 
              type="password"
              value={newModel.config?.apiKey || ''} 
              onChange={(e) => setNewModel({
                ...newModel, 
                config: {...newModel.config, apiKey: e.target.value}
              })}
              placeholder="Your API key" 
            />
          </div>
        </>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">AI Models</h2>
        <Dialog open={isAddingModel} onOpenChange={setIsAddingModel}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add AI Model</DialogTitle>
              <DialogDescription>
                Configure AI models to use for different tasks in A.R.I.A™
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Model Name</Label>
                  <Input 
                    id="name" 
                    value={newModel.name} 
                    onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                    placeholder="e.g., Fast Sentiment Analyzer" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Model Type</Label>
                  <Select 
                    value={newModel.type} 
                    onValueChange={(value) => setNewModel({
                      ...newModel, 
                      type: value as ModelConfig['type']
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI API</SelectItem>
                      <SelectItem value="huggingface">HuggingFace</SelectItem>
                      <SelectItem value="custom">Custom Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="usage">Model Usage</Label>
                <Select 
                  value={newModel.usage} 
                  onValueChange={(value) => setNewModel({
                    ...newModel, 
                    usage: value as ModelConfig['usage']
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model usage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
                    <SelectItem value="classification">Risk Classification</SelectItem>
                    <SelectItem value="response">Response Generation</SelectItem>
                    <SelectItem value="summary">Content Summarization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {getModelTypeOptions()}

              <div className="space-y-2">
                <Label htmlFor="temperature">
                  Temperature: {newModel.config?.temperature}
                </Label>
                <Slider 
                  id="temperature"
                  min={0} 
                  max={1} 
                  step={0.1}
                  value={[newModel.config?.temperature || 0.7]} 
                  onValueChange={(value) => setNewModel({
                    ...newModel, 
                    config: {...newModel.config, temperature: value[0]}
                  })}
                />
                <p className="text-xs text-muted-foreground">
                  Lower values produce more predictable outputs, higher values more creative
                </p>
              </div>

              {!newModel.config?.useLocal && (
                <div className="space-y-2">
                  <Label htmlFor="costPerToken">
                    Cost Per 1K Tokens (USD)
                  </Label>
                  <Input
                    id="costPerToken"
                    type="number"
                    step="0.001"
                    min="0"
                    value={newModel.costPerToken || ''}
                    onChange={(e) => setNewModel({
                      ...newModel,
                      costPerToken: parseFloat(e.target.value)
                    })}
                    placeholder="e.g., 0.002"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: for cost tracking and optimization
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch 
                  id="active" 
                  checked={newModel.active} 
                  onCheckedChange={(checked) => setNewModel({...newModel, active: checked})}
                />
                <Label htmlFor="active">Enable this model</Label>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingModel(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddModel}>
                Add Model
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
                        onClick={() => handleTestModel(model)}
                      >
                        Test
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        onClick={() => handleDeleteModel(model.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Switch 
                        checked={model.active}
                        onCheckedChange={(checked) => handleToggleModel(model.id, checked)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelSettings;
