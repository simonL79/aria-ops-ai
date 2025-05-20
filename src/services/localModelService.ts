
import { toast } from 'sonner';
import { pipeline, PipelineType } from '@huggingface/transformers';

// Interface for model loading status
interface ModelStatus {
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
}

// Interface for model prediction result
interface PredictionResult {
  label: string;
  score: number;
  [key: string]: any;
}

// Store for loaded models
const loadedModels: Record<string, any> = {};
const modelStatus: Record<string, ModelStatus> = {};

/**
 * Load a model from HuggingFace in the browser
 */
export const loadLocalModel = async (modelId: string, taskType: string): Promise<boolean> => {
  if (loadedModels[modelId]) {
    return true;
  }
  
  // Initialize model status
  modelStatus[modelId] = {
    isLoading: true,
    isReady: false,
    error: null
  };
  
  try {
    // Import the transformers package dynamically
    console.log(`Loading model ${modelId} for task ${taskType}...`);
    
    // Determine device to use (prefer WebGPU if available)
    const device = 'webgpu'; // This will fall back to 'cpu' if WebGPU is not available
    
    // Convert string taskType to PipelineType
    const pipelineType = taskType as PipelineType;
    
    // Load the model
    loadedModels[modelId] = await pipeline(pipelineType, modelId, { device });
    
    // Update model status
    modelStatus[modelId] = {
      isLoading: false,
      isReady: true,
      error: null
    };
    
    console.log(`Model ${modelId} loaded successfully`);
    return true;
  } catch (error) {
    console.error(`Error loading model ${modelId}:`, error);
    
    // Update model status
    modelStatus[modelId] = {
      isLoading: false,
      isReady: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    
    toast.error(`Failed to load model ${modelId}`, {
      description: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return false;
  }
};

/**
 * Get the status of a model
 */
export const getModelStatus = (modelId: string): ModelStatus => {
  return modelStatus[modelId] || {
    isLoading: false,
    isReady: false,
    error: null
  };
};

/**
 * Unload a model to free up memory
 */
export const unloadModel = (modelId: string): void => {
  if (loadedModels[modelId]) {
    delete loadedModels[modelId];
    delete modelStatus[modelId];
    console.log(`Model ${modelId} unloaded`);
  }
};

/**
 * Run sentiment analysis using a local model
 */
export const analyzeSentiment = async (modelId: string, text: string): Promise<PredictionResult> => {
  // Ensure model is loaded
  if (!loadedModels[modelId]) {
    const loaded = await loadLocalModel(modelId, 'sentiment-analysis');
    if (!loaded) {
      throw new Error(`Model ${modelId} failed to load`);
    }
  }
  
  try {
    // Run the model
    const result = await loadedModels[modelId](text);
    
    // Process the result (format depends on the model)
    if (Array.isArray(result)) {
      // Some models return an array of results, take the first one
      return result[0];
    } else {
      return result;
    }
  } catch (error) {
    console.error(`Error running model ${modelId}:`, error);
    throw error;
  }
};

/**
 * Run text classification using a local model
 */
export const classifyText = async (modelId: string, text: string): Promise<PredictionResult[]> => {
  // Ensure model is loaded
  if (!loadedModels[modelId]) {
    const loaded = await loadLocalModel(modelId, 'text-classification');
    if (!loaded) {
      throw new Error(`Model ${modelId} failed to load`);
    }
  }
  
  try {
    // Run the model
    const result = await loadedModels[modelId](text);
    return result;
  } catch (error) {
    console.error(`Error running model ${modelId}:`, error);
    throw error;
  }
};

/**
 * Extract named entities from text using a local model
 */
export const extractEntities = async (modelId: string, text: string): Promise<PredictionResult[]> => {
  // Ensure model is loaded
  if (!loadedModels[modelId]) {
    const loaded = await loadLocalModel(modelId, 'token-classification');
    if (!loaded) {
      throw new Error(`Model ${modelId} failed to load`);
    }
  }
  
  try {
    // Run the model
    const result = await loadedModels[modelId](text);
    return result;
  } catch (error) {
    console.error(`Error running model ${modelId}:`, error);
    throw error;
  }
};

/**
 * Get available models for a specific task
 */
export const getRecommendedModels = (task: string): string[] => {
  switch (task) {
    case 'sentiment-analysis':
      return [
        'distilbert-base-uncased-finetuned-sst-2-english',
        'finiteautomata/bertweet-base-sentiment-analysis',
        'cardiffnlp/twitter-roberta-base-sentiment'
      ];
    
    case 'text-classification':
      return [
        'facebook/bart-large-mnli',
        'cross-encoder/nli-distilroberta-base',
        'MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7'
      ];
    
    case 'token-classification':
      return [
        'dslim/bert-base-NER',
        'dbmdz/bert-large-cased-finetuned-conll03-english',
        'Jean-Baptiste/camembert-ner'
      ];
      
    default:
      return [];
  }
};
