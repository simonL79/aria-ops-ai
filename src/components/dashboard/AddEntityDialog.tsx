
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddEntityDialogProps {
  clientId: string;
  onEntityAdded: () => void;
}

const AddEntityDialog = ({ clientId, onEntityAdded }: AddEntityDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [entityName, setEntityName] = useState('');
  const [entityType, setEntityType] = useState('');
  const [alias, setAlias] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!entityName.trim() || !entityType) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!clientId) {
      toast.error('No client selected');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Adding entity:', {
        client_id: clientId,
        entity_name: entityName.trim(),
        entity_type: entityType,
        alias: alias.trim() || null
      });

      // Use a more explicit insert structure to avoid trigger issues
      const insertData: any = {
        client_id: clientId,
        entity_name: entityName.trim(),
        entity_type: entityType
      };

      // Only add alias if it's not empty
      if (alias.trim()) {
        insertData.alias = alias.trim();
      }

      const { data, error } = await supabase
        .from('client_entities')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Error adding entity:', error);
        toast.error(`Failed to add entity: ${error.message}`);
        return;
      }

      console.log('Entity added successfully:', data);
      toast.success(`Entity "${entityName}" added successfully`);
      setOpen(false);
      setEntityName('');
      setEntityType('');
      setAlias('');
      onEntityAdded();
    } catch (error) {
      console.error('Error adding entity:', error);
      toast.error('An error occurred while adding the entity');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Entities
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Entity for Monitoring</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entityName">Entity Name *</Label>
            <Input
              id="entityName"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder="e.g., Company Name, Brand Name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="entityType">Entity Type *</Label>
            <Select value={entityType} onValueChange={setEntityType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="brand">Brand</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="person">Person</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="alias">Alias (Optional)</Label>
            <Input
              id="alias"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="e.g., Short name, nickname"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Entity'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntityDialog;
