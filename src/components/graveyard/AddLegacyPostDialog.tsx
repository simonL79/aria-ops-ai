
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AddLegacyPostDialog = ({ onPostAdded }: { onPostAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    content_snippet: '',
    platform: '',
    rank_score: 50,
    suppression_status: 'pending'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('graveyard_legacy_posts')
        .insert([{
          ...formData,
          rank_score: parseInt(formData.rank_score.toString()),
        }]);

      if (error) throw error;

      toast.success('Legacy post added successfully');
      setOpen(false);
      setFormData({
        title: '',
        url: '',
        content_snippet: '',
        platform: '',
        rank_score: 50,
        suppression_status: 'pending'
      });
      onPostAdded();
    } catch (error) {
      console.error('Error adding legacy post:', error);
      toast.error('Failed to add legacy post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Legacy Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Legacy Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="platform">Platform</Label>
            <Input
              id="platform"
              value={formData.platform}
              onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content_snippet">Content Snippet</Label>
            <Textarea
              id="content_snippet"
              value={formData.content_snippet}
              onChange={(e) => setFormData(prev => ({ ...prev, content_snippet: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="rank_score">Rank Score (1-100)</Label>
            <Input
              id="rank_score"
              type="number"
              min="1"
              max="100"
              value={formData.rank_score}
              onChange={(e) => setFormData(prev => ({ ...prev, rank_score: parseInt(e.target.value) }))}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Legacy Post'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLegacyPostDialog;
