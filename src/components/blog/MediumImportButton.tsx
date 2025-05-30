
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const MediumImportButton = () => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    setIsImporting(true);
    
    try {
      console.log('Starting Medium import...');
      
      const { data, error } = await supabase.functions.invoke('import-medium-posts');
      
      if (error) {
        console.error('Import error:', error);
        throw error;
      }
      
      console.log('Import response:', data);
      
      if (data.skipped > 0) {
        toast.success(`Import completed: ${data.posts?.length || 0} new articles imported, ${data.skipped} already existed`);
      } else {
        toast.success(`Successfully imported ${data.posts?.length || 0} Medium articles`);
      }
      
      // Refresh the page to show new posts after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import Medium articles. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Button 
      onClick={handleImport} 
      disabled={isImporting}
      variant="outline"
      className="flex items-center gap-2"
    >
      {isImporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isImporting ? 'Importing...' : 'Import Medium Articles'}
    </Button>
  );
};

export default MediumImportButton;
