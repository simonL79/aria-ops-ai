
import { anubisIntegrationService } from './anubisIntegrationService';

class EnhancedEmergencyConnector {
  async logThreatDetected(threat: any, userId?: string): Promise<void> {
    await anubisIntegrationService.logEmergencyStrike(threat.id, 'threat_detected', userId);
    
    await anubisIntegrationService.logActivity({
      action: 'threat_detected',
      details: JSON.stringify({
        threat_id: threat.id,
        threat_type: threat.threat_type,
        risk_level: threat.risk_level,
        description: threat.threat_description,
        origin_url: threat.origin_url
      }),
      entity_type: 'threat',
      entity_id: threat.id,
      user_id: userId
    });
  }

  async logStrikePlanned(threatId: string, planId: string, actionType: string, userId?: string): Promise<void> {
    await anubisIntegrationService.logActivity({
      action: 'strike_planned',
      details: JSON.stringify({
        threat_id: threatId,
        plan_id: planId,
        action_type: actionType,
        planning_timestamp: new Date().toISOString()
      }),
      entity_type: 'threat',
      entity_id: threatId,
      user_id: userId
    });
  }

  async logStrikeExecuted(threatId: string, result: string, userId?: string): Promise<void> {
    await anubisIntegrationService.logEmergencyStrike(threatId, 'strike_executed', userId);
    
    await anubisIntegrationService.logActivity({
      action: 'strike_executed',
      details: JSON.stringify({
        threat_id: threatId,
        execution_result: result,
        execution_timestamp: new Date().toISOString()
      }),
      entity_type: 'threat',
      entity_id: threatId,
      user_id: userId
    });
  }

  async logAdminConfirmation(threatId: string, adminId: string, reason: string): Promise<void> {
    await anubisIntegrationService.logActivity({
      action: 'admin_confirmation',
      details: JSON.stringify({
        threat_id: threatId,
        confirmation_reason: reason,
        admin_authorization: true
      }),
      entity_type: 'threat',
      entity_id: threatId,
      user_id: adminId
    });
  }
}

export const enhancedEmergencyConnector = new EnhancedEmergencyConnector();
