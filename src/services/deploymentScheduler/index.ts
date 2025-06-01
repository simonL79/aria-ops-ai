
import { DeploymentDatabase } from './database';
import { DeploymentValidation } from './validation';
import { DeploymentScheduler } from './scheduler';

export type { ScheduledDeployment, ValidationResult } from './types';

export class DeploymentSchedulerService {
  // Database operations
  static saveScheduledDeployment = DeploymentDatabase.saveScheduledDeployment;
  static loadScheduledDeployments = DeploymentDatabase.loadScheduledDeployments;
  static updateScheduledDeployment = DeploymentDatabase.updateScheduledDeployment;
  static deleteScheduledDeployment = DeploymentDatabase.deleteScheduledDeployment;

  // Validation
  static validateDeploymentData = DeploymentValidation.validateDeploymentData;

  // Scheduling
  static calculateNextRun = DeploymentScheduler.calculateNextRun;
}
