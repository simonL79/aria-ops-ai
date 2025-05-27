
import { BaseTestPhase } from './BaseTestPhase';
import { QATestResult } from '../types';

export class Phase2CoreSystems extends BaseTestPhase {
  async runTests(): Promise<QATestResult[]> {
    this.results = [];
    const phase = 'Phase 2: Core System Functions';
    
    // Test 2.1: Scan Results Table
    try {
      const { count, error } = await this.getSupabase()
        .from('scan_results')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      this.addResult('Scan Results Storage', 'pass', `Scan results table accessible with ${count || 0} records`, phase, true, 'live');
    } catch (error: any) {
      this.addResult('Scan Results Storage', 'fail', `Scan results check failed: ${error.message}`, phase, true, 'none');
    }

    // Test 2.2: Client Management
    try {
      const { count, error } = await this.getSupabase()
        .from('clients')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      this.addResult('Client Management System', 'pass', `Client system operational with ${count || 0} clients`, phase, true, 'live');
    } catch (error: any) {
      this.addResult('Client Management System', 'fail', `Client system check failed: ${error.message}`, phase, true, 'none');
    }

    // Test 2.3: Prospect Intelligence
    try {
      const { count, error } = await this.getSupabase()
        .from('prospect_entities')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      this.addResult('Prospect Intelligence', 'pass', `Prospect system operational with ${count || 0} prospects`, phase, true, 'live');
    } catch (error: any) {
      this.addResult('Prospect Intelligence', 'fail', `Prospect system check failed: ${error.message}`, phase, true, 'none');
    }

    return this.results;
  }
}
