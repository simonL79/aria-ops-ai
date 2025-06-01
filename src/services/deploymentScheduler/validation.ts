
export class DeploymentValidation {
  static validateDeploymentData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim() === '') {
      errors.push('Name is required');
    }

    if (!data.entityName || data.entityName.trim() === '') {
      errors.push('Entity name is required');
    }

    if (!data.platforms || data.platforms.length === 0) {
      errors.push('At least one platform must be selected');
    }

    if (!data.articleCount || isNaN(data.articleCount) || data.articleCount < 1) {
      errors.push('Article count must be a valid number greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
