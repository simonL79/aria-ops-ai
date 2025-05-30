
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  status: 'draft' | 'published';
}

interface BlogPostEditorProps {
  post?: BlogPost | null;
  onCancel: () => void;
  onSave: () => void;
}

const BlogPostEditor = ({ post, onCancel, onSave }: BlogPostEditorProps) => {
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    description: '',
    content: '',
    author: 'Simon Lindsay',
    date: new Date().toISOString().split('T')[0],
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
    category: 'Technology',
    status: 'draft'
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData(post);
    }
  }, [post]);

  const handleInputChange = (field: keyof BlogPost, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from title
    if (field === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Please fill in title and content');
      return;
    }

    setIsSaving(true);

    try {
      console.log('Saving blog post:', formData);

      if (post?.id) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            content: formData.content,
            author: formData.author,
            date: formData.date,
            image: formData.image,
            category: formData.category,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', post.id);

        if (error) {
          console.error('Error updating blog post:', error);
          toast.error('Failed to update blog post');
          return;
        }

        toast.success('Blog post updated successfully');
      } else {
        // Create new post
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            title: formData.title,
            slug: formData.slug,
            description: formData.description,
            content: formData.content,
            author: formData.author,
            date: formData.date,
            image: formData.image,
            category: formData.category,
            status: formData.status
          });

        if (error) {
          console.error('Error creating blog post:', error);
          toast.error('Failed to create blog post');
          return;
        }

        toast.success('Blog post created successfully');
      }

      onSave();
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {post ? 'Edit Post' : 'Create New Post'}
        </CardTitle>
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Post title"
            />
          </div>
          
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              placeholder="post-slug"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of the post"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Write your blog post content here..."
            rows={10}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Leadership">Leadership</SelectItem>
                <SelectItem value="Strategy">Strategy</SelectItem>
                <SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem>
                <SelectItem value="White Paper">White Paper</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as 'draft' | 'published')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="image">Cover Image URL</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => handleInputChange('image', e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleSave} 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Post'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostEditor;
