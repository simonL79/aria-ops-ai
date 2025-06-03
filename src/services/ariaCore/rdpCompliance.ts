
import { supabase } from '@/integrations/supabase/client';

/**
 * RDP-001 Compliance Enforcer - Real-Only Data Policy
 * No mock data. No simulated sources. Ever.
 */

export interface ComplianceViolation {
  id: string;
  violation_type: 'mock_content' | 'untrusted_source' | 'dead_link' | 'simulation_detected';
  content: string;
  source_url?: string;
  detected_at: string;
  stage: 'generation' | 'approval' | 'deployment' | 'crawling';
  quarantined: boolean;
}

export class RDPComplianceEnforcer {
  // RDP-001 Approved domains for live content
  private static readonly TRUSTED_DOMAINS = [
    'github.io', 'vercel.app', 'netlify.app', 'youtube.com', 'reddit.com', 
    'medium.com', 'twitter.com', 'linkedin.com', 'news.ycombinator.com',
    'stackoverflow.com', 'bbc.com', 'cnn.com', 'reuters.com', 'bloomberg.com',
    'techcrunch.com', 'theguardian.com', 'nytimes.com', 'wsj.com'
  ];

  // Enhanced mock detection patterns for RDP-001
  private static readonly MOCK_KEYWORDS = [
    'lorem', 'ipsum', 'mock', 'example', 'test', 'placeholder', 'sample', 
    'fakename', 'simdata', 'dummy', 'template', 'demo', 'simulation',
    'hypothetical', 'fictional', 'generated', 'artificial', 'synthetic',
    'advanced ai analysis for target entity', 'target entity', 'undefined'
  ];

  /**
   * Stage 1: Generation Input Validation
   */
  static async enforceOnGeneration(inputData: any): Promise<boolean> {
    try {
      const inputText = JSON.stringify(inputData).toLowerCase();
      
      // Check for mock keywords in generation input
      for (const keyword of this.MOCK_KEYWORDS) {
        if (inputText.includes(keyword)) {
          await this.quarantineViolation({
            violation_type: 'mock_content',
            content: inputText.substring(0, 200),
            stage: 'generation',
            reason: `Mock keyword detected: ${keyword}`
          });
          throw new Error(`🚫 RDP-001 VIOLATION: Mock content detected in generation input: ${keyword}`);
        }
      }
      
      console.log('✅ RDP-001: Generation input validation passed');
      return true;
    } catch (error) {
      console.error('❌ RDP-001: Generation validation failed:', error);
      throw error;
    }
  }

  /**
   * Stage 2: Content Approval Validation
   */
  static async validateArticlePayload(article: any): Promise<boolean> {
    try {
      // Validate article content
      const title = article.title || article.article_title || '';
      const content = article.content || article.article_content || '';
      
      await this.validateContentText(title, 'approval');
      await this.validateContentText(content, 'approval');
      
      // Validate all external links
      const links = article.external_links || article.urls || [];
      for (const link of links) {
        await this.validateSourceUrl(link, 'approval');
      }
      
      console.log('✅ RDP-001: Article payload validation passed');
      return true;
    } catch (error) {
      console.error('❌ RDP-001: Article validation failed:', error);
      throw error;
    }
  }

  /**
   * Stage 3: Deployment Validation
   */
  static async enforceOnDeployment(deploymentData: any): Promise<boolean> {
    try {
      // Final validation before deployment
      await this.validateArticlePayload(deploymentData);
      
      // Additional deployment-specific checks
      if (deploymentData.url) {
        await this.validateSourceUrl(deploymentData.url, 'deployment');
      }
      
      console.log('✅ RDP-001: Deployment validation passed');
      return true;
    } catch (error) {
      console.error('❌ RDP-001: Deployment validation failed:', error);
      throw error;
    }
  }

  /**
   * Enhanced content text validation
   */
  private static async validateContentText(text: string, stage: string): Promise<void> {
    const lowerText = text.toLowerCase();
    
    for (const keyword of this.MOCK_KEYWORDS) {
      if (lowerText.includes(keyword)) {
        await this.quarantineViolation({
          violation_type: 'mock_content',
          content: text.substring(0, 200),
          stage: stage as any,
          reason: `Mock keyword detected: ${keyword}`
        });
        throw new Error(`🚫 RDP-001 VIOLATION: Mock content detected: ${keyword}`);
      }
    }
  }

  /**
   * Live URL verification with HTTP 200 requirement
   */
  static async validateSourceUrl(url: string, stage: string): Promise<void> {
    try {
      // Check if domain is trusted
      const isTrusted = this.TRUSTED_DOMAINS.some(domain => url.includes(domain));
      if (!isTrusted) {
        await this.quarantineViolation({
          violation_type: 'untrusted_source',
          content: url,
          source_url: url,
          stage: stage as any,
          reason: 'Domain not in RDP-001 trusted list'
        });
        throw new Error(`🚫 RDP-001 VIOLATION: Untrusted source domain: ${url}`);
      }

      // Live verification - HTTP 200 required
      try {
        const response = await fetch(url, { 
          method: 'HEAD', 
          signal: AbortSignal.timeout(5000) 
        });
        
        if (response.status !== 200) {
          await this.quarantineViolation({
            violation_type: 'dead_link',
            content: url,
            source_url: url,
            stage: stage as any,
            reason: `HTTP ${response.status} - not live`
          });
          throw new Error(`🚫 RDP-001 VIOLATION: URL not live (HTTP ${response.status}): ${url}`);
        }
      } catch (fetchError) {
        await this.quarantineViolation({
          violation_type: 'dead_link',
          content: url,
          source_url: url,
          stage: stage as any,
          reason: `Network error: ${fetchError.message}`
        });
        throw new Error(`🚫 RDP-001 VIOLATION: URL validation failed: ${url}`);
      }
      
      console.log(`✅ RDP-001: URL validated: ${url}`);
    } catch (error) {
      console.error(`❌ RDP-001: URL validation failed for ${url}:`, error);
      throw error;
    }
  }

  /**
   * Quarantine system for violations using existing tables
   */
  private static async quarantineViolation(violation: {
    violation_type: string;
    content: string;
    source_url?: string;
    stage: string;
    reason: string;
  }): Promise<void> {
    try {
      const quarantineRecord = {
        id: crypto.randomUUID(),
        entity_name: 'RDP-001_VIOLATION',
        event_type: 'rdp_compliance_violation',
        summary: `RDP-001 Violation: ${violation.reason}`,
        priority: 'high',
        seen: false
      };

      // Store in notifications table (existing table)
      const { error } = await supabase
        .from('aria_notifications')
        .insert(quarantineRecord);

      if (error) {
        console.error('Failed to quarantine violation:', error);
      } else {
        console.log(`🔒 RDP-001: Violation quarantined: ${violation.violation_type}`);
      }

      // Also log to activity logs
      await this.logToActivityLogs(violation.reason, quarantineRecord);
      
    } catch (error) {
      console.error('Quarantine system error:', error);
    }
  }

  /**
   * Log to activity logs using existing table
   */
  private static async logToActivityLogs(reason: string, violation: any): Promise<void> {
    try {
      await supabase
        .from('activity_logs')
        .insert({
          action: 'rdp_compliance_violation',
          entity_type: 'compliance',
          entity_id: violation.id,
          details: reason,
          user_email: 'system@aria.com'
        });
        
      console.log(`📢 RDP-001: Activity logged: ${reason}`);
    } catch (error) {
      console.error('Activity logging failed:', error);
    }
  }

  /**
   * Get compliance statistics using existing tables
   */
  static async getComplianceStats(): Promise<{
    total_violations: number;
    violations_by_type: Record<string, number>;
    violations_by_stage: Record<string, number>;
    quarantined_items: number;
  }> {
    try {
      const { data: violations, error } = await supabase
        .from('aria_notifications')
        .select('*')
        .eq('event_type', 'rdp_compliance_violation');

      if (error) {
        console.error('Failed to fetch compliance stats:', error);
        return {
          total_violations: 0,
          violations_by_type: {},
          violations_by_stage: {},
          quarantined_items: 0
        };
      }

      const stats = {
        total_violations: violations?.length || 0,
        violations_by_type: {} as Record<string, number>,
        violations_by_stage: {} as Record<string, number>,
        quarantined_items: violations?.filter(v => !v.seen).length || 0
      };

      // Parse violation types and stages from summary
      violations?.forEach(v => {
        const summary = v.summary || '';
        
        // Extract type from summary
        if (summary.includes('mock')) {
          stats.violations_by_type['mock_content'] = (stats.violations_by_type['mock_content'] || 0) + 1;
        } else if (summary.includes('untrusted')) {
          stats.violations_by_type['untrusted_source'] = (stats.violations_by_type['untrusted_source'] || 0) + 1;
        } else if (summary.includes('dead')) {
          stats.violations_by_type['dead_link'] = (stats.violations_by_type['dead_link'] || 0) + 1;
        } else {
          stats.violations_by_type['simulation_detected'] = (stats.violations_by_type['simulation_detected'] || 0) + 1;
        }

        // Extract stage from summary
        if (summary.includes('generation')) {
          stats.violations_by_stage['generation'] = (stats.violations_by_stage['generation'] || 0) + 1;
        } else if (summary.includes('approval')) {
          stats.violations_by_stage['approval'] = (stats.violations_by_stage['approval'] || 0) + 1;
        } else if (summary.includes('deployment')) {
          stats.violations_by_stage['deployment'] = (stats.violations_by_stage['deployment'] || 0) + 1;
        } else {
          stats.violations_by_stage['crawling'] = (stats.violations_by_stage['crawling'] || 0) + 1;
        }
      });

      return stats;
    } catch (error) {
      console.error('Error fetching compliance stats:', error);
      return {
        total_violations: 0,
        violations_by_type: {},
        violations_by_stage: {},
        quarantined_items: 0
      };
    }
  }

  /**
   * System-wide compliance check
   */
  static async performSystemComplianceAudit(): Promise<{
    compliant: boolean;
    violations_found: number;
    audit_summary: string;
  }> {
    try {
      console.log('🔍 RDP-001: Starting system-wide compliance audit...');
      
      const stats = await this.getComplianceStats();
      const recentViolations = await this.getRecentViolations(24); // Last 24 hours
      
      const compliant = recentViolations.length === 0;
      
      const auditSummary = compliant 
        ? 'RDP-001 COMPLIANT: No violations detected in last 24 hours'
        : `RDP-001 VIOLATIONS: ${recentViolations.length} violations in last 24 hours`;
      
      console.log(`✅ RDP-001: Audit complete - ${auditSummary}`);
      
      return {
        compliant,
        violations_found: recentViolations.length,
        audit_summary: auditSummary
      };
    } catch (error) {
      console.error('RDP-001: Audit failed:', error);
      return {
        compliant: false,
        violations_found: -1,
        audit_summary: 'RDP-001 AUDIT FAILED: System error'
      };
    }
  }

  /**
   * Get recent violations for monitoring
   */
  private static async getRecentViolations(hours: number): Promise<any[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setHours(cutoffDate.getHours() - hours);
      
      const { data, error } = await supabase
        .from('aria_notifications')
        .select('*')
        .eq('event_type', 'rdp_compliance_violation')
        .gte('created_at', cutoffDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to fetch recent violations:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching recent violations:', error);
      return [];
    }
  }
}

// Export convenience functions
export const {
  enforceOnGeneration,
  validateArticlePayload,
  enforceOnDeployment,
  validateSourceUrl,
  getComplianceStats,
  performSystemComplianceAudit
} = RDPComplianceEnforcer;
