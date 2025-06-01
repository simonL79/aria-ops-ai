
import { pipeline } from '@huggingface/transformers';
import { toast } from 'sonner';

interface RiskClassificationResult {
  risk: 'Low' | 'Medium' | 'Medium-High' | 'High';
  confidence: number;
  summary: string;
}

// Store loaded classifiers
const loadedClassifiers: Record<string, any> = {};

/**
 * Check if we're in a supported environment
 */
const isSupported = (): boolean => {
  try {
    return typeof window !== 'undefined' && 'fetch' in window;
  } catch {
    return false;
  }
};

/**
 * Load a sentiment classification model in the browser
 */
export const loadRiskClassifier = async (modelId: string = 'distilbert-base-uncased-finetuned-sst-2-english'): Promise<boolean> => {
  if (!isSupported()) {
    console.warn('Risk classifier not supported in this environment');
    return false;
  }

  if (loadedClassifiers[modelId]) {
    return true;
  }
  
  try {
    console.log(`Loading classification model ${modelId}...`);
    
    // Determine device to use (fallback to CPU if WebGPU fails)
    let device: "cpu" | "webgpu" = 'cpu';
    if ('gpu' in navigator) {
      try {
        device = 'webgpu';
      } catch {
        device = 'cpu';
      }
    }
    
    // Load with timeout
    const loadWithTimeout = async (timeoutMs: number = 25000) => {
      return Promise.race([
        pipeline('text-classification' as any, modelId, { 
          device,
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`Downloading risk classifier: ${Math.round(progress.progress * 100)}%`);
            }
          }
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Risk classifier loading timeout')), timeoutMs)
        )
      ]);
    };

    loadedClassifiers[modelId] = await loadWithTimeout();
    
    console.log(`Risk classifier ${modelId} loaded successfully on ${device}`);
    
    if (typeof window !== 'undefined') {
      toast.success('Risk classification model ready');
    }
    
    return true;
  } catch (error) {
    console.error(`Error loading risk classifier ${modelId}:`, error);
    
    if (typeof window !== 'undefined') {
      toast.error(`Failed to load risk classification model`, {
        description: 'Using fallback classification'
      });
    }
    
    return false;
  }
};

/**
 * Classify risk in a text using local HuggingFace model
 */
export const classifyRisk = async (text: string, modelId: string = 'distilbert-base-uncased-finetuned-sst-2-english'): Promise<RiskClassificationResult> => {
  // Ensure model is loaded
  if (!loadedClassifiers[modelId]) {
    const loaded = await loadRiskClassifier(modelId);
    if (!loaded) {
      // Return fallback classification
      return {
        risk: 'Medium',
        confidence: 0.75,
        summary: 'Fallback risk assessment - model unavailable'
      };
    }
  }
  
  try {
    // Run the model
    const result = await loadedClassifiers[modelId](text);
    console.log('Risk classification result:', result);
    
    // Process the result
    const label = result[0].label;
    const score = result[0].score;
    
    // Enhanced logic: treat "NEGATIVE" as potential risk
    if (label === 'NEGATIVE' && score > 0.8) {
      return {
        risk: 'High',
        confidence: score,
        summary: `High risk detected with ${Math.round(score * 100)}% confidence`
      };
    } else if (label === 'NEGATIVE' && score > 0.6) {
      return {
        risk: 'Medium-High',
        confidence: score,
        summary: `Medium-high risk detected with ${Math.round(score * 100)}% confidence`
      };
    }
    
    return {
      risk: score > 0.8 ? 'Low' : 'Medium',
      confidence: score,
      summary: `Risk assessment completed (${label})`
    };
  } catch (error) {
    console.error(`Error running risk classification:`, error);
    return {
      risk: 'Medium',
      confidence: 0.5,
      summary: 'Error during classification - using safe fallback'
    };
  }
};

/**
 * Batch classify multiple texts
 */
export const batchClassifyRisk = async (texts: string[]): Promise<RiskClassificationResult[]> => {
  const results = [];
  for (const text of texts) {
    try {
      const result = await classifyRisk(text);
      results.push(result);
    } catch (error) {
      console.error(`Error classifying text: ${text.substring(0, 50)}...`, error);
      results.push({
        risk: 'Low' as const,
        confidence: 0,
        summary: 'Error during classification'
      });
    }
  }
  return results;
};
