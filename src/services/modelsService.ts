
import { toast } from "sonner";
import { ModelConfig } from "@/types/aiScraping";

// Mock storage for model configurations
let modelConfigsStorage: ModelConfig[] = [
  {
    id: 'model-1',
    name: 'Standard Model',
    type: 'openai',
    usage: 'sentiment',
    config: {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000,
    },
    isDefault: true,
    parameters: {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0.2,
      presencePenalty: 0.5
    },
    active: true
  },
  {
    id: 'model-2',
    name: 'Conservative Model',
    type: 'huggingface',
    usage: 'classification',
    config: {
      model: 'facebook/bart-large-mnli',
      temperature: 0.3,
      maxTokens: 1000,
      useLocal: false
    },
    isDefault: false,
    parameters: {
      temperature: 0.3,
      maxTokens: 1000,
      topP: 0.8,
      frequencyPenalty: 0.5,
      presencePenalty: 0.7
    },
    active: true
  },
  {
    id: 'model-3',
    name: 'Creative Model',
    type: 'custom',
    usage: 'response',
    config: {
      model: 'custom-model',
      temperature: 0.9,
      maxTokens: 1200,
      endpoint: 'https://api.example.com/model'
    },
    isDefault: false,
    parameters: {
      temperature: 0.9,
      maxTokens: 1200,
      topP: 1.0,
      frequencyPenalty: 0.1,
      presencePenalty: 0.3
    },
    costPerToken: 0.002,
    active: false
  }
];

/**
 * Get all model configurations
 */
export const getModels = async (): Promise<ModelConfig[]> => {
  return [...modelConfigsStorage];
};

/**
 * Get the default model configuration
 */
export const getDefaultModel = (): ModelConfig => {
  const defaultModel = modelConfigsStorage.find(model => model.isDefault);
  return defaultModel || modelConfigsStorage[0];
};

/**
 * Update a model configuration
 */
export const updateModel = async (config: ModelConfig): Promise<void> => {
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
  } else {
    modelConfigsStorage.push(config);
    
    toast.success(`Model "${config.name}" created`, {
      description: 'Your new model configuration has been saved'
    });
  }
};

/**
 * Delete a model configuration
 */
export const deleteModel = async (id: string): Promise<void> => {
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

/**
 * Test a model configuration
 */
export const testModel = async (id: string): Promise<{ success: boolean, message: string }> => {
  const model = modelConfigsStorage.find(m => m.id === id);
  
  if (!model) {
    throw new Error('Model not found');
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 90% success rate for testing
  if (Math.random() > 0.1) {
    return { 
      success: true, 
      message: `${model.type === 'openai' ? 'OpenAI' : model.type === 'huggingface' ? 'HuggingFace' : 'Custom'} model is working correctly` 
    };
  } else {
    throw new Error(`Could not connect to ${model.type} API. Please check your configuration.`);
  }
};
