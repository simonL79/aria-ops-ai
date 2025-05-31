
import { anubisIntegrationService } from './anubisIntegrationService';
import { sovraService } from '../sovra/sovraService';

class EnhancedSovraConnector {
  async logThreatDetection(threat: any, userId?: string): Promise<void> {
    await anubisIntegrationService.logActivity({
      action: 'threat_detected',
      details: JSON.stringify({
        threat_type: threat.type,
        risk_score: threat.score,
        platform: threat.platform,
        identity: threat.identity
      }),
      entity_type: 'threat',
      user_id: userId
    });
  }

  async logAdminDecision(threatId: string, approved: boolean, comment: string, userId?: string): Promise<void> {
    await anubisIntegrationService.logSovraDecision(threatId, approved ? 'approved' : 'rejected', 1.0, userId);
    
    await anubisIntegrationService.logActivity({
      action: 'admin_decision',
      details: JSON.stringify({
        threat_id: threatId,
        decision: approved ? 'approved' : 'rejected',
        comment,
        admin_action: true
      }),
      entity_type: 'threat',
      entity_id: threatId,
      user_id: userId
    });
  }

  async logActionExecution(threatId: string, actionType: string, result: string, userId?: string): Promise<void> {
    await anubisIntegrationService.logActivity({
      action: 'action_executed',
      details: JSON.stringify({
        threat_id: threatId,
        action_type: actionType,
        result,
        execution_timestamp: new Date().toISOString()
      }),
      entity_type: 'threat',
      entity_id: threatId,
      user_id: userId
    });
  }
}

export const enhancedSovraConnector = new EnhancedSovraConnector();
