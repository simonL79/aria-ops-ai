
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ModelConfig } from '@/types/aiScraping';

interface ModelFormFieldsProps {
  model: Partial<ModelConfig>;
  onChange: (model: Partial<ModelConfig>) => void;
}

const ModelFormFields = ({ model, onChange }: ModelFormFieldsProps) => {
  
  // Common model fields that don't depend on model type
  const renderCommonFields = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Model Name</Label>
          <Input 
            id="name" 
            value={model.name || ''} 
            onChange={(e) => onChange({...model, name: e.target.value})}
            placeholder="e.g., Fast Sentiment Analyzer" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Model Type</Label>
          <Select 
            value={model.type} 
            onValueChange={(value) => onChange({
              ...model, 
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
          value={model.usage} 
          onValueChange={(value) => onChange({
            ...model, 
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
    </>
  );

  // Type-specific settings
  const renderTypeSpecificFields = () => {
    if (model.type === 'openai') {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input 
              id="apiKey" 
              type="password"
              value={model.config?.apiKey || ''} 
              onChange={(e) => onChange({
                ...model, 
                config: {...model.config, apiKey: e.target.value}
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
              value={model.config?.model}
              onValueChange={(value) => onChange({
                ...model, 
                config: {...model.config, model: value}
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
    } else if (model.type === 'huggingface') {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="hfModel">HuggingFace Model</Label>
            <Input 
              id="hfModel" 
              value={model.config?.model || ''} 
              onChange={(e) => onChange({
                ...model, 
                config: {...model.config, model: e.target.value}
              })}
              placeholder="e.g., facebook/bart-large-mnli" 
            />
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Switch 
              id="useLocal" 
              checked={model.config?.useLocal}
              onCheckedChange={(checked) => onChange({
                ...model, 
                config: {...model.config, useLocal: checked}
              })}
            />
            <Label htmlFor="useLocal">Run model locally in browser</Label>
          </div>
          {!model.config?.useLocal && (
            <div className="space-y-2 mt-4">
              <Label htmlFor="hfApiKey">HuggingFace API Key (optional)</Label>
              <Input 
                id="hfApiKey" 
                type="password"
                value={model.config?.apiKey || ''} 
                onChange={(e) => onChange({
                  ...model, 
                  config: {...model.config, apiKey: e.target.value}
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
              value={model.config?.endpoint || ''} 
              onChange={(e) => onChange({
                ...model, 
                config: {...model.config, endpoint: e.target.value}
              })}
              placeholder="https://..." 
            />
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="customModel">Model Identifier</Label>
            <Input 
              id="customModel" 
              value={model.config?.model || ''} 
              onChange={(e) => onChange({
                ...model, 
                config: {...model.config, model: e.target.value}
              })}
              placeholder="Custom model name/identifier" 
            />
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="customApiKey">API Key (if required)</Label>
            <Input 
              id="customApiKey" 
              type="password"
              value={model.config?.apiKey || ''} 
              onChange={(e) => onChange({
                ...model, 
                config: {...model.config, apiKey: e.target.value}
              })}
              placeholder="Your API key" 
            />
          </div>
        </>
      );
    }
  };

  // Advanced settings like temperature, costs, etc.
  const renderAdvancedSettings = () => (
    <>
      <div className="space-y-2">
        <Label htmlFor="temperature">
          Temperature: {model.config?.temperature}
        </Label>
        <Slider 
          id="temperature"
          min={0} 
          max={1} 
          step={0.1}
          value={[model.config?.temperature || 0.7]} 
          onValueChange={(value) => onChange({
            ...model, 
            config: {...model.config, temperature: value[0]}
          })}
        />
        <p className="text-xs text-muted-foreground">
          Lower values produce more predictable outputs, higher values more creative
        </p>
      </div>

      {!model.config?.useLocal && (
        <div className="space-y-2">
          <Label htmlFor="costPerToken">
            Cost Per 1K Tokens (USD)
          </Label>
          <Input
            id="costPerToken"
            type="number"
            step="0.001"
            min="0"
            value={model.costPerToken || ''}
            onChange={(e) => onChange({
              ...model,
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
          checked={model.active} 
          onCheckedChange={(checked) => onChange({...model, active: checked})}
        />
        <Label htmlFor="active">Enable this model</Label>
      </div>
    </>
  );

  return (
    <div className="space-y-4 py-4">
      {renderCommonFields()}
      {renderTypeSpecificFields()}
      {renderAdvancedSettings()}
    </div>
  );
};

export default ModelFormFields;
