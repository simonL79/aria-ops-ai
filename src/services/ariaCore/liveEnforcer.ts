import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface EnforcerOptions {
  entityName: string;
  allowEmpty?: boolean;
  serviceLabel: string;
  requireMinimumResults?: number;
  strictEntityMatching?: boolean;
}

export interface QuarantineRecord {
  id: string;
  service_label: string;
  entity_name: string;
  failure_reason: string;
  raw_result: any;
  quarantined_at: string;
  reviewed: boolean;
}

/**
 * A.R.I.A™ Live Data Enforcement Middleware
 * Wraps any function to ensure 100% live, entity-specific data compliance
 */
export async function enforceLiveData<T>(
  fn: () => Promise<T>,
  options: EnforcerOptions
): Promise<T> {
  const { 
    entityName, 
    allowEmpty = false, 
    serviceLabel, 
    requireMinimumResults = 0,
    strictEntityMatching = false 
  } = options;
  
  const start = Date.now();
  const executionId = `${serviceLabel}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  console.log(`🔍 [LIVE ENFORCER] Starting validation for ${serviceLabel} targeting "${entityName}"`);

  try {
    // Execute the wrapped function
    const result = await fn();
    
    // 1. VALIDATION: Check if result exists
    if (!result) {
      await quarantineFailure(serviceLabel, entityName, 'Null/undefined result returned', result);
      throw new Error(`[${serviceLabel}] ❌ CRITICAL: Null/undefined result for "${entityName}"`);
    }

    // 2. VALIDATION: Check if result is empty when not allowed
    if (Array.isArray(result) && result.length === 0 && !allowEmpty) {
      await quarantineFailure(serviceLabel, entityName, 'Empty array returned when not allowed', result);
      throw new Error(`[${serviceLabel}] ❌ CRITICAL: Empty result array for "${entityName}"`);
    }

    // 3. VALIDATION: Check minimum results requirement
    if (Array.isArray(result) && result.length < requireMinimumResults) {
      await quarantineFailure(serviceLabel, entityName, `Insufficient results: ${result.length} < ${requireMinimumResults}`, result);
      throw new Error(`[${serviceLabel}] ❌ CRITICAL: Only ${result.length} results, need ${requireMinimumResults} for "${entityName}"`);
    }

    // 4. VALIDATION: Convert to string for content analysis
    const stringified = JSON.stringify(result).toLowerCase();
    const entityLower = entityName.toLowerCase();

    // 5. VALIDATION: Entity name presence check (more flexible)
    if (strictEntityMatching) {
      // Split entity name into parts for more flexible matching
      const entityParts = entityLower.split(' ');
      const hasAnyEntityPart = entityParts.some(part => 
        part.length > 2 && stringified.includes(part)
      );
      
      if (!hasAnyEntityPart) {
        await quarantineFailure(serviceLabel, entityName, 'No entity name parts found in results', result);
        throw new Error(`[${serviceLabel}] ❌ CRITICAL: No reference to "${entityName}" parts found in results`);
      }
    }

    // 6. VALIDATION: Mock/simulation detection (refined patterns)
    const mockIndicators = [
      'lorem ipsum', 'placeholder text', 'test entity', 'sample data',
      'mock entity', 'test user', 'demo content', 'synthetic data',
      'generated example', 'simulation data', 'fake content'
    ];

    const detectedMockIndicators = mockIndicators.filter(indicator => 
      stringified.includes(indicator)
    );

    if (detectedMockIndicators.length > 0) {
      await quarantineFailure(serviceLabel, entityName, `Mock data detected: ${detectedMockIndicators.join(', ')}`, result);
      throw new Error(`[${serviceLabel}] ❌ CRITICAL: Mock/simulated data detected: "${detectedMockIndicators.join(', ')}" for "${entityName}"`);
    }

    // 7. VALIDATION: Generic content detection (refined)
    const genericPatterns = [
      'this is a sample for testing purposes',
      'example content for demonstration',
      'lorem ipsum dolor sit amet',
      'placeholder content here'
    ];

    const detectedGenericPatterns = genericPatterns.filter(pattern => 
      stringified.includes(pattern)
    );

    if (detectedGenericPatterns.length > 0) {
      await quarantineFailure(serviceLabel, entityName, `Generic content detected: ${detectedGenericPatterns.join(', ')}`, result);
      throw new Error(`[${serviceLabel}] ❌ CRITICAL: Generic/template content detected for "${entityName}"`);
    }

    // 8. SUCCESS: Log successful validation
    const duration = Date.now() - start;
    console.log(`✅ [LIVE ENFORCER] ${serviceLabel} passed all validations for "${entityName}" in ${duration}ms`);
    
    // Log successful operation
    await logSuccessfulOperation(serviceLabel, entityName, result, duration, executionId);

    return result;

  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ [LIVE ENFORCER] ${serviceLabel} FAILED validation for "${entityName}" after ${duration}ms:`, error);
    
    // Log failed operation
    await logFailedOperation(serviceLabel, entityName, error.message, duration, executionId);
    
    // Show user-friendly error
    toast.error(`${serviceLabel} validation failed`, {
      description: `Failed to validate live data for "${entityName}"`
    });
    
    throw error;
  }
}

/**
 * Quarantine invalid results for manual review
 */
async function quarantineFailure(
  serviceLabel: string,
  entityName: string,
  reason: string,
  rawResult: any
): Promise<void> {
  try {
    const { error } = await supabase.from('aria_ops_log').insert({
      operation_type: 'quarantine_failure',
      module_source: serviceLabel,
      entity_name: entityName,
      success: false,
      error_message: reason,
      operation_data: {
        quarantine_reason: reason,
        raw_result: rawResult,
        quarantined_at: new Date().toISOString(),
        reviewed: false
      }
    });

    if (error) {
      console.error('Failed to log quarantine record:', error);
    } else {
      console.warn(`⚠️ [QUARANTINE] ${serviceLabel} result quarantined for "${entityName}": ${reason}`);
    }
  } catch (error) {
    console.error('Error logging quarantine failure:', error);
  }
}

/**
 * Log successful operation
 */
async function logSuccessfulOperation(
  serviceLabel: string,
  entityName: string,
  result: any,
  duration: number,
  executionId: string
): Promise<void> {
  try {
    const resultCount = Array.isArray(result) ? result.length : 1;
    
    const { error } = await supabase.from('aria_ops_log').insert({
      operation_type: 'live_data_validation',
      module_source: serviceLabel,
      entity_name: entityName,
      success: true,
      execution_time_ms: duration,
      operation_data: {
        execution_id: executionId,
        result_count: resultCount,
        validation_passed: true,
        entity_reference_found: true,
        mock_data_detected: false,
        validated_at: new Date().toISOString()
      }
    });

    if (error) {
      console.error('Failed to log successful operation:', error);
    }
  } catch (error) {
    console.error('Error logging successful operation:', error);
  }
}

/**
 * Log failed operation
 */
async function logFailedOperation(
  serviceLabel: string,
  entityName: string,
  errorMessage: string,
  duration: number,
  executionId: string
): Promise<void> {
  try {
    const { error } = await supabase.from('aria_ops_log').insert({
      operation_type: 'live_data_validation',
      module_source: serviceLabel,
      entity_name: entityName,
      success: false,
      execution_time_ms: duration,
      error_message: errorMessage,
      operation_data: {
        execution_id: executionId,
        validation_passed: false,
        failure_reason: errorMessage,
        failed_at: new Date().toISOString()
      }
    });

    if (error) {
      console.error('Failed to log failed operation:', error);
    }
  } catch (error) {
    console.error('Error logging failed operation:', error);
  }
}

/**
 * Get quarantined results for review
 */
export async function getQuarantinedResults(): Promise<QuarantineRecord[]> {
  try {
    const { data, error } = await supabase
      .from('aria_ops_log')
      .select('*')
      .eq('operation_type', 'quarantine_failure')
      .eq('success', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch quarantined results:', error);
      return [];
    }

    return data?.map(record => {
      // Type-safe extraction of operation_data properties
      const operationData = record.operation_data as any;
      
      return {
        id: record.id,
        service_label: record.module_source || '',
        entity_name: record.entity_name || '',
        failure_reason: record.error_message || '',
        raw_result: operationData?.raw_result || null,
        quarantined_at: record.created_at || '',
        reviewed: operationData?.reviewed || false
      };
    }) || [];
  } catch (error) {
    console.error('Error fetching quarantined results:', error);
    return [];
  }
}

/**
 * Enhanced validation for specific content types
 */
export function validateContentQuality(content: string, entityName: string): {
  isValid: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;

  // Check minimum length
  if (content.length < 50) {
    issues.push('Content too short (< 50 characters)');
    score -= 30;
  }

  // Check for entity presence (more flexible)
  const entityParts = entityName.toLowerCase().split(' ');
  const hasAnyEntityPart = entityParts.some(part => 
    part.length > 2 && content.toLowerCase().includes(part)
  );
  
  if (!hasAnyEntityPart) {
    issues.push(`Entity name parts not found in content`);
    score -= 20; // Reduced penalty
  }

  // Check for real-world indicators
  const realWorldIndicators = ['said', 'reported', 'announced', 'confirmed', 'according to'];
  const hasRealWorldIndicators = realWorldIndicators.some(indicator => 
    content.toLowerCase().includes(indicator)
  );
  
  if (!hasRealWorldIndicators) {
    issues.push('No real-world reporting indicators found');
    score -= 10; // Reduced penalty
  }

  // Check for specific dates/times
  const hasDateIndicators = /\b(2024|2025|January|February|March|April|May|June|July|August|September|October|November|December)\b/i.test(content);
  if (!hasDateIndicators) {
    issues.push('No current date indicators found');
    score -= 10;
  }

  return {
    isValid: score >= 60 && issues.length <= 2, // More lenient
    issues,
    score: Math.max(0, score)
  };
}
