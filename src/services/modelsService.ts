
import { toast } from "sonner";
import { ModelConfig } from "@/types/aiScraping";

// Mock storage for model configurations
let modelConfigsStorage: ModelConfig[] = [
  {
    id: 'model-1',
    name: 'Standard Model',
    isDefault: true,
    parameters: {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0.2,
      presencePenalty: 0.5
    }
  },
  {
    id: 'model-2',
    name: 'Conservative Model',
    isDefault: false,
    parameters: {
      temperature: 0.3,
      maxTokens: 1000,
      topP: 0.8,
      frequencyPenalty: 0.5,
      presencePenalty: 0.7
    }
  },
  {
    id: 'model-3',
    name: 'Creative Model',
    isDefault: false,
    parameters: {
      temperature: 0.9,
      maxTokens: 1200,
      topP: 1.0,
      frequencyPenalty: 0.1,
      presencePenalty: 0.3
    }
  }
];

/**
 * Get all model configurations
 */
export const getModelConfigs = (): ModelConfig[] => {
  return [...modelConfigsStorage];
};

/**
 * Get the default model configuration
 */
export const getDefaultModelConfig = (): ModelConfig => {
  const defaultModel = modelConfigsStorage.find(model => model.isDefault);
  return defaultModel || modelConfigsStorage[0];
};

/**
 * Update a model configuration
 */
export const updateModelConfig = (config: ModelConfig): void => {
  const index = modelConfigsStorage.findIndex(model => model.id === config.id);
  
  if (index >= 0) {
    // If this model is being set as default, unset any other defaults
    if (config.isDefault) {
      modelConfigsStorage = modelConfigsStorage.map(model => ({
        ...model,
        isDefault: model.id === config.id
      }));
    } else {
      modelConfigsStorage[index] = config;
    }
    
    toast.success(`Model "${config.name}" updated`, {
      description: 'Your changes have been saved'
    });
  }
};

/**
 * Create a new model configuration
 */
export const createModelConfig = (config: Omit<ModelConfig, 'id'>): ModelConfig => {
  const newConfig: ModelConfig = {
    ...config,
    id: `model-${Date.now()}`
  };
  
  // If this model is being set as default, unset any other defaults
  if (newConfig.isDefault) {
    modelConfigsStorage = modelConfigsStorage.map(model => ({
      ...model,
      isDefault: false
    }));
  }
  
  modelConfigsStorage.push(newConfig);
  
  toast.success(`Model "${newConfig.name}" created`, {
    description: 'Your new model configuration has been saved'
  });
  
  return newConfig;
};

/**
 * Delete a model configuration
 */
export const deleteModelConfig = (id: string): void => {
  const modelToDelete = modelConfigsStorage.find(model => model.id === id);
  if (!modelToDelete) return;
  
  // Don't allow deleting the default model
  if (modelToDelete.isDefault) {
    toast.error('Cannot delete default model', {
      description: 'Please set another model as default before deleting this one'
    });
    return;
  }
  
  modelConfigsStorage = modelConfigsStorage.filter(model => model.id !== id);
  
  toast.success(`Model "${modelToDelete.name}" deleted`, {
    description: 'The model configuration has been removed'
  });
};
