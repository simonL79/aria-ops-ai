
import { anubisIntegrationService } from './anubisIntegrationService';
import { sovraService } from '../sovra/sovraService';

class EnhancedSovraConnector {
  async logThreatDetection(threat: any, userId?: string): Promise<void> {
    await anubisIntegrationService.logActivity({
      module: 'SOVRA',
      activity_type: 'threat_detected',
      user_id: userId,
      metadata: {
        threat_type: threat.type,
        risk_score: threat.score,
        platform: threat.platform,
        identity: threat.identity
      },
      severity: threat.score > 0.8 ? 'critical' : threat.score > 0.6 ? 'warning' : 'info',
      source_component: 'SovraDecisionEngine'
    });
  }

  async logAdminDecision(threatId: string, approved: boolean, comment: string, userId?: string): Promise<void> {
    await anubisIntegrationService.logSovraDecision(threatId, approved ? 'approved' : 'rejected', 1.0, userId);
    
    await anubisIntegrationService.logActivity({
      module: 'SOVRA',
      activity_type: 'admin_decision',
      user_id: userId,
      metadata: {
        threat_id: threatId,
        decision: approved ? 'approved' : 'rejected',
        comment,
        admin_action: true
      },
      severity: approved ? 'warning' : 'info',
      source_component: 'SovraAdminInterface'
    });
  }

  async logActionExecution(threatId: string, actionType: string, result: string, userId?: string): Promise<void> {
    await anubisIntegrationService.logActivity({
      module: 'SOVRA',
      activity_type: 'action_executed',
      user_id: userId,
      metadata: {
        threat_id: threatId,
        action_type: actionType,
        result,
        execution_timestamp: new Date().toISOString()
      },
      severity: result.includes('failed') ? 'error' : 'info',
      source_component: 'SovraActionEngine'
    });
  }
}

export const enhancedSovraConnector = new EnhancedSovraConnector();
