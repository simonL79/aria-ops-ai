
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
 * Load a sentiment classification model in the browser
 */
export const loadRiskClassifier = async (modelId: string = 'distilbert-base-uncased-finetuned-sst-2-english'): Promise<boolean> => {
  if (loadedClassifiers[modelId]) {
    return true;
  }
  
  try {
    toast.info('Loading risk classification model...', {
      description: 'This may take a moment the first time'
    });
    
    console.log(`Loading classification model ${modelId}...`);
    
    // Determine device to use (prefer WebGPU if available)
    const device = 'webgpu'; // This will fall back to 'cpu' if WebGPU is not available
    
    // Load the model
    loadedClassifiers[modelId] = await pipeline(
      'text-classification' as any, 
      modelId, 
      { device }
    );
    
    console.log(`Model ${modelId} loaded successfully`);
    toast.success('Risk classification model ready');
    return true;
  } catch (error) {
    console.error(`Error loading model ${modelId}:`, error);
    toast.error(`Failed to load risk classification model`, {
      description: error instanceof Error ? error.message : 'Unknown error'
    });
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
      throw new Error(`Model ${modelId} failed to load`);
    }
  }
  
  try {
    // Run the model
    const result = await loadedClassifiers[modelId](text);
    console.log('Classification result:', result);
    
    // Process the result
    const label = result[0].label;
    const score = result[0].score;
    
    // Custom logic: treat "NEGATIVE" as potential risk
    if (label === 'NEGATIVE' && score > 0.7) {
      return {
        risk: 'Medium-High',
        confidence: score,
        summary: `Flagged as negative with ${Math.round(score * 100)}% confidence`
      };
    }
    
    return {
      risk: score > 0.8 ? 'Low' : 'Medium',
      confidence: score,
      summary: `No major risk detected (${label})`
    };
  } catch (error) {
    console.error(`Error running risk classification:`, error);
    throw error;
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
        risk: 'Low',
        confidence: 0,
        summary: 'Error during classification'
      });
    }
  }
  return results;
};
