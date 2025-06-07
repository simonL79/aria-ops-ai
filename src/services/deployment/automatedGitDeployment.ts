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
    console.log('🔍 Validating GitHub API token...');
    
    // Test the Edge Function with a simple validation request
    const { data, error } = await supabase.functions.invoke('github-deployment', {
      body: {
        title: 'Token Validation Test',
        content: 'This is a validation test for GitHub API token',
        entity: 'System',
        keywords: ['validation'],
        contentType: 'validation'
      }
    });

    // Check for specific token errors
    if (error) {
      console.warn('❌ GitHub token validation failed - Edge Function error:', error);
      return false;
    }

    if (data && !data.success) {
      if (data.error && data.error.includes('GitHub API token')) {
        console.warn('❌ GitHub API token validation failed:', data.error);
        return false;
      }
      // Other errors might not be token-related
      console.log('⚠️ GitHub deployment test failed but may not be token issue:', data.error);
      return true; // Assume token is OK if error isn't token-specific
    }

    console.log('✅ GitHub API token validation successful');
    return true;
    
  } catch (error) {
    console.error('❌ GitHub token validation failed with exception:', error);
    return false;
  }
};
