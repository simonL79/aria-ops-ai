
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AddLegacyPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostAdded: () => void;
}

const AddLegacyPostDialog = ({ open, onOpenChange, onPostAdded }: AddLegacyPostDialogProps) => {
  const [form, setForm] = useState({
    url: '',
    title: '',
    excerpt: '',
    source_domain: '',
    rank_score: 50,
    client_id: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.url || !form.title) {
      toast.error('URL and title are required');
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

      const { error } = await supabase.from('legacy_reputation_posts').insert({
        url: form.url,
        title: form.title,
        excerpt: form.excerpt,
        source_domain: form.source_domain || new URL(form.url).hostname,
        rank_score: form.rank_score,
        client_id: clientId,
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString()
      });

      if (error) throw error;
      
      toast.success('Legacy post added successfully');
      onPostAdded();
      onOpenChange(false);
      
      // Reset form
      setForm({
        url: '',
        title: '',
        excerpt: '',
        source_domain: '',
        rank_score: 50,
        client_id: ''
      });
    } catch (error) {
      console.error('Error adding legacy post:', error);
      toast.error('Failed to add legacy post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Legacy Reputation Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              value={form.url}
              onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://example.com/negative-post"
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Post title"
              required
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="Brief description of the post content"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="source_domain">Source Domain</Label>
            <Input
              id="source_domain"
              value={form.source_domain}
              onChange={(e) => setForm(prev => ({ ...prev, source_domain: e.target.value }))}
              placeholder="example.com (auto-detected from URL)"
            />
          </div>

          <div>
            <Label htmlFor="rank_score">Rank Score (1-100)</Label>
            <Select 
              value={form.rank_score.toString()} 
              onValueChange={(value) => setForm(prev => ({ ...prev, rank_score: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 - Low Impact</SelectItem>
                <SelectItem value="25">25 - Minor</SelectItem>
                <SelectItem value="50">50 - Moderate</SelectItem>
                <SelectItem value="75">75 - High Impact</SelectItem>
                <SelectItem value="90">90 - Critical</SelectItem>
              </SelectContent>
            </Select>
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
              {loading ? 'Adding...' : 'Add Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLegacyPostDialog;
