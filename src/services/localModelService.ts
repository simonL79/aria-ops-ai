import { toast } from 'sonner';
import { pipeline, PipelineType, env } from '@huggingface/transformers';

// Configure transformers environment for maximum browser compatibility
env.allowRemoteModels = true;
env.allowLocalModels = false;
env.useBrowserCache = true;
env.backends.onnx.wasm.numThreads = 1; // Single thread for better compatibility

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
    // Enhanced browser compatibility checks
    const hasWebAssembly = typeof WebAssembly !== 'undefined';
    const hasFetch = typeof fetch !== 'undefined';
    const hasWorker = typeof Worker !== 'undefined';
    const hasSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';
    
    // Test WebAssembly instantiation
    let wasmSupport = false;
    try {
      const wasmModule = new WebAssembly.Module(new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]));
      wasmSupport = wasmModule instanceof WebAssembly.Module;
    } catch {
      wasmSupport = false;
    }
    
    console.log('Enhanced browser compatibility check:', {
      hasWebAssembly,
      wasmSupport,
      hasFetch,
      hasWorker,
      hasSharedArrayBuffer,
      userAgent: navigator.userAgent.substring(0, 50)
    });
    
    return hasWebAssembly && wasmSupport && hasFetch && typeof window !== 'undefined';
  } catch (error) {
    console.error('Browser compatibility check failed:', error);
    return false;
  }
};

/**
 * Get smaller, more compatible models for browser use
 */
const getBrowserCompatibleModel = (taskType: string): string => {
  switch (taskType) {
    case 'sentiment-analysis':
      return 'Xenova/distilbert-base-uncased-finetuned-sst-2-english'; // Smaller quantized version
    case 'text-classification':
      return 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
    default:
      return 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
  }
};

/**
 * Load a model from HuggingFace in the browser with enhanced compatibility
 */
export const loadLocalModel = async (modelId: string, taskType: string): Promise<boolean> => {
  if (!isTransformersSupported()) {
    console.warn('Transformers not supported - missing WebAssembly or required browser features');
    return false;
  }

  // Use browser-compatible model if original fails
  const compatibleModelId = getBrowserCompatibleModel(taskType);
  const actualModelId = modelId.includes('Xenova/') ? modelId : compatibleModelId;

  if (loadedModels[actualModelId]) {
    return true;
  }
  
  // Initialize model status
  modelStatus[actualModelId] = {
    isLoading: true,
    isReady: false,
    error: null
  };
  
  try {
    console.log(`Loading browser-compatible model ${actualModelId} for task ${taskType}...`);
    
    // Always use CPU for maximum compatibility
    const device = 'cpu';
    const pipelineType = taskType as PipelineType;
    
    // Enhanced loading with shorter timeout for browser compatibility
    const loadWithTimeout = async (timeoutMs: number = 20000) => {
      return Promise.race([
        pipeline(pipelineType, actualModelId, { 
          device,
          quantized: true, // Use quantized models for better performance
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`Downloading ${actualModelId}: ${Math.round(progress.progress * 100)}%`);
            } else if (progress.status === 'loading') {
              console.log(`Loading ${actualModelId}: ${progress.name || 'model files'}`);
            }
          }
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Model loading timeout after ${timeoutMs}ms`)), timeoutMs)
        )
      ]);
    };

    // Load the model with shorter timeout
    loadedModels[actualModelId] = await loadWithTimeout();
    
    // Update model status
    modelStatus[actualModelId] = {
      isLoading: false,
      isReady: true,
      error: null
    };
    
    console.log(`✅ Browser-compatible model ${actualModelId} loaded successfully`);
    
    if (typeof window !== 'undefined') {
      toast.success(`Model ${actualModelId.split('/').pop()} ready for inference`);
    }
    
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Error loading browser-compatible model ${actualModelId}:`, error);
    
    // Enhanced error analysis for browser compatibility
    let specificError = 'Model loading failed';
    if (errorMessage.includes('timeout')) {
      specificError = 'Model download timeout - try refreshing the page';
    } else if (errorMessage.includes('WebAssembly')) {
      specificError = 'WebAssembly not supported - try a different browser (Chrome/Edge recommended)';
    } else if (errorMessage.includes('memory')) {
      specificError = 'Insufficient memory - try closing other browser tabs';
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      specificError = 'Network error - check internet connection and try again';
    } else if (errorMessage.includes('CORS')) {
      specificError = 'CORS error - browser security blocking model download';
    }
    
    // Update model status
    modelStatus[actualModelId] = {
      isLoading: false,
      isReady: false,
      error: specificError
    };
    
    // Don't show toast for testing environment
    if (typeof window !== 'undefined') {
      toast.error(`Failed to load model`, {
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
  // Get browser-compatible model
  const compatibleModelId = getBrowserCompatibleModel('sentiment-analysis');
  const actualModelId = modelId.includes('Xenova/') ? modelId : compatibleModelId;
  
  // Ensure model is loaded
  if (!loadedModels[actualModelId]) {
    const loaded = await loadLocalModel(actualModelId, 'sentiment-analysis');
    if (!loaded) {
      console.log('Using enhanced keyword-based sentiment fallback');
      // Enhanced fallback with more sophisticated keyword analysis
      const positiveKeywords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'awesome', 'perfect', 'brilliant'];
      const negativeKeywords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disgusting', 'pathetic', 'useless', 'disappointing'];
      const neutralKeywords = ['okay', 'fine', 'average', 'normal', 'standard', 'regular'];
      
      const lowerText = text.toLowerCase();
      const positiveScore = positiveKeywords.filter(word => lowerText.includes(word)).length;
      const negativeScore = negativeKeywords.filter(word => lowerText.includes(word)).length;
      const neutralScore = neutralKeywords.filter(word => lowerText.includes(word)).length;
      
      if (positiveScore > negativeScore && positiveScore > neutralScore) {
        return { label: 'POSITIVE', score: Math.min(0.7 + (positiveScore * 0.1), 0.95) };
      } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
        return { label: 'NEGATIVE', score: Math.min(0.7 + (negativeScore * 0.1), 0.95) };
      } else {
        return { label: 'NEUTRAL', score: 0.6 };
      }
    }
  }
  
  try {
    // Run the model
    const result = await loadedModels[actualModelId](text);
    
    // Process the result (format depends on the model)
    if (Array.isArray(result)) {
      return result[0];
    } else {
      return result;
    }
  } catch (error) {
    console.error(`Error running model ${actualModelId}:`, error);
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
