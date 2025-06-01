
export interface ScheduledDeployment {
  id: string;
  name: string;
  frequency: string;
  time: string;
  platforms: string[];
  articleCount: number;
  status: 'active' | 'paused';
  nextRun: string;
  lastRun: string;
  entityName: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
