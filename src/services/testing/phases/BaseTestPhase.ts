
import { supabase } from '@/integrations/supabase/client';
import { QATestResult, QATestPhase } from '../types';

export abstract class BaseTestPhase implements QATestPhase {
  protected results: QATestResult[] = [];

  abstract runTests(): Promise<QATestResult[]>;

  protected addResult(
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

  protected getSupabase() {
    return supabase;
  }
}
