
import { supabase } from '@/integrations/supabase/client';
import { ScheduledDeployment } from './types';

export class DeploymentDatabase {
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
        return [];
      }

      if (!data || data.length === 0) {
        return [];
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
      return [];
    }
  }

  /**
   * Update scheduled deployment status
   */
  static async updateScheduledDeployment(id: string, updates: Partial<ScheduledDeployment>): Promise<boolean> {
    try {
      console.log('Updating deployment:', id, 'with updates:', updates);
      
      // Get current deployment data
      const { data: currentData, error: fetchError } = await supabase
        .from('activity_logs')
        .select('details, entity_id')
        .eq('id', id)
        .single();

      if (fetchError || !currentData) {
        console.error('Failed to fetch current deployment data:', fetchError);
        return false;
      }

      const currentDetails = typeof currentData.details === 'string' 
        ? JSON.parse(currentData.details) 
        : currentData.details;

      // Merge updates with current data - ensure status is properly updated
      const updatedDetails = {
        ...currentDetails,
        ...updates,
        // Explicitly update the status if provided
        ...(updates.status && { status: updates.status }),
        updatedAt: new Date().toISOString()
      };

      console.log('Current details:', currentDetails);
      console.log('Updated details:', updatedDetails);

      // Update the record with explicit status handling
      const { data: updateResult, error: updateError } = await supabase
        .from('activity_logs')
        .update({
          details: JSON.stringify(updatedDetails),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (updateError) {
        console.error('Failed to update scheduled deployment:', updateError);
        return false;
      }

      console.log('Successfully updated deployment in database:', updateResult);
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
}
