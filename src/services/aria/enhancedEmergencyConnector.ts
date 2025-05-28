
import { anubisIntegrationService } from './anubisIntegrationService';

class EnhancedEmergencyConnector {
  async logThreatDetected(threat: any, userId?: string): Promise<void> {
    await anubisIntegrationService.logEmergencyStrike(threat.id, 'threat_detected', userId);
    
    await anubisIntegrationService.logActivity({
      module: 'EMERGENCY_STRIKE',
      activity_type: 'threat_detected',
      user_id: userId,
      metadata: {
        threat_id: threat.id,
        threat_type: threat.threat_type,
        risk_level: threat.risk_level,
        description: threat.threat_description,
        origin_url: threat.origin_url
      },
      severity: threat.risk_level === 'critical' ? 'critical' : 'warning',
      source_component: 'EmergencyThreatDetector'
    });
  }

  async logStrikePlanned(threatId: string, planId: string, actionType: string, userId?: string): Promise<void> {
    await anubisIntegrationService.logActivity({
      module: 'EMERGENCY_STRIKE',
      activity_type: 'strike_planned',
      user_id: userId,
      metadata: {
        threat_id: threatId,
        plan_id: planId,
        action_type: actionType,
        planning_timestamp: new Date().toISOString()
      },
      severity: 'warning',
      source_component: 'EmergencyStrikePlanner'
    });
  }

  async logStrikeExecuted(threatId: string, result: string, userId?: string): Promise<void> {
    await anubisIntegrationService.logEmergencyStrike(threatId, 'strike_executed', userId);
    
    await anubisIntegrationService.logActivity({
      module: 'EMERGENCY_STRIKE',
      activity_type: 'strike_executed',
      user_id: userId,
      metadata: {
        threat_id: threatId,
        execution_result: result,
        execution_timestamp: new Date().toISOString()
      },
      severity: 'critical',
      source_component: 'EmergencyStrikeExecutor'
    });
  }

  async logAdminConfirmation(threatId: string, adminId: string, reason: string): Promise<void> {
    await anubisIntegrationService.logActivity({
      module: 'EMERGENCY_STRIKE',
      activity_type: 'admin_confirmation',
      user_id: adminId,
      metadata: {
        threat_id: threatId,
        confirmation_reason: reason,
        admin_authorization: true
      },
      severity: 'critical',
      source_component: 'EmergencyAdminInterface'
    });
  }
}

export const enhancedEmergencyConnector = new EnhancedEmergencyConnector();
