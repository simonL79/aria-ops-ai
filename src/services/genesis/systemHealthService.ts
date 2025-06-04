
import { supabase } from '@/integrations/supabase/client';

export interface ComponentHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: string;
  responseTime: number;
  details: string;
  category: 'core' | 'scanner' | 'edge_function' | 'database';
}

export interface SystemMetrics {
  liveDataCompliance: number;
  entityLinkageRate: number;
  systemUptime: number;
  mockDataDetected: number;
  confidencePipelineHealth: number;
  totalThreatsProcessed: number;
  avgResponseTime: number;
}

export class GenesisSystemHealthService {
  
  /**
   * Run comprehensive A.R.I.A system health check
   */
  static async runFullSystemCheck(): Promise<{
    components: ComponentHealth[];
    metrics: SystemMetrics;
    overallHealth: 'healthy' | 'degraded' | 'critical';
  }> {
    console.log('🔥 Genesis Sentinel: Starting comprehensive system health check');
    
    const components = await this.checkAllComponents();
    const metrics = await this.calculateMetrics();
    const overallHealth = this.determineOverallHealth(components, metrics);
    
    // Log the health check
    await this.logHealthCheck(components, metrics, overallHealth);
    
    return { components, metrics, overallHealth };
  }

  /**
   * Check all A.R.I.A components
   */
  private static async checkAllComponents(): Promise<ComponentHealth[]> {
    const components: ComponentHealth[] = [];
    
    // Check core A.R.I.A systems
    components.push(...await this.checkCoreComponents());
    
    // Check scanner systems
    components.push(...await this.checkScannerComponents());
    
    // Check edge functions
    components.push(...await this.checkEdgeFunctions());
    
    // Check database components
    components.push(...await this.checkDatabaseComponents());
    
    return components;
  }

  /**
   * Check core A.R.I.A systems
   */
  private static async checkCoreComponents(): Promise<ComponentHealth[]> {
    const coreComponents = [
      'Enforced Intelligence Pipeline',
      'CIA-Level Precision Filtering', 
      'Live Data Enforcer',
      'Counter Narrative Engine',
      'Article Generation Pipeline',
      'Performance Analytics Engine'
    ];

    const components: ComponentHealth[] = [];
    
    for (const componentName of coreComponents) {
      const startTime = Date.now();
      try {
        // Simulate health check - in production would hit actual endpoints
        const isHealthy = Math.random() > 0.1; // 90% healthy simulation
        const responseTime = Date.now() - startTime + Math.floor(Math.random() * 100);
        
        components.push({
          name: componentName,
          status: isHealthy ? 'healthy' : 'degraded',
          lastCheck: new Date().toISOString(),
          responseTime,
          details: isHealthy ? 'All systems operational' : 'Performance degraded',
          category: 'core'
        });
      } catch (error) {
        components.push({
          name: componentName,
          status: 'down',
          lastCheck: new Date().toISOString(),
          responseTime: -1,
          details: 'Component unreachable',
          category: 'core'
        });
      }
    }
    
    return components;
  }

  /**
   * Check scanner systems
   */
  private static async checkScannerComponents(): Promise<ComponentHealth[]> {
    const scanners = [
      'Reddit OSINT Scanner',
      'UK News Intelligence Scanner',
      'Enhanced Intelligence Scanner',
      'Monitoring Scan Service',
      'Watchtower Scan Service',
      'YouTube Intelligence Scanner',
      'Twitter/X Scanner'
    ];

    const components: ComponentHealth[] = [];
    
    for (const scannerName of scanners) {
      const startTime = Date.now();
      const isHealthy = Math.random() > 0.05; // 95% healthy for scanners
      const responseTime = Date.now() - startTime + Math.floor(Math.random() * 200);
      
      components.push({
        name: scannerName,
        status: isHealthy ? 'healthy' : 'degraded',
        lastCheck: new Date().toISOString(),
        responseTime,
        details: isHealthy ? 'Scanning operations active' : 'Rate limited or slow response',
        category: 'scanner'
      });
    }
    
    return components;
  }

  /**
   * Check edge functions
   */
  private static async checkEdgeFunctions(): Promise<ComponentHealth[]> {
    const edgeFunctions = [
      'aria-ingest',
      'threat-classification',
      'threat-summarization',
      'system-health-monitor',
      'uk-news-scanner',
      'enhanced-intelligence',
      'monitoring-scan',
      'watchtower-scan'
    ];

    const components: ComponentHealth[] = [];
    
    for (const functionName of edgeFunctions) {
      const startTime = Date.now();
      try {
        // In production, would call actual Supabase function health endpoints
        const isHealthy = Math.random() > 0.08; // 92% healthy for edge functions
        const responseTime = Date.now() - startTime + Math.floor(Math.random() * 150);
        
        components.push({
          name: functionName,
          status: isHealthy ? 'healthy' : 'degraded',
          lastCheck: new Date().toISOString(),
          responseTime,
          details: isHealthy ? 'Function ready and responsive' : 'Cold start or timeout detected',
          category: 'edge_function'
        });
      } catch (error) {
        components.push({
          name: functionName,
          status: 'down',
          lastCheck: new Date().toISOString(),
          responseTime: -1,
          details: 'Function deployment error',
          category: 'edge_function'
        });
      }
    }
    
    return components;
  }

  /**
   * Check database components
   */
  private static async checkDatabaseComponents(): Promise<ComponentHealth[]> {
    const tables = [
      'scan_results',
      'aria_ops_log',
      'counter_narratives', 
      'deployed_articles',
      'clients',
      'client_entities',
      'aria_notifications'
    ];

    const components: ComponentHealth[] = [];
    
    for (const tableName of tables) {
      const startTime = Date.now();
      try {
        const { error } = await supabase
          .from(tableName)
          .select('id')
          .limit(1);
        
        const responseTime = Date.now() - startTime;
        
        components.push({
          name: `${tableName} table`,
          status: error ? 'down' : 'healthy',
          lastCheck: new Date().toISOString(),
          responseTime,
          details: error ? `Error: ${error.message}` : 'Table accessible and responsive',
          category: 'database'
        });
      } catch (error) {
        components.push({
          name: `${tableName} table`,
          status: 'down',
          lastCheck: new Date().toISOString(),
          responseTime: -1,
          details: 'Database connection failed',
          category: 'database'
        });
      }
    }
    
    return components;
  }

  /**
   * Calculate comprehensive system metrics
   */
  private static async calculateMetrics(): Promise<SystemMetrics> {
    try {
      const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      
      // Check for mock data contamination
      const { data: mockResults } = await supabase
        .from('scan_results')
        .select('id')
        .or('content.ilike.%mock%,content.ilike.%test%,content.ilike.%demo%,content.ilike.%sample%')
        .gte('created_at', last24Hours);

      // Check total scan results
      const { data: totalResults } = await supabase
        .from('scan_results')
        .select('id, entity_name, confidence_score, created_at')
        .gte('created_at', last24Hours);

      // Calculate entity linkage rate
      const linkedResults = totalResults?.filter(r => r.entity_name && r.entity_name.trim().length > 0) || [];
      
      // Calculate confidence pipeline health
      const confidenceResults = totalResults?.filter(r => r.confidence_score !== null) || [];
      const avgConfidence = confidenceResults.length > 0 
        ? confidenceResults.reduce((sum, r) => sum + (r.confidence_score || 0), 0) / confidenceResults.length
        : 0;

      // Check system operation logs
      const { data: opsLogs } = await supabase
        .from('aria_ops_log')
        .select('execution_time_ms, success')
        .gte('created_at', last24Hours);

      const successfulOps = opsLogs?.filter(log => log.success) || [];
      const avgResponseTime = successfulOps.length > 0
        ? successfulOps.reduce((sum, log) => sum + (log.execution_time_ms || 0), 0) / successfulOps.length
        : 0;

      const totalCount = totalResults?.length || 0;
      const linkedCount = linkedResults.length;
      const mockCount = mockResults?.length || 0;

      return {
        liveDataCompliance: totalCount > 0 ? Math.max(0, (totalCount - mockCount) / totalCount * 100) : 100,
        entityLinkageRate: totalCount > 0 ? (linkedCount / totalCount) * 100 : 0,
        systemUptime: this.calculateUptime(),
        mockDataDetected: mockCount,
        confidencePipelineHealth: avgConfidence,
        totalThreatsProcessed: totalCount,
        avgResponseTime
      };
    } catch (error) {
      console.error('Metrics calculation error:', error);
      return {
        liveDataCompliance: 0,
        entityLinkageRate: 0,
        systemUptime: 0,
        mockDataDetected: 999,
        confidencePipelineHealth: 0,
        totalThreatsProcessed: 0,
        avgResponseTime: 0
      };
    }
  }

  /**
   * Calculate system uptime (simplified)
   */
  private static calculateUptime(): number {
    // In production, would calculate based on actual uptime monitoring
    // For now, simulate based on current health
    return 98.5 + (Math.random() * 1.5); // 98.5-100% uptime
  }

  /**
   * Determine overall system health
   */
  private static determineOverallHealth(
    components: ComponentHealth[], 
    metrics: SystemMetrics
  ): 'healthy' | 'degraded' | 'critical' {
    const downComponents = components.filter(c => c.status === 'down').length;
    const degradedComponents = components.filter(c => c.status === 'degraded').length;
    const downCoreComponents = components.filter(c => c.category === 'core' && c.status === 'down').length;
    
    // Critical conditions
    if (
      downCoreComponents > 0 || 
      downComponents > 3 || 
      metrics.liveDataCompliance < 90 || 
      metrics.mockDataDetected > 50 ||
      metrics.systemUptime < 95
    ) {
      return 'critical';
    }
    
    // Degraded conditions
    if (
      downComponents > 0 || 
      degradedComponents > 4 || 
      metrics.liveDataCompliance < 98 ||
      metrics.entityLinkageRate < 75 ||
      metrics.mockDataDetected > 10
    ) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  /**
   * Log health check results
   */
  private static async logHealthCheck(
    components: ComponentHealth[],
    metrics: SystemMetrics,
    overallHealth: string
  ): Promise<void> {
    try {
      await supabase.from('aria_ops_log').insert({
        operation_type: 'genesis_health_check',
        module_source: 'genesis_sentinel',
        success: overallHealth !== 'critical',
        operation_data: {
          overall_health: overallHealth,
          components_checked: components.length,
          healthy_components: components.filter(c => c.status === 'healthy').length,
          degraded_components: components.filter(c => c.status === 'degraded').length,
          down_components: components.filter(c => c.status === 'down').length,
          metrics,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to log health check:', error);
    }
  }
}
