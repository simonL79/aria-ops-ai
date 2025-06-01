
import { supabase } from '@/integrations/supabase/client';

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

export class DeploymentSchedulerService {
  
  /**
   * Save scheduled deployment to database using activity_logs table
   */
  static async saveScheduledDeployment(deployment: Omit<ScheduledDeployment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert({
          action: 'scheduled_deployment_created',
          entity_type: 'deployment_schedule',
          entity_id: deployment.entityName,
          details: JSON.stringify({
            name: deployment.name,
            frequency: deployment.frequency,
            time: deployment.time,
            platforms: deployment.platforms,
            articleCount: deployment.articleCount,
            status: deployment.status,
            nextRun: deployment.nextRun,
            lastRun: deployment.lastRun,
            keywords: deployment.keywords
          })
        })
        .select('id')
        .single();

      if (error) {
        console.error('Failed to save scheduled deployment:', error);
        return null;
      }

      return data?.id || null;
    } catch (error) {
      console.error('Error saving scheduled deployment:', error);
      return null;
    }
  }

  /**
   * Load all scheduled deployments from database
   */
  static async loadScheduledDeployments(): Promise<ScheduledDeployment[]> {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('action', 'scheduled_deployment_created')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load scheduled deployments:', error);
        return this.getDefaultSchedules();
      }

      if (!data || data.length === 0) {
        return this.getDefaultSchedules();
      }

      return data.map(log => {
        const details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details;
        return {
          id: log.id,
          name: details.name || 'Scheduled Deployment',
          frequency: details.frequency || 'daily',
          time: details.time || '09:00',
          platforms: details.platforms || ['github-pages', 'netlify'],
          articleCount: details.articleCount || 10,
          status: details.status || 'active',
          nextRun: details.nextRun || new Date().toISOString(),
          lastRun: details.lastRun || 'Never',
          entityName: log.entity_id || 'Unknown Entity',
          keywords: details.keywords || [],
          createdAt: log.created_at,
          updatedAt: log.updated_at
        };
      });
    } catch (error) {
      console.error('Error loading scheduled deployments:', error);
      return this.getDefaultSchedules();
    }
  }

  /**
   * Update scheduled deployment status
   */
  static async updateScheduledDeployment(id: string, updates: Partial<ScheduledDeployment>): Promise<boolean> {
    try {
      // Get current deployment data
      const { data: currentData, error: fetchError } = await supabase
        .from('activity_logs')
        .select('details')
        .eq('id', id)
        .single();

      if (fetchError || !currentData) {
        console.error('Failed to fetch current deployment data:', fetchError);
        return false;
      }

      const currentDetails = typeof currentData.details === 'string' 
        ? JSON.parse(currentData.details) 
        : currentData.details;

      // Merge updates with current data
      const updatedDetails = {
        ...currentDetails,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      const { error } = await supabase
        .from('activity_logs')
        .update({
          details: JSON.stringify(updatedDetails),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Failed to update scheduled deployment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating scheduled deployment:', error);
      return false;
    }
  }

  /**
   * Delete scheduled deployment
   */
  static async deleteScheduledDeployment(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Failed to delete scheduled deployment:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting scheduled deployment:', error);
      return false;
    }
  }

  /**
   * Calculate next run time based on frequency and time
   */
  static calculateNextRun(frequency: string, time: string): string {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    switch (frequency) {
      case 'hourly':
        const nextHour = new Date(now);
        nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
        return nextHour.toISOString();
        
      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(hours, minutes, 0, 0);
        return tomorrow.toISOString();
        
      case 'weekly':
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(hours, minutes, 0, 0);
        return nextWeek.toISOString();
        
      case 'monthly':
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setHours(hours, minutes, 0, 0);
        return nextMonth.toISOString();
        
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    }
  }

  /**
   * Get default schedules (fallback when database is empty)
   */
  private static getDefaultSchedules(): ScheduledDeployment[] {
    return [];
  }

  /**
   * Validate deployment data to prevent mock data
   */
  static validateDeploymentData(deployment: Partial<ScheduledDeployment>): { isValid: boolean; errors: string[] } {
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
