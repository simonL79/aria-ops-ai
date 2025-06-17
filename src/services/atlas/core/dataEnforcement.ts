
/**
 * Atlas Data Enforcement - ZERO TOLERANCE for mock/fake/simulated data
 * The First and Only Rule: Real data only, always.
 */

export interface AtlasDataValidation {
  isValid: boolean;
  isRealData: boolean;
  source: string;
  timestamp: string;
  violations: string[];
}

export class AtlasDataEnforcer {
  private static readonly FORBIDDEN_INDICATORS = [
    'test', 'mock', 'demo', 'sample', 'example', 'placeholder',
    'fake', 'dummy', 'lorem', 'ipsum', 'temp', 'tmp'
  ];

  private static readonly FORBIDDEN_DOMAINS = [
    'example.com', 'test.com', 'mock.com', 'demo.com',
    'placeholder.com', 'fake.com', 'dummy.com'
  ];

  /**
   * Validate that data is real and not mock/simulated
   */
  static validateRealData(data: any, source: string): AtlasDataValidation {
    const violations: string[] = [];
    let isRealData = true;

    // Check for forbidden text indicators
    const textContent = JSON.stringify(data).toLowerCase();
    for (const indicator of this.FORBIDDEN_INDICATORS) {
      if (textContent.includes(indicator)) {
        violations.push(`Forbidden indicator detected: ${indicator}`);
        isRealData = false;
      }
    }

    // Check for forbidden domains in URLs
    if (data.url || data.source_url) {
      const url = (data.url || data.source_url).toLowerCase();
      for (const domain of this.FORBIDDEN_DOMAINS) {
        if (url.includes(domain)) {
          violations.push(`Forbidden domain detected: ${domain}`);
          isRealData = false;
        }
      }
    }

    // Check for suspicious patterns
    if (data.name && this.isSuspiciousName(data.name)) {
      violations.push('Suspicious test name pattern detected');
      isRealData = false;
    }

    return {
      isValid: isRealData,
      isRealData,
      source,
      timestamp: new Date().toISOString(),
      violations
    };
  }

  /**
   * Block any attempt to use mock data
   */
  static enforceRealDataOnly(data: any, source: string): void {
    const validation = this.validateRealData(data, source);
    
    if (!validation.isRealData) {
      const errorMsg = `ATLAS ENFORCEMENT: Mock data blocked from ${source}. Violations: ${validation.violations.join(', ')}`;
      console.error('🚫 ATLAS:', errorMsg);
      throw new Error(errorMsg);
    }
  }

  /**
   * Check if a name appears to be a test/mock name
   */
  private static isSuspiciousName(name: string): boolean {
    const lowerName = name.toLowerCase();
    
    // Common test name patterns
    const testPatterns = [
      /^test/,
      /demo.*user/,
      /^john.*doe$/,
      /^jane.*doe$/,
      /user.*\d+$/,
      /^admin$/,
      /^example/
    ];

    return testPatterns.some(pattern => pattern.test(lowerName));
  }

  /**
   * Verify URL is live and accessible
   */
  static async verifyLiveUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get real-time validation status
   */
  static getEnforcementStatus(): {
    active: boolean;
    mode: string;
    blockedAttempts: number;
  } {
    return {
      active: true,
      mode: 'ZERO_TOLERANCE',
      blockedAttempts: 0 // This would be tracked in a real implementation
    };
  }
}
