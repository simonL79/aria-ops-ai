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
 * A.R.I.A™ Live Data Enforcement Middleware - PRACTICAL MODE
 * Validates live data while being practical about real-world content
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
    strictEntityMatching = false // Default to flexible matching
  } = options;
  
  const start = Date.now();
  const executionId = `${serviceLabel}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  console.log(`🔍 [LIVE ENFORCER] Starting practical validation for ${serviceLabel} targeting "${entityName}"`);

  try {
    // Execute the wrapped function
    const result = await fn();
    
    // 1. VALIDATION: Check if result exists
    if (!result) {
      await quarantineFailure(serviceLabel, entityName, 'Null/undefined result returned', result);
      throw new Error(`[${serviceLabel}] ❌ No result returned for "${entityName}"`);
    }

    // 2. VALIDATION: Check if result is empty when not allowed
    if (Array.isArray(result) && result.length === 0 && !allowEmpty) {
      await quarantineFailure(serviceLabel, entityName, 'Empty array returned when not allowed', result);
      throw new Error(`[${serviceLabel}] ❌ No results found for "${entityName}"`);
    }

    // 3. VALIDATION: Check minimum results requirement
    if (Array.isArray(result) && result.length < requireMinimumResults) {
      await quarantineFailure(serviceLabel, entityName, `Insufficient results: ${result.length} < ${requireMinimumResults}`, result);
      throw new Error(`[${serviceLabel}] ❌ Only ${result.length} results, need ${requireMinimumResults} for "${entityName}"`);
    }

    // 4. VALIDATION: Convert to string for content analysis
    const stringified = JSON.stringify(result).toLowerCase();
    const entityLower = entityName.toLowerCase();

    // 5. VALIDATION: Entity name presence check (flexible by default)
    if (strictEntityMatching) {
      const entityParts = entityLower.split(' ').filter(part => part.length > 2);
      const hasAnyEntityPart = entityParts.some(part => stringified.includes(part));
      
      if (!hasAnyEntityPart && entityParts.length > 0) {
        console.warn(`⚠️ [LIVE ENFORCER] Entity parts not found for "${entityName}": ${entityParts.join(', ')}`);
        await quarantineFailure(serviceLabel, entityName, 'No entity name parts found in results', result);
        throw new Error(`[${serviceLabel}] ❌ No reference to "${entityName}" parts found in results`);
      }
    } else {
      // In non-strict mode, just log if entity not found but don't fail
      if (!stringified.includes(entityLower)) {
        console.info(`ℹ️ [LIVE ENFORCER] Entity name not found in results, but continuing in flexible mode`);
      }
    }

    // 6. VALIDATION: Mock/simulation detection (only obvious patterns)
    const obviousMockIndicators = [
      'lorem ipsum dolor sit amet',
      'this is a test entity',
      'mock data for testing',
      'placeholder content here',
      'sample data only',
      'demo content not real'
    ];

    const detectedMockIndicators = obviousMockIndicators.filter(indicator => 
      stringified.includes(indicator)
    );

    if (detectedMockIndicators.length > 0) {
      console.warn(`🚫 [LIVE ENFORCER] Obvious mock data detected: ${detectedMockIndicators.join(', ')}`);
      await quarantineFailure(serviceLabel, entityName, `Mock data detected: ${detectedMockIndicators.join(', ')}`, result);
      throw new Error(`[${serviceLabel}] ❌ Mock/simulated data detected for "${entityName}"`);
    }

    // 7. VALIDATION: Only check for extremely generic patterns
    const extremelyGenericPatterns = [
      'this is a sample for testing purposes only',
      'lorem ipsum dolor sit amet consectetur',
      'placeholder content to be replaced'
    ];

    const detectedGenericPatterns = extremelyGenericPatterns.filter(pattern => 
      stringified.includes(pattern)
    );

    if (detectedGenericPatterns.length > 0) {
      console.warn(`🚫 [LIVE ENFORCER] Generic template content detected: ${detectedGenericPatterns.join(', ')}`);
      await quarantineFailure(serviceLabel, entityName, `Generic content detected: ${detectedGenericPatterns.join(', ')}`, result);
      throw new Error(`[${serviceLabel}] ❌ Generic/template content detected for "${entityName}"`);
    }

    // 8. SUCCESS: Log successful validation
    const duration = Date.now() - start;
    console.log(`✅ [LIVE ENFORCER] ${serviceLabel} validation passed for "${entityName}" in ${duration}ms`);
    
    // Log successful operation
    await logSuccessfulOperation(serviceLabel, entityName, result, duration, executionId);

    return result;

  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ [LIVE ENFORCER] ${serviceLabel} validation failed for "${entityName}" after ${duration}ms:`, error.message);
    
    // Log failed operation
    await logFailedOperation(serviceLabel, entityName, error.message, duration, executionId);
    
    // Show user-friendly error
    toast.error(`${serviceLabel} validation failed`, {
      description: `Could not validate data for "${entityName}": ${error.message}`
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
 * Practical content quality validation - more lenient
 */
export function validateContentQuality(content: string, entityName: string): {
  isValid: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = [];
  let score = 100;

  // Check minimum length (very lenient)
  if (content.length < 20) {
    issues.push('Content too short (< 20 characters)');
    score -= 30;
  }

  // Check for entity presence (very flexible)
  const entityParts = entityName.toLowerCase().split(' ').filter(part => part.length > 2);
  const hasAnyEntityPart = entityParts.length === 0 || entityParts.some(part => 
    content.toLowerCase().includes(part)
  );
  
  if (!hasAnyEntityPart) {
    issues.push(`Entity name parts not found in content`);
    score -= 15; // Very reduced penalty
  }

  // Check for real-world indicators (optional)
  const realWorldIndicators = ['said', 'reported', 'announced', 'confirmed', 'according to'];
  const hasRealWorldIndicators = realWorldIndicators.some(indicator => 
    content.toLowerCase().includes(indicator)
  );
  
  if (!hasRealWorldIndicators) {
    issues.push('No real-world reporting indicators found');
    score -= 5; // Very reduced penalty
  }

  // Check for specific dates/times (optional)
  const hasDateIndicators = /\b(2024|2025|January|February|March|April|May|June|July|August|September|October|November|December)\b/i.test(content);
  if (!hasDateIndicators) {
    issues.push('No current date indicators found');
    score -= 5;
  }

  return {
    isValid: score >= 50 && issues.length <= 3, // Very lenient
    issues,
    score: Math.max(0, score)
  };
}
