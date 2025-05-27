
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddMemoryFootprintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFootprintAdded: () => void;
}

const AddMemoryFootprintDialog = ({ open, onOpenChange, onFootprintAdded }: AddMemoryFootprintDialogProps) => {
  const [form, setForm] = useState({
    content_url: '',
    memory_type: '',
    memory_context: '',
    ai_memory_tags: '',
    first_seen: '',
    last_seen: '',
    client_id: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.content_url || !form.memory_type) {
      toast.error('URL and memory type are required');
      return;
    }

    setLoading(true);
    try {
      // Get first available client if not specified
      let clientId = form.client_id;
      if (!clientId) {
        const { data: clients } = await supabase.from('clients').select('id').limit(1);
        if (clients && clients.length > 0) {
          clientId = clients[0].id;
        }
      }

      const { error } = await supabase.from('memory_footprints').insert({
        content_url: form.content_url,
        memory_type: form.memory_type,
        memory_context: form.memory_context,
        ai_memory_tags: form.ai_memory_tags ? form.ai_memory_tags.split(',').map(tag => tag.trim()) : [],
        first_seen: form.first_seen ? new Date(form.first_seen).toISOString() : null,
        last_seen: form.last_seen ? new Date(form.last_seen).toISOString() : null,
        client_id: clientId,
        discovered_at: new Date().toISOString()
      });

      if (error) throw error;
      
      toast.success('Memory footprint added successfully');
      onFootprintAdded();
      onOpenChange(false);
      
      // Reset form
      setForm({
        content_url: '',
        memory_type: '',
        memory_context: '',
        ai_memory_tags: '',
        first_seen: '',
        last_seen: '',
        client_id: ''
      });
    } catch (error) {
      console.error('Error adding memory footprint:', error);
      toast.error('Failed to add memory footprint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Memory Footprint</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="content_url">Content URL *</Label>
            <Input
              id="content_url"
              type="url"
              value={form.content_url}
              onChange={(e) => setForm(prev => ({ ...prev, content_url: e.target.value }))}
              placeholder="https://example.com/content"
              required
            />
          </div>

          <div>
            <Label htmlFor="memory_type">Memory Type *</Label>
            <Select 
              value={form.memory_type} 
              onValueChange={(value) => setForm(prev => ({ ...prev, memory_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select memory type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="search_suggestion">Search Suggestion</SelectItem>
                <SelectItem value="forum_cache">Forum Cache</SelectItem>
                <SelectItem value="archive_snapshot">Archive Snapshot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="memory_context">Memory Context</Label>
            <Textarea
              id="memory_context"
              value={form.memory_context}
              onChange={(e) => setForm(prev => ({ ...prev, memory_context: e.target.value }))}
              placeholder="Describe the context and significance of this memory footprint"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="ai_memory_tags">AI Memory Tags</Label>
            <Input
              id="ai_memory_tags"
              value={form.ai_memory_tags}
              onChange={(e) => setForm(prev => ({ ...prev, ai_memory_tags: e.target.value }))}
              placeholder="tag1, tag2, tag3"
            />
            <p className="text-xs text-muted-foreground mt-1">Separate tags with commas</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_seen">First Seen</Label>
              <Input
                id="first_seen"
                type="date"
                value={form.first_seen}
                onChange={(e) => setForm(prev => ({ ...prev, first_seen: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="last_seen">Last Seen</Label>
              <Input
                id="last_seen"
                type="date"
                value={form.last_seen}
                onChange={(e) => setForm(prev => ({ ...prev, last_seen: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding...' : 'Add Footprint'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemoryFootprintDialog;
