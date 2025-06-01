
import { DeploymentDatabase } from './deploymentScheduler/database';
import { DeploymentValidation } from './deploymentScheduler/validation';
import { DeploymentScheduler as Scheduler } from './deploymentScheduler/scheduler';

export type { ScheduledDeployment, ValidationResult } from './deploymentScheduler/types';

export class DeploymentSchedulerService {
  // Database operations
  static saveScheduledDeployment = DeploymentDatabase.saveScheduledDeployment;
  static loadScheduledDeployments = DeploymentDatabase.loadScheduledDeployments;
  static updateScheduledDeployment = DeploymentDatabase.updateScheduledDeployment;
  static deleteScheduledDeployment = DeploymentDatabase.deleteScheduledDeployment;

  // Validation
  static validateDeploymentData = DeploymentValidation.validateDeploymentData;

  // Scheduling
  static calculateNextRun = Scheduler.calculateNextRun;
}
