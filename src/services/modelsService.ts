
import { toast } from 'sonner';
import { ModelConfig } from '@/types/aiScraping';

// Mock storage for AI models
let modelsStorage: ModelConfig[] = [
  {
    id: 'model-001',
    name: 'Local Sentiment Analyzer',
    type: 'huggingface',
    usage: 'sentiment',
    config: {
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      temperature: 0.3,
      maxTokens: 100,
      useLocal: true
    },
    active: true
  },
  {
    id: 'model-002',
    name: 'GPT Response Generator',
    type: 'openai',
    usage: 'response',
    config: {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 500
    },
    costPerToken: 0.002,
    active: true
  }
];

/**
 * Get all available AI models
 */
export const getModels = async (): Promise<ModelConfig[]> => {
  // In a real implementation, this would be fetched from a database
  return modelsStorage;
};

/**
 * Get models for a specific usage
 */
export const getModelsForUsage = async (usage: ModelConfig['usage']): Promise<ModelConfig[]> => {
  return modelsStorage.filter(model => model.usage === usage && model.active);
};

/**
 * Get a specific model by ID
 */
export const getModel = async (id: string): Promise<ModelConfig | undefined> => {
  return modelsStorage.find(model => model.id === id);
};

/**
 * Create or update an AI model
 */
export const updateModel = async (model: ModelConfig): Promise<ModelConfig> => {
  // Check if the model already exists
  const existingIndex = modelsStorage.findIndex(m => m.id === model.id);
  
  if (existingIndex >= 0) {
    // Update existing model
    modelsStorage[existingIndex] = model;
  } else {
    // Create new model
    modelsStorage.push(model);
  }
  
  return model;
};

/**
 * Delete an AI model
 */
export const deleteModel = async (id: string): Promise<boolean> => {
  const initialLength = modelsStorage.length;
  modelsStorage = modelsStorage.filter(m => m.id !== id);
  return modelsStorage.length < initialLength;
};

/**
 * Test a model to ensure it's working
 */
export const testModel = async (id: string): Promise<{ success: boolean, message?: string, error?: string }> => {
  const model = await getModel(id);
  if (!model) {
    return { success: false, error: `Model with ID ${id} not found` };
  }
  
  // Simulate testing process
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demonstration, we'll simulate success for most models
  if (Math.random() > 0.9) {
    // 10% chance of failure
    return { 
      success: false, 
      error: "Connection timed out. Check API key or endpoint." 
    };
  }
  
  switch (model.type) {
    case 'openai':
      return { 
        success: true, 
        message: "Successfully connected to OpenAI API and tested model." 
      };
    
    case 'huggingface':
      if (model.config.useLocal) {
        return { 
          success: true, 
          message: "Model loaded and running locally in the browser." 
        };
      } else {
        return { 
          success: true, 
          message: "Successfully connected to HuggingFace Inference API." 
        };
      }
    
    case 'custom':
      return { 
        success: true, 
        message: "Successfully connected to custom model endpoint." 
      };
    
    default:
      return { 
        success: false, 
        error: "Unknown model type" 
      };
  }
};

/**
 * Use a model to analyze content
 */
export const analyzeWithModel = async (modelId: string, content: string): Promise<any> => {
  const model = await getModel(modelId);
  if (!model) {
    throw new Error(`Model with ID ${modelId} not found`);
  }
  
  if (!model.active) {
    throw new Error(`Model ${model.name} is not active`);
  }
  
  // Simulate analysis process
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock results based on model usage
  switch (model.usage) {
    case 'sentiment':
      return {
        sentiment: Math.random() * 2 - 1, // -1 to 1
        confidence: Math.random() * 0.5 + 0.5 // 0.5 to 1
      };
    
    case 'classification':
      const categories = ['Neutral', 'Positive', 'Complaint', 'Reputation Threat', 'Misinformation', 'Legal Risk'];
      const category = categories[Math.floor(Math.random() * categories.length)];
      return {
        category,
        severity: Math.floor(Math.random() * 10) + 1, // 1 to 10
        confidence: Math.random() * 0.5 + 0.5 // 0.5 to 1
      };
    
    case 'response':
      return {
        response: `This is a mock response for the content: "${content.substring(0, 50)}..."`
      };
    
    case 'summary':
      return {
        summary: `This is a mock summary of the content: "${content.substring(0, 50)}..."`
      };
    
    default:
      throw new Error(`Unsupported model usage: ${model.usage}`);
  }
};
