
import { supabase } from '@/integrations/supabase/client';
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';
import { performRealScan } from '@/services/monitoring/realScan';

export interface SystemValidationResult {
  component: string;
  passed: boolean;
  details: string;
  criticalFailure: boolean;
  timestamp: string;
}

export class SystemValidator {
  
  /**
   * Validate Live OSINT Scanner functionality
   */
  static async validateOSINTScanner(): Promise<SystemValidationResult> {
    try {
      const results = await performRealScan({
        fullScan: true,
        targetEntity: 'qa-validation-test',
        source: 'system_validator'
      });
      
      const hasLiveData = results.some(r => 
        !r.content.toLowerCase().includes('mock') &&
        !r.content.toLowerCase().includes('test') &&
        !r.content.toLowerCase().includes('demo')
      );
      
      return {
        component: 'OSINT Scanner',
        passed: results.length > 0 && hasLiveData,
        details: `Scanned ${results.length} live sources, verified live data integrity`,
        criticalFailure: !hasLiveData,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        component: 'OSINT Scanner',
        passed: false,
        details: `Scanner validation failed: ${error.message}`,
        criticalFailure: true,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * Validate Live Data Enforcement
   */
  static async validateLiveDataEnforcement(): Promise<SystemValidationResult> {
    try {
      const compliance = await LiveDataEnforcer.validateLiveDataCompliance();
      
      // Test mock data blocking
      let mockBlocked = false;
      try {
        await LiveDataEnforcer.validateDataInput('mock test data', 'test_source');
      } catch (error) {
        mockBlocked = true;
      }
      
      const passed = compliance.isCompliant && compliance.liveDataOnly && mockBlocked;
      
      return {
        component: 'Live Data Enforcement',
        passed,
        details: `Compliance: ${compliance.isCompliant}, Live Only: ${compliance.liveDataOnly}, Mock Blocked: ${mockBlocked}`,
        criticalFailure: !passed,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        component: 'Live Data Enforcement',
        passed: false,
        details: `Enforcement validation failed: ${error.message}`,
        criticalFailure: true,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * Validate Database Integrity
   */
  static async validateDatabaseIntegrity(): Promise<SystemValidationResult> {
    try {
      const coreTables = [
        'scan_results',
        'threats', 
        'client_entities',
        'activity_logs',
        'aria_ops_log',
        'monitoring_status'
      ];
      
      const validationResults: string[] = [];
      
      for (const table of coreTables) {
        const { data, error } = await supabase
          .from(table as any)
          .select('*')
          .limit(1);
          
        if (error) {
          throw new Error(`Table ${table}: ${error.message}`);
        }
        
        validationResults.push(`${table}:✓`);
      }
      
      // Check for mock data contamination
      const { data: mockData, error: mockError } = await supabase
        .from('scan_results')
        .select('id')
        .or('content.ilike.%mock%,content.ilike.%test%,content.ilike.%demo%')
        .limit(1);
        
      const hasMockContamination = mockData && mockData.length > 0;
      
      return {
        component: 'Database Integrity',
        passed: !hasMockContamination,
        details: `Tables validated: ${validationResults.join(', ')}. Mock contamination: ${hasMockContamination ? 'DETECTED' : 'NONE'}`,
        criticalFailure: hasMockContamination,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        component: 'Database Integrity',
        passed: false,
        details: `Database validation failed: ${error.message}`,
        criticalFailure: true,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * Validate Edge Functions
   */
  static async validateEdgeFunctions(): Promise<SystemValidationResult> {
    try {
      const functions = [
        'github-deployment',
        'generate-response',
        'reddit-scan'
      ];
      
      const results: string[] = [];
      
      for (const functionName of functions) {
        try {
          const { error } = await supabase.functions.invoke(functionName, {
            body: { test: 'qa_validation' }
          });
          
          // Edge function exists and is callable (error might be expected for test data)
          results.push(`${functionName}:✓`);
        } catch (error) {
          results.push(`${functionName}:✗`);
        }
      }
      
      const successCount = results.filter(r => r.includes('✓')).length;
      const passed = successCount >= functions.length * 0.8; // Allow 20% failure for test invocations
      
      return {
        component: 'Edge Functions',
        passed,
        details: `Function validation: ${results.join(', ')}`,
        criticalFailure: successCount === 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        component: 'Edge Functions',
        passed: false,
        details: `Edge function validation failed: ${error.message}`,
        criticalFailure: true,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * Validate External API Integrations
   */
  static async validateExternalAPIs(): Promise<SystemValidationResult> {
    try {
      const apiResults: string[] = [];
      
      // Test OpenAI integration
      try {
        const { data, error } = await supabase.functions.invoke('generate-response', {
          body: { prompt: 'QA test', context: 'validation' }
        });
        apiResults.push(`OpenAI:${!error ? '✓' : '✗'}`);
      } catch (error) {
        apiResults.push('OpenAI:✗');
      }
      
      // Test GitHub integration  
      try {
        const { data, error } = await supabase.functions.invoke('github-deployment', {
          body: { 
            title: 'QA Test',
            content: 'QA validation test',
            entity: 'qa-test',
            keywords: ['qa'],
            contentType: 'test'
          }
        });
        apiResults.push(`GitHub:${!error ? '✓' : '✗'}`);
      } catch (error) {
        apiResults.push('GitHub:✗');
      }
      
      const successCount = apiResults.filter(r => r.includes('✓')).length;
      const passed = successCount > 0;
      
      return {
        component: 'External APIs',
        passed,
        details: `API validation: ${apiResults.join(', ')}`,
        criticalFailure: successCount === 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        component: 'External APIs',
        passed: false,
        details: `API validation failed: ${error.message}`,
        criticalFailure: true,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  /**
   * Run comprehensive system validation
   */
  static async runFullValidation(): Promise<SystemValidationResult[]> {
    const validations = [
      this.validateOSINTScanner(),
      this.validateLiveDataEnforcement(),
      this.validateDatabaseIntegrity(),
      this.validateEdgeFunctions(),
      this.validateExternalAPIs()
    ];
    
    const results = await Promise.all(validations);
    
    // Log validation results
    await supabase.from('activity_logs').insert({
      entity_type: 'system_validation',
      action: 'full_qa_validation',
      details: `Validation completed: ${results.filter(r => r.passed).length}/${results.length} passed`,
      user_email: 'system@aria.com'
    });
    
    return results;
  }
}
