
import { ScheduledDeployment, ValidationResult } from './types';

export class DeploymentValidation {
  /**
   * Validate deployment data to prevent mock data
   */
  static validateDeploymentData(deployment: Partial<ScheduledDeployment>): ValidationResult {
    const errors: string[] = [];
    
    // Check for mock data indicators
    if (deployment.entityName) {
      const name = deployment.entityName.toLowerCase();
      if (name.includes('test') || name.includes('mock') || name.includes('demo') || name.includes('sample')) {
        errors.push('Entity name contains mock data indicators (test, mock, demo, sample)');
      }
    }

    if (deployment.keywords) {
      const keywordString = deployment.keywords.join(' ').toLowerCase();
      if (keywordString.includes('test') || keywordString.includes('mock') || keywordString.includes('demo')) {
        errors.push('Keywords contain mock data indicators');
      }
    }

    if (deployment.name) {
      const nameString = deployment.name.toLowerCase();
      if (nameString.includes('test') || nameString.includes('mock') || nameString.includes('demo')) {
        errors.push('Schedule name contains mock data indicators');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
