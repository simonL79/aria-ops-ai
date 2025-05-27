
import { toast } from 'sonner';
import { QATestSuite, QATestResult } from './types';
import { Phase1DataIntegrity } from './phases/Phase1DataIntegrity';
import { Phase2CoreSystems } from './phases/Phase2CoreSystems';
import { Phase3Scanning } from './phases/Phase3Scanning';
import { Phase4ClientManagement } from './phases/Phase4ClientManagement';
import { Phase5Security } from './phases/Phase5Security';
import { Phase6EdgeFunctions } from './phases/Phase6EdgeFunctions';
import { Phase7DataProtection } from './phases/Phase7DataProtection';
import { Phase8RealTimeOps } from './phases/Phase8RealTimeOps';

export class QATestRunner {
  private results: QATestResult[] = [];

  async runFullQASuite(): Promise<QATestSuite> {
    const startTime = Date.now();
    this.results = [];

    console.log('🧪 Starting ARIA™ NOC QA Master Suite...');

    // Initialize all test phases
    const phases = [
      new Phase1DataIntegrity(),
      new Phase2CoreSystems(),
      new Phase3Scanning(),
      new Phase4ClientManagement(),
      new Phase5Security(),
      new Phase6EdgeFunctions(),
      new Phase7DataProtection(),
      new Phase8RealTimeOps()
    ];

    // Run all phases sequentially
    for (const phase of phases) {
      try {
        const phaseResults = await phase.runTests();
        this.results.push(...phaseResults);
      } catch (error) {
        console.error(`Phase failed:`, error);
      }
    }

    // Add final performance test
    this.addFinalPerformanceTest();

    const duration = Date.now() - startTime;
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'pass').length;
    const failedTests = this.results.filter(r => r.status === 'fail').length;
    const warningTests = this.results.filter(r => r.status === 'warning').length;

    // Calculate GDPR compliance metrics
    const gdprTests = this.results.filter(r => r.gdprCompliant !== undefined);
    const compliantTests = gdprTests.filter(r => r.gdprCompliant === true).length;
    const compliancePercentage = gdprTests.length > 0 ? Math.round((compliantTests / gdprTests.length) * 100) : 100;

    return {
      totalTests,
      passedTests,
      failedTests,
      warningTests,
      duration,
      results: this.results,
      gdprCompliance: {
        compliantTests,
        totalGdprTests: gdprTests.length,
        compliancePercentage
      }
    };
  }

  private addFinalPerformanceTest() {
    const totalPassedTests = this.results.filter(r => r.status === 'pass').length;
    const totalTests = this.results.length;
    const passRate = (totalPassedTests / totalTests) * 100;
    
    const phase = 'Phase 8: Real-time Operations';
    
    if (passRate >= 90) {
      this.addResult('System Performance Score', 'pass', `${passRate.toFixed(1)}% pass rate - Excellent`, phase, true, 'live');
    } else if (passRate >= 75) {
      this.addResult('System Performance Score', 'warning', `${passRate.toFixed(1)}% pass rate - Good, monitor warnings`, phase, true, 'live');
    } else {
      this.addResult('System Performance Score', 'fail', `${passRate.toFixed(1)}% pass rate - Critical issues need attention`, phase, false, 'live');
    }
  }

  private addResult(
    testName: string, 
    status: 'pass' | 'fail' | 'warning', 
    message: string, 
    phase: string,
    gdprCompliant?: boolean,
    dataSource?: 'live' | 'none'
  ) {
    this.results.push({
      testName,
      status,
      message,
      timestamp: new Date(),
      phase,
      gdprCompliant,
      dataSource
    });
  }
}

export const qaTestRunner = new QATestRunner();

// Re-export types for backward compatibility
export type { QATestResult, QATestSuite } from './types';
