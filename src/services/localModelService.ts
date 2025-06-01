import { toast } from 'sonner';
import { pipeline, PipelineType, env } from '@huggingface/transformers';

// Configure transformers environment for better browser compatibility
env.allowRemoteModels = true;
env.allowLocalModels = false;
env.useBrowserCache = true;

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
 * Check if we're in a browser environment that supports transformers
 */
const isTransformersSupported = (): boolean => {
  try {
    // Check for required browser features
    const hasWebAssembly = typeof WebAssembly !== 'undefined';
    const hasSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';
    const hasWorker = typeof Worker !== 'undefined';
    const hasFetch = typeof fetch !== 'undefined';
    
    console.log('Browser compatibility check:', {
      hasWebAssembly,
      hasSharedArrayBuffer,
      hasWorker,
      hasFetch,
      userAgent: navigator.userAgent
    });
    
    return hasWebAssembly && hasFetch && typeof window !== 'undefined';
  } catch (error) {
    console.error('Browser compatibility check failed:', error);
    return false;
  }
};

/**
 * Load a model from HuggingFace in the browser with enhanced compatibility
 */
export const loadLocalModel = async (modelId: string, taskType: string): Promise<boolean> => {
  if (!isTransformersSupported()) {
    console.warn('Transformers not supported in this environment - missing WebAssembly or other required features');
    return false;
  }

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
    console.log(`Loading model ${modelId} for task ${taskType}...`);
    
    // Always start with CPU for maximum compatibility
    let device: "cpu" | "webgpu" = 'cpu';
    
    // Convert string taskType to PipelineType
    const pipelineType = taskType as PipelineType;
    
    // Enhanced loading with better timeout and error handling
    const loadWithTimeout = async (timeoutMs: number = 45000) => {
      return Promise.race([
        pipeline(pipelineType, modelId, { 
          device,
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`Downloading ${modelId}: ${Math.round(progress.progress * 100)}%`);
            } else if (progress.status === 'loading') {
              console.log(`Loading ${modelId}: ${progress.name || 'model files'}`);
            }
          }
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Model loading timeout after ${timeoutMs}ms`)), timeoutMs)
        )
      ]);
    };

    // Load the model with timeout
    loadedModels[modelId] = await loadWithTimeout();
    
    // Update model status
    modelStatus[modelId] = {
      isLoading: false,
      isReady: true,
      error: null
    };
    
    console.log(`✅ Model ${modelId} loaded successfully on ${device}`);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error loading model ${modelId}:`, error);
    
    // Enhanced error analysis
    let specificError = 'Model loading failed';
    if (errorMessage.includes('timeout')) {
      specificError = 'Model download/loading timeout - try again with better connection';
    } else if (errorMessage.includes('WebAssembly')) {
      specificError = 'WebAssembly not supported or disabled in browser';
    } else if (errorMessage.includes('SharedArrayBuffer')) {
      specificError = 'SharedArrayBuffer not available - try enabling cross-origin isolation';
    } else if (errorMessage.includes('fetch')) {
      specificError = 'Network error - check internet connection';
    } else if (errorMessage.includes('CORS')) {
      specificError = 'CORS error - browser blocking model download';
    }
    
    // Update model status
    modelStatus[modelId] = {
      isLoading: false,
      isReady: false,
      error: specificError
    };
    
    // Don't show toast for testing environment
    if (typeof window !== 'undefined') {
      toast.error(`Failed to load model ${modelId}`, {
        description: specificError
      });
    }
    
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
 * Run sentiment analysis using a local model with enhanced fallback
 */
export const analyzeSentiment = async (modelId: string, text: string): Promise<PredictionResult> => {
  // Ensure model is loaded
  if (!loadedModels[modelId]) {
    const loaded = await loadLocalModel(modelId, 'sentiment-analysis');
    if (!loaded) {
      console.log('Using fallback sentiment analysis');
      // Enhanced fallback with basic keyword analysis
      const positiveKeywords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'];
      const negativeKeywords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate'];
      
      const lowerText = text.toLowerCase();
      const positiveScore = positiveKeywords.filter(word => lowerText.includes(word)).length;
      const negativeScore = negativeKeywords.filter(word => lowerText.includes(word)).length;
      
      if (positiveScore > negativeScore) {
        return { label: 'POSITIVE', score: 0.75 };
      } else if (negativeScore > positiveScore) {
        return { label: 'NEGATIVE', score: 0.75 };
      } else {
        return { label: 'NEUTRAL', score: 0.50 };
      }
    }
  }
  
  try {
    // Run the model
    const result = await loadedModels[modelId](text);
    
    // Process the result (format depends on the model)
    if (Array.isArray(result)) {
      return result[0];
    } else {
      return result;
    }
  } catch (error) {
    console.error(`Error running model ${modelId}:`, error);
    // Return fallback result
    return {
      label: 'NEUTRAL',
      score: 0.5
    };
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
      // Return mock result for testing
      return [{
        label: 'NEUTRAL',
        score: 0.5
      }];
    }
  }
  
  try {
    const result = await loadedModels[modelId](text);
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    console.error(`Error running model ${modelId}:`, error);
    return [{
      label: 'ERROR',
      score: 0.0
    }];
  }
};

/**
 * Check if local inference server is available - Updated for Ollama
 */
export const checkLocalInferenceServer = async (): Promise<boolean> => {
  try {
    // Use the correct Ollama endpoint that we know works
    const response = await fetch('http://localhost:3001/api/tags', {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
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
 * Get recommended models for a specific task
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
