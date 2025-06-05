
import { supabase } from '@/integrations/supabase/client';

/**
 * Setup entity fingerprints table if it doesn't exist
 */
export const setupEntityFingerprintsTable = async () => {
  try {
    // Check if table exists by trying to query it
    const { error } = await supabase
      .from('entity_fingerprints')
      .select('id')
      .limit(1);

    if (error && error.message.includes('does not exist')) {
      console.log('Entity fingerprints table does not exist - this is expected for new installations');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking entity fingerprints table:', error);
    return false;
  }
};

/**
 * Setup entity match stats table if it doesn't exist
 */
export const setupEntityMatchStatsTable = async () => {
  try {
    const { error } = await supabase
      .from('entity_match_stats')
      .select('id')
      .limit(1);

    if (error && error.message.includes('does not exist')) {
      console.log('Entity match stats table does not exist - this is expected for new installations');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking entity match stats table:', error);
    return false;
  }
};
