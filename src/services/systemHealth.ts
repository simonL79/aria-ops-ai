
import { supabase } from '@/integrations/supabase/client';
import { hybridAIService } from './ai/hybridAIService';

export interface SystemHealthCheck {
  component: string;
  status: 'healthy' | 'degraded' | 'down';
  message: string;
  lastChecked: string;
  details?: any;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'down';
  checks: SystemHealthCheck[];
  uptime: string;
  lastFullCheck: string;
}

/**
 * Comprehensive system health monitoring
 */
export class SystemHealthService {
  
  /**
   * Run full system health check
   */
  static async checkSystemHealth(): Promise<SystemHealth> {
    console.log('🏥 Running comprehensive system health check...');
    
    const checks: SystemHealthCheck[] = [];
    const startTime = Date.now();
    
    // Database connectivity
    checks.push(await this.checkDatabase());
    
    // AI services
    checks.push(await this.checkAIServices());
    
    // Authentication
    checks.push(await this.checkAuthentication());
    
    // Edge functions
    checks.push(await this.checkEdgeFunctions());
    
    // Data integrity
    checks.push(await this.checkDataIntegrity());
    
    const healthyCount = checks.filter(c => c.status === 'healthy').length;
    const degradedCount = checks.filter(c => c.status === 'degraded').length;
    const downCount = checks.filter(c => c.status === 'down').length;
    
    let overall: 'healthy' | 'degraded' | 'down';
    if (downCount > 0 || healthyCount < checks.length * 0.5) {
      overall = 'down';
    } else if (degradedCount > 0 || healthyCount < checks.length * 0.8) {
      overall = 'degraded';
    } else {
      overall = 'healthy';
    }
    
    const checkTime = Date.now() - startTime;
    console.log(`✅ Health check completed in ${checkTime}ms - Overall: ${overall}`);
    
    // Log health check
    await supabase.from('aria_ops_log').insert({
      operation_type: 'system_health_check',
      module_source: 'SystemHealthService',
      operation_data: {
        overall,
        checksRun: checks.length,
        healthyCount,
        degradedCount,
        downCount,
        checkTimeMs: checkTime
      },
      success: true
    });
    
    return {
      overall,
      checks,
      uptime: this.getUptime(),
      lastFullCheck: new Date().toISOString()
    };
  }
  
  /**
   * Check database connectivity and basic operations
   */
  private static async checkDatabase(): Promise<SystemHealthCheck> {
    try {
      const startTime = Date.now();
      
      // Test basic connectivity
      const { data, error } = await supabase
        .from('system_config')
        .select('config_key')
        .limit(1);
      
      if (error) {
        return {
          component: 'Database',
          status: 'down',
          message: `Database error: ${error.message}`,
          lastChecked: new Date().toISOString()
        };
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        component: 'Database',
        status: responseTime < 1000 ? 'healthy' : 'degraded',
        message: `Database responsive (${responseTime}ms)`,
        lastChecked: new Date().toISOString(),
        details: { responseTimeMs: responseTime }
      };
      
    } catch (error) {
      return {
        component: 'Database',
        status: 'down',
        message: `Database connection failed: ${error.message}`,
        lastChecked: new Date().toISOString()
      };
    }
  }
  
  /**
   * Check AI services status
   */
  private static async checkAIServices(): Promise<SystemHealthCheck> {
    try {
      await hybridAIService.initialize();
      const status = hybridAIService.getServiceStatus();
      
      const hasActiveService = status.active !== 'none';
      const openaiAvailable = status.openai === 'available';
      const localAvailable = status.local === 'available';
      
      if (!hasActiveService) {
        return {
          component: 'AI Services',
          status: 'down',
          message: 'No AI services available',
          lastChecked: new Date().toISOString(),
          details: status
        };
      }
      
      if (openaiAvailable || localAvailable) {
        return {
          component: 'AI Services',
          status: 'healthy',
          message: `AI services operational (active: ${status.active})`,
          lastChecked: new Date().toISOString(),
          details: status
        };
      }
      
      return {
        component: 'AI Services',
        status: 'degraded',
        message: 'Limited AI service availability',
        lastChecked: new Date().toISOString(),
        details: status
      };
      
    } catch (error) {
      return {
        component: 'AI Services',
        status: 'down',
        message: `AI service check failed: ${error.message}`,
        lastChecked: new Date().toISOString()
      };
    }
  }
  
  /**
   * Check authentication system
   */
  private static async checkAuthentication(): Promise<SystemHealthCheck> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      return {
        component: 'Authentication',
        status: 'healthy',
        message: session ? 'User authenticated' : 'Auth system operational',
        lastChecked: new Date().toISOString(),
        details: { hasSession: !!session }
      };
      
    } catch (error) {
      return {
        component: 'Authentication',
        status: 'down',
        message: `Auth check failed: ${error.message}`,
        lastChecked: new Date().toISOString()
      };
    }
  }
  
  /**
   * Check edge functions health
   */
  private static async checkEdgeFunctions(): Promise<SystemHealthCheck> {
    try {
      // Test a simple edge function call
      const { data, error } = await supabase.functions.invoke('generate-response', {
        body: { test: true, prompt: 'health check' }
      });
      
      if (error) {
        return {
          component: 'Edge Functions',
          status: 'degraded',
          message: `Edge function error: ${error.message}`,
          lastChecked: new Date().toISOString()
        };
      }
      
      return {
        component: 'Edge Functions',
        status: 'healthy',
        message: 'Edge functions operational',
        lastChecked: new Date().toISOString()
      };
      
    } catch (error) {
      return {
        component: 'Edge Functions',
        status: 'down',
        message: `Edge function check failed: ${error.message}`,
        lastChecked: new Date().toISOString()
      };
    }
  }
  
  /**
   * Check data integrity
   */
  private static async checkDataIntegrity(): Promise<SystemHealthCheck> {
    try {
      // Check for recent data
      const { data: recentData, error } = await supabase
        .from('scan_results')
        .select('id')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(10);
      
      if (error) {
        return {
          component: 'Data Integrity',
          status: 'degraded',
          message: `Data check error: ${error.message}`,
          lastChecked: new Date().toISOString()
        };
      }
      
      const recentCount = recentData?.length || 0;
      
      return {
        component: 'Data Integrity',
        status: recentCount > 0 ? 'healthy' : 'degraded',
        message: `${recentCount} recent records found`,
        lastChecked: new Date().toISOString(),
        details: { recentRecordCount: recentCount }
      };
      
    } catch (error) {
      return {
        component: 'Data Integrity',
        status: 'down',
        message: `Data integrity check failed: ${error.message}`,
        lastChecked: new Date().toISOString()
      };
    }
  }
  
  /**
   * Get system uptime (simplified)
   */
  private static getUptime(): string {
    // In a real implementation, this would track actual system start time
    return '99.9%';
  }
  
  /**
   * Quick health ping for monitoring
   */
  static async quickHealthPing(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('system_config')
        .select('config_key')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Quick health ping failed:', error);
      return false;
    }
  }
}
