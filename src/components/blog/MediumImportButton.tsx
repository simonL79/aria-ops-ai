
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const MediumImportButton = () => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    setIsImporting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('import-medium-posts');
      
      if (error) throw error;
      
      toast.success(`Successfully imported ${data.posts?.length || 0} Medium articles`);
      
      // Refresh the page to show new posts
      window.location.reload();
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import Medium articles');
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
