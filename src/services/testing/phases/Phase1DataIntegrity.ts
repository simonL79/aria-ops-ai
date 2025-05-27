
import { BaseTestPhase } from './BaseTestPhase';
import { QATestResult } from '../types';

export class Phase1DataIntegrity extends BaseTestPhase {
  async runTests(): Promise<QATestResult[]> {
    this.results = [];
    const phase = 'Phase 1: Data Integrity & GDPR';
    
    // Test 1.1: Database Connection & Health
    try {
      const { data, error } = await this.getSupabase().from('monitoring_status').select('*').limit(1);
      if (error) throw error;
      this.addResult('Database Connection', 'pass', 'Database accessible and responsive', phase, true, 'live');
    } catch (error: any) {
      this.addResult('Database Connection', 'fail', `Database connection failed: ${error.message}`, phase, true, 'none');
    }

    // Test 1.2: GDPR Compliance Tables
    try {
      let allTablesExist = true;
      let tableCount = 0;

      const tables = ['consent_records', 'data_subject_requests', 'compliance_audit_logs', 'data_retention_schedule'];
      
      for (const tableName of tables) {
        try {
          const { count, error } = await this.getSupabase().from(tableName).select('*', { count: 'exact', head: true });
          if (error) throw error;
          tableCount += count || 0;
        } catch {
          allTablesExist = false;
        }
      }

      if (allTablesExist) {
        this.addResult('GDPR Tables Structure', 'pass', `All GDPR compliance tables accessible with ${tableCount} total records`, phase, true, 'live');
      } else {
        this.addResult('GDPR Tables Structure', 'fail', 'One or more GDPR compliance tables missing', phase, false, 'none');
      }
    } catch (error: any) {
      this.addResult('GDPR Tables Structure', 'fail', `GDPR table check failed: ${error.message}`, phase, false, 'none');
    }

    // Test 1.3: Data Retention Compliance
    try {
      const { data, error } = await this.getSupabase()
        .from('data_retention_schedule')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        this.addResult('Data Retention Schedule', 'pass', `${data.length} retention policies configured`, phase, true, 'live');
      } else {
        this.addResult('Data Retention Schedule', 'warning', 'No data retention policies found', phase, false, 'none');
      }
    } catch (error: any) {
      this.addResult('Data Retention Schedule', 'fail', `Retention check failed: ${error.message}`, phase, false, 'none');
    }

    return this.results;
  }
}
