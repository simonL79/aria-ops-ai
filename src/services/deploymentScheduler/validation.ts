
import { ScheduledDeployment, ValidationResult } from './types';

export class DeploymentValidation {
  static validateDeploymentData(deployment: Partial<ScheduledDeployment>): ValidationResult {
    const errors: string[] = [];

    if (!deployment.name || deployment.name.trim().length === 0) {
      errors.push('Deployment name is required');
    }

    if (!deployment.entityName || deployment.entityName.trim().length === 0) {
      errors.push('Entity name is required');
    }

    if (!deployment.platforms || deployment.platforms.length === 0) {
      errors.push('At least one platform must be selected');
    }

    if (!deployment.frequency) {
      errors.push('Frequency is required');
    }

    if (!deployment.time) {
      errors.push('Time is required');
    }

    if (deployment.articleCount && (deployment.articleCount < 1 || deployment.articleCount > 100)) {
      errors.push('Article count must be between 1 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
