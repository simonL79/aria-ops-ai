
import { supabase } from '@/integrations/supabase/client';

/**
 * Setup entity fingerprints using existing entities table
 */
export const setupEntityFingerprintsTable = async () => {
  try {
    // Check if entities table exists by trying to query it
    const { error } = await supabase
      .from('entities')
      .select('id')
      .limit(1);

    if (error && error.message.includes('does not exist')) {
      console.log('Entities table does not exist - this is expected for new installations');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking entities table:', error);
    return false;
  }
};

/**
 * Setup entity match stats using existing scan_results table
 */
export const setupEntityMatchStatsTable = async () => {
  try {
    const { error } = await supabase
      .from('scan_results')
      .select('id')
      .limit(1);

    if (error && error.message.includes('does not exist')) {
      console.log('Scan results table does not exist - this is expected for new installations');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking scan results table:', error);
    return false;
  }
};
