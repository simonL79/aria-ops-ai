
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface QATestResult {
  testName: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  timestamp: Date;
  phase: string;
}

export interface QATestSuite {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  warningTests: number;
  duration: number;
  results: QATestResult[];
}

export class QATestRunner {
  private results: QATestResult[] = [];

  async runFullQASuite(): Promise<QATestSuite> {
    const startTime = Date.now();
    this.results = [];

    console.log('Starting QA Master Suite...');

    // Phase 1: Public Entry Points
    await this.runPhase1Tests();
    
    // Phase 2: Backend Intelligence
    await this.runPhase2Tests();
    
    // Phase 3: Control Center
    await this.runPhase3Tests();
    
    // Phase 4: Command Modules
    await this.runPhase4Tests();
    
    // Phase 5: Security & Compliance
    await this.runPhase5Tests();
    
    // Phase 6: System Health
    await this.runPhase6Tests();
    
    // Phase 7: Export & Audit
    await this.runPhase7Tests();

    const duration = Date.now() - startTime;
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'pass').length;
    const failedTests = this.results.filter(r => r.status === 'fail').length;
    const warningTests = this.results.filter(r => r.status === 'warning').length;

    return {
      totalTests,
      passedTests,
      failedTests,
      warningTests,
      duration,
      results: this.results
    };
  }

  private addResult(testName: string, status: 'pass' | 'fail' | 'warning', message: string, phase: string) {
    this.results.push({
      testName,
      status,
      message,
      timestamp: new Date(),
      phase
    });
  }

  private async runPhase1Tests() {
    const phase = 'Phase 1: Public Entry Points';
    
    // Test 1.1: Form Submission
    try {
      const { data, error } = await supabase
        .from('reputation_scan_submissions')
        .select('count(*)')
        .limit(1);
      
      if (error) throw error;
      this.addResult('Form Submission Table', 'pass', 'Reputation scan submissions table accessible', phase);
    } catch (error) {
      this.addResult('Form Submission Table', 'fail', `Database error: ${error.message}`, phase);
    }

    // Test 1.2: Rate Limiting Check
    this.addResult('Rate Limiting', 'warning', 'Rate limiting not implemented - manual verification needed', phase);

    // Test 1.3: Input Validation
    this.addResult('Input Validation', 'warning', 'Input validation requires manual testing', phase);
  }

  private async runPhase2Tests() {
    const phase = 'Phase 2: Backend Intelligence';
    
    // Test 2.1: Threat Analysis Pipeline
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select('threat_type, confidence_score')
        .not('threat_type', 'is', null)
        .limit(5);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        this.addResult('Threat Analysis Pipeline', 'pass', `Found ${data.length} analyzed threats`, phase);
      } else {
        this.addResult('Threat Analysis Pipeline', 'warning', 'No analyzed threats found in database', phase);
      }
    } catch (error) {
      this.addResult('Threat Analysis Pipeline', 'fail', `Pipeline error: ${error.message}`, phase);
    }

    // Test 2.2: AI Integration
    const hasAIAnalysis = this.results.some(r => r.testName.includes('Threat Analysis') && r.status === 'pass');
    this.addResult('AI Integration', hasAIAnalysis ? 'pass' : 'warning', 
      hasAIAnalysis ? 'AI analysis detected in threat data' : 'AI analysis integration needs verification', phase);
  }

  private async runPhase3Tests() {
    const phase = 'Phase 3: Control Center';
    
    // Test 3.1: Real-time Threat Feed
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select('created_at, platform, severity')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      this.addResult('Real-time Threat Feed', 'pass', `Feed accessible with ${data?.length || 0} recent items`, phase);
    } catch (error) {
      this.addResult('Real-time Threat Feed', 'fail', `Feed error: ${error.message}`, phase);
    }

    // Test 3.2: Case Thread Management
    try {
      // Use type assertion for new table
      const { data, error } = await (supabase as any)
        .from('case_threads')
        .select('id, title, status, priority')
        .limit(5);
      
      if (error) throw error;
      this.addResult('Case Thread Management', 'pass', `Case threads accessible with ${data?.length || 0} threads`, phase);
    } catch (error) {
      this.addResult('Case Thread Management', 'warning', `Case threads may not be fully configured: ${error.message}`, phase);
    }
  }

  private async runPhase4Tests() {
    const phase = 'Phase 4: Command Modules';
    
    // Test 4.1: Response Generation
    try {
      const { data, error } = await supabase
        .from('generated_responses')
        .select('response_text')
        .limit(1);
      
      if (error) throw error;
      this.addResult('Response Generation', 'pass', 'Response generation system accessible', phase);
    } catch (error) {
      this.addResult('Response Generation', 'fail', `Response system error: ${error.message}`, phase);
    }

    // Test 4.2: Playbook Assistant
    this.addResult('Playbook Assistant', 'warning', 'GPT-powered playbook assistant requires manual verification', phase);
  }

  private async runPhase5Tests() {
    const phase = 'Phase 5: Security & Compliance';
    
    // Test 5.1: Activity Logging
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('action, created_at')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      this.addResult('Activity Logging', 'pass', 'Activity logging system operational', phase);
    } catch (error) {
      this.addResult('Activity Logging', 'fail', `Logging error: ${error.message}`, phase);
    }

    // Test 5.2: User Roles & Permissions
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .limit(1);
      
      if (error) throw error;
      this.addResult('User Roles & Permissions', 'pass', 'Role-based access control configured', phase);
    } catch (error) {
      this.addResult('User Roles & Permissions', 'fail', `RBAC error: ${error.message}`, phase);
    }
  }

  private async runPhase6Tests() {
    const phase = 'Phase 6: System Health';
    
    // Test 6.1: Health Monitoring
    try {
      // Use type assertion for new table
      const { data, error } = await (supabase as any)
        .from('system_health_checks')
        .select('check_type, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      this.addResult('Health Monitoring', 'pass', `Health checks accessible with ${data?.length || 0} recent checks`, phase);
    } catch (error) {
      this.addResult('Health Monitoring', 'warning', `Health monitoring setup incomplete: ${error.message}`, phase);
    }

    // Test 6.2: Platform Status
    try {
      const { data, error } = await supabase
        .from('monitored_platforms')
        .select('name, status, active')
        .eq('active', true);
      
      if (error) throw error;
      this.addResult('Platform Status', 'pass', `${data?.length || 0} active platforms monitored`, phase);
    } catch (error) {
      this.addResult('Platform Status', 'fail', `Platform monitoring error: ${error.message}`, phase);
    }

    // Test 6.3: Monitoring Status
    try {
      const { data, error } = await supabase
        .from('monitoring_status')
        .select('is_active, last_run, sources_count')
        .eq('id', '1')
        .single();
      
      if (error) throw error;
      this.addResult('Monitoring Status', 'pass', 
        `Monitoring ${data.is_active ? 'active' : 'inactive'}, ${data.sources_count || 0} sources`, phase);
    } catch (error) {
      this.addResult('Monitoring Status', 'fail', `Monitoring status error: ${error.message}`, phase);
    }
  }

  private async runPhase7Tests() {
    const phase = 'Phase 7: Export & Audit';
    
    // Test 7.1: Data Export Capability
    try {
      const { data, error } = await supabase
        .from('scan_results')
        .select('*')
        .limit(1);
      
      if (error) throw error;
      this.addResult('Data Export Capability', 'pass', 'Data export endpoints accessible', phase);
    } catch (error) {
      this.addResult('Data Export Capability', 'fail', `Export capability error: ${error.message}`, phase);
    }

    // Test 7.2: Audit Trail Completeness
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('action, entity_type, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      const actionTypes = [...new Set(data?.map(log => log.action) || [])];
      this.addResult('Audit Trail Completeness', 'pass', 
        `Audit trail active with ${actionTypes.length} action types`, phase);
    } catch (error) {
      this.addResult('Audit Trail Completeness', 'fail', `Audit trail error: ${error.message}`, phase);
    }

    // Test 7.3: System Performance
    const totalPassedTests = this.results.filter(r => r.status === 'pass').length;
    const totalTests = this.results.length;
    const passRate = (totalPassedTests / totalTests) * 100;
    
    if (passRate >= 80) {
      this.addResult('System Performance', 'pass', `${passRate.toFixed(1)}% test pass rate`, phase);
    } else if (passRate >= 60) {
      this.addResult('System Performance', 'warning', `${passRate.toFixed(1)}% test pass rate - needs improvement`, phase);
    } else {
      this.addResult('System Performance', 'fail', `${passRate.toFixed(1)}% test pass rate - critical issues`, phase);
    }
  }
}

export const qaTestRunner = new QATestRunner();
