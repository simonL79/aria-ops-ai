
import { supabase } from '@/integrations/supabase/client';

interface DeploymentParams {
  title: string;
  content: string;
  entity: string;
  keywords: string[];
  contentType: string;
}

interface DeploymentResult {
  success: boolean;
  url?: string;
  repositoryName?: string;
  repositoryUrl?: string;
  error?: string;
}

export const deployToGitHubPages = async (params: DeploymentParams): Promise<DeploymentResult> => {
  try {
    console.log('🚀 Starting secure GitHub Pages deployment via Edge Function...');
    
    // Call the Edge Function which has secure access to the GitHub API token
    const { data, error } = await supabase.functions.invoke('github-deployment', {
      body: params
    });

    if (error) {
      console.error('❌ Edge Function error:', error);
      return {
        success: false,
        error: `Deployment failed: ${error.message}`,
      };
    }

    if (!data.success) {
      console.error('❌ Deployment failed:', data.error);
      return {
        success: false,
        error: data.error || 'Unknown deployment error',
      };
    }

    console.log('✅ GitHub Pages deployment successful:', data.url);
    return data;

  } catch (error) {
    console.error('❌ GitHub deployment failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown deployment error',
    };
  }
};

export const validateGitHubToken = async (): Promise<boolean> => {
  try {
    // Test the Edge Function to validate GitHub token
    const { data, error } = await supabase.functions.invoke('github-deployment', {
      body: {
        title: 'Test',
        content: 'Test validation',
        entity: 'Test',
        keywords: ['test'],
        contentType: 'test'
      }
    });

    // If we get a specific error about missing token, return false
    if (error || (data && !data.success && data.error?.includes('GitHub API token'))) {
      console.warn('GitHub API token validation failed');
      return false;
    }

    return true;
  } catch (error) {
    console.error('GitHub token validation failed:', error);
    return false;
  }
};
