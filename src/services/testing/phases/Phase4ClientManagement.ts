
import { BaseTestPhase } from './BaseTestPhase';
import { QATestResult } from '../types';

export class Phase4ClientManagement extends BaseTestPhase {
  async runTests(): Promise<QATestResult[]> {
    this.results = [];
    const phase = 'Phase 4: Client Management';
    
    // Test 4.1: Client Data Integrity
    try {
      const { count, error } = await this.getSupabase()
        .from('clients')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      this.addResult('Client Data System', 'pass', `Client management operational with ${count || 0} clients`, phase, true, 'live');
    } catch (error: any) {
      this.addResult('Client Data System', 'fail', `Client system check failed: ${error.message}`, phase, true, 'none');
    }

    // Test 4.2: Client Activity Tracking
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count, error } = await this.getSupabase()
        .from('clients')
        .select('*', { count: 'exact', head: true })
        .gte('updated_at', yesterday.toISOString());
      
      if (error) throw error;
      
      if ((count || 0) > 0) {
        this.addResult('Client Activity', 'pass', `${count} clients updated in last 24 hours`, phase, true, 'live');
      } else {
        this.addResult('Client Activity', 'warning', 'No client activity in last 24 hours', phase, true, 'none');
      }
    } catch (error: any) {
      this.addResult('Client Activity', 'fail', `Client activity check failed: ${error.message}`, phase, true, 'none');
    }

    return this.results;
  }
}
