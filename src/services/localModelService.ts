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
 * Enhanced browser compatibility check for transformers
 */
const isTransformersSupported = (): boolean => {
  try {
    // Basic environment checks
    const hasWebAssembly = typeof WebAssembly !== 'undefined';
    const hasFetch = typeof fetch !== 'undefined';
    const hasWindow = typeof window !== 'undefined';
    
    // Test WebAssembly instantiation with a minimal module
    let wasmSupport = false;
    try {
      // Create a minimal valid WebAssembly module
      const wasmBinary = new Uint8Array([
        0x00, 0x61, 0x73, 0x6d, // WASM magic number
        0x01, 0x00, 0x00, 0x00  // WASM version
      ]);
      const wasmModule = new WebAssembly.Module(wasmBinary);
      wasmSupport = wasmModule instanceof WebAssembly.Module;
    } catch {
      wasmSupport = false;
    }
    
    // Check for SharedArrayBuffer (required for some models)
    const hasSharedArrayBuffer = typeof SharedArrayBuffer !== 'undefined';
    
    // Check browser user agent for known compatibility issues
    const userAgent = navigator.userAgent.toLowerCase();
    const isChrome = userAgent.includes('chrome');
    const isEdge = userAgent.includes('edge');
    const isFirefox = userAgent.includes('firefox');
    const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
    
    console.log('Enhanced browser compatibility check:', {
      hasWebAssembly,
      wasmSupport,
      hasFetch,
      hasWindow,
      hasSharedArrayBuffer,
      browser: { isChrome, isEdge, isFirefox, isSafari },
      userAgent: userAgent.substring(0, 50)
    });
    
    // Minimum requirements for transformers.js
    const basicSupport = hasWebAssembly && wasmSupport && hasFetch && hasWindow;
    
    // Warn about potential issues
    if (!hasSharedArrayBuffer) {
      console.warn('SharedArrayBuffer not available - some models may not work optimally');
    }
    
    if (isSafari) {
      console.warn('Safari detected - WebAssembly support may be limited');
    }
    
    return basicSupport;
  } catch (error) {
    console.error('Browser compatibility check failed:', error);
    return false;
  }
};

/**
 * Get the most compatible model for browser use - using smaller, quantized models
 */
const getBrowserCompatibleModel = (taskType: string): string => {
  switch (taskType) {
    case 'sentiment-analysis':
    case 'text-classification':
      // Use the smallest, most compatible models for sentiment analysis
      return 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
    case 'feature-extraction':
      return 'Xenova/all-MiniLM-L6-v2';
    case 'token-classification':
      return 'Xenova/bert-base-NER';
    default:
      return 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
  }
};

/**
 * Load a model from HuggingFace with aggressive timeout and fallback strategy
 */
export const loadLocalModel = async (modelId: string, taskType: string): Promise<boolean> => {
  if (!isTransformersSupported()) {
    console.warn('❌ Transformers not supported - missing WebAssembly or required browser features');
    return false;
  }

  // Always use the most compatible model regardless of input
  const actualModelId = getBrowserCompatibleModel(taskType);

  if (loadedModels[actualModelId]) {
    console.log('✅ Model already loaded:', actualModelId);
    return true;
  }
  
  // Initialize model status
  modelStatus[actualModelId] = {
    isLoading: true,
    isReady: false,
    error: null
  };
  
  try {
    console.log(`🤖 Loading ultra-compatible model ${actualModelId} for task ${taskType}...`);
    
    // Always use CPU for maximum compatibility
    const device = 'cpu';
    const pipelineType = taskType as PipelineType;
    
    // Very aggressive timeout strategy - if it doesn't load quickly, it won't work
    const quickLoadTimeout = 3000; // Only 3 seconds
    
    console.log(`⚡ Quick load attempt with ${quickLoadTimeout}ms timeout`);
    
    const modelPromise = pipeline(pipelineType, actualModelId, { 
      device,
      progress_callback: (progress: any) => {
        if (progress.status === 'downloading') {
          console.log(`📥 Downloading ${actualModelId}: ${Math.round(progress.progress * 100)}%`);
        } else if (progress.status === 'loading') {
          console.log(`⚙️ Loading ${actualModelId}: ${progress.name || 'model files'}`);
        } else if (progress.status === 'ready') {
          console.log(`🎯 Model ${actualModelId} ready for inference`);
        }
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Quick load timeout after ${quickLoadTimeout}ms - browser may not support HuggingFace models`)), quickLoadTimeout)
    );

    // Try to load the model with aggressive timeout
    loadedModels[actualModelId] = await Promise.race([modelPromise, timeoutPromise]);
    
    // Update model status
    modelStatus[actualModelId] = {
      isLoading: false,
      isReady: true,
      error: null
    };
    
    console.log(`✅ Ultra-compatible model ${actualModelId} loaded successfully in under ${quickLoadTimeout}ms`);
    
    if (typeof window !== 'undefined') {
      toast.success(`🧠 AI Model Ready`, {
        description: `${actualModelId.split('/').pop()} loaded successfully`
      });
    }
    
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`❌ Model loading failed for ${actualModelId}:`, error);
    
    // Enhanced error analysis with specific browser guidance
    let specificError = 'Model loading failed - using fallback mode';
    if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      specificError = 'Model download timeout - HuggingFace models may not work in this browser. Using keyword-based fallback.';
    } else if (errorMessage.includes('WebAssembly') || errorMessage.includes('wasm')) {
      specificError = 'WebAssembly not supported - try Chrome/Edge with WebAssembly enabled. Using fallback mode.';
    } else if (errorMessage.includes('memory') || errorMessage.includes('Memory')) {
      specificError = 'Insufficient memory - close other tabs. Using fallback mode.';
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      specificError = 'Network error - check connection. Using fallback mode.';
    } else if (errorMessage.includes('CORS')) {
      specificError = 'CORS error - browser security blocking model. Using fallback mode.';
    } else if (errorMessage.includes('quota') || errorMessage.includes('storage')) {
      specificError = 'Storage quota exceeded - clear browser data. Using fallback mode.';
    }
    
    // Update model status
    modelStatus[actualModelId] = {
      isLoading: false,
      isReady: false,
      error: specificError
    };
    
    // Show informative toast but don't make it an error since fallback works
    if (typeof window !== 'undefined') {
      toast.info(`🔄 Using Fallback AI`, {
        description: specificError,
        duration: 5000
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
 * Run sentiment analysis with enhanced fallback
 */
export const analyzeSentiment = async (modelId: string, text: string): Promise<PredictionResult> => {
  // Always use the most compatible model
  const actualModelId = getBrowserCompatibleModel('sentiment-analysis');
  
  // Ensure model is loaded
  if (!loadedModels[actualModelId]) {
    const loaded = await loadLocalModel(actualModelId, 'sentiment-analysis');
    if (!loaded) {
      console.log('🔄 Using enhanced keyword-based sentiment fallback');
      
      // Enhanced fallback with more sophisticated analysis
      const positiveKeywords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'awesome', 'perfect', 'brilliant', 'outstanding', 'superb'];
      const negativeKeywords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disgusting', 'pathetic', 'useless', 'disappointing', 'dreadful', 'appalling'];
      const neutralKeywords = ['okay', 'fine', 'average', 'normal', 'standard', 'regular', 'acceptable', 'moderate'];
      
      const lowerText = text.toLowerCase();
      const words = lowerText.split(/\s+/);
      
      const positiveScore = positiveKeywords.filter(word => lowerText.includes(word)).length;
      const negativeScore = negativeKeywords.filter(word => lowerText.includes(word)).length;
      const neutralScore = neutralKeywords.filter(word => lowerText.includes(word)).length;
      
      // Consider text length and complexity
      const textLength = words.length;
      const complexityBonus = textLength > 10 ? 0.1 : 0;
      
      if (positiveScore > negativeScore && positiveScore > neutralScore) {
        return { 
          label: 'POSITIVE', 
          score: Math.min(0.7 + (positiveScore * 0.1) + complexityBonus, 0.95) 
        };
      } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
        return { 
          label: 'NEGATIVE', 
          score: Math.min(0.7 + (negativeScore * 0.1) + complexityBonus, 0.95) 
        };
      } else {
        return { label: 'NEUTRAL', score: 0.6 + complexityBonus };
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
