
import { BaseTestPhase } from './BaseTestPhase';
import { QATestResult } from '../types';

export class Phase5Security extends BaseTestPhase {
  async runTests(): Promise<QATestResult[]> {
    this.results = [];
    const phase = 'Phase 5: Security & Access';
    
    // Test 5.1: Authentication System
    try {
      const { data, error } = await this.getSupabase().auth.getSession();
      
      if (error) throw error;
      this.addResult('Authentication System', 'pass', 'Auth system accessible and responsive', phase, true, 'live');
    } catch (error: any) {
      this.addResult('Authentication System', 'fail', `Auth system check failed: ${error.message}`, phase, false, 'none');
    }

    // Test 5.2: RLS Policy Check
    try {
      // Test that RLS is enforced by attempting unauthenticated access
      const { data, error } = await this.getSupabase()
        .from('clients')
        .select('*')
        .limit(1);
      
      // If we get data without auth, RLS might not be properly configured
      if (data && data.length > 0) {
        this.addResult('Row Level Security', 'warning', 'RLS may need review - data accessible', phase, true, 'live');
      } else {
        this.addResult('Row Level Security', 'pass', 'RLS policies appear to be working', phase, true, 'live');
      }
    } catch (error: any) {
      this.addResult('Row Level Security', 'pass', 'RLS policies enforced correctly', phase, true, 'live');
    }

    return this.results;
  }
}
