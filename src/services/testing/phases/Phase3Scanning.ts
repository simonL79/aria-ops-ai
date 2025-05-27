
import { BaseTestPhase } from './BaseTestPhase';
import { QATestResult } from '../types';

export class Phase3Scanning extends BaseTestPhase {
  async runTests(): Promise<QATestResult[]> {
    this.results = [];
    const phase = 'Phase 3: Scanning & Monitoring';
    
    // Test 3.1: Monitoring Status
    try {
      const { data, error } = await this.getSupabase()
        .from('monitoring_status')
        .select('*')
        .eq('id', '1')
        .single();
      
      if (error) throw error;
      
      const status = data.is_active ? 'active' : 'inactive';
      this.addResult('Monitoring Status', 'pass', `Monitoring system ${status}, ${data.sources_count || 0} sources`, phase, true, 'live');
    } catch (error: any) {
      this.addResult('Monitoring Status', 'fail', `Monitoring status check failed: ${error.message}`, phase, true, 'none');
    }

    // Test 3.2: Platform Configuration
    try {
      const { data, error } = await this.getSupabase()
        .from('monitored_platforms')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      this.addResult('Platform Configuration', 'pass', `${data?.length || 0} active platforms configured`, phase, true, 'live');
    } catch (error: any) {
      this.addResult('Platform Configuration', 'fail', `Platform config check failed: ${error.message}`, phase, true, 'none');
    }

    // Test 3.3: Recent Scan Activity
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count, error } = await this.getSupabase()
        .from('scan_results')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', yesterday.toISOString());
      
      if (error) throw error;
      
      if ((count || 0) > 0) {
        this.addResult('Recent Scan Activity', 'pass', `${count} scans in last 24 hours`, phase, true, 'live');
      } else {
        this.addResult('Recent Scan Activity', 'warning', 'No scan activity in last 24 hours', phase, true, 'none');
      }
    } catch (error: any) {
      this.addResult('Recent Scan Activity', 'fail', `Scan activity check failed: ${error.message}`, phase, true, 'none');
    }

    return this.results;
  }
}
