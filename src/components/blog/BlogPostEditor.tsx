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
import type { BlogPost } from '@/types/blog';

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
    status: 'draft',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    medium_url: ''
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
        slug,
        meta_title: value || prev.meta_title, // Auto-fill meta title if empty
        meta_description: prev.meta_description || `${value.substring(0, 150)}...` // Auto-fill meta description if empty
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
            meta_title: formData.meta_title,
            meta_description: formData.meta_description,
            meta_keywords: formData.meta_keywords,
            medium_url: formData.medium_url,
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
            status: formData.status,
            meta_title: formData.meta_title,
            meta_description: formData.meta_description,
            meta_keywords: formData.meta_keywords,
            medium_url: formData.medium_url
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

        {/* SEO Meta Tags Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">SEO Meta Tags</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="meta_title">Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title || ''}
                onChange={(e) => handleInputChange('meta_title', e.target.value)}
                placeholder="SEO title (leave empty to use post title)"
                maxLength={60}
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
            </div>
            
            <div>
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description || ''}
                onChange={(e) => handleInputChange('meta_description', e.target.value)}
                placeholder="SEO meta description"
                rows={2}
                maxLength={160}
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
            </div>
            
            <div>
              <Label htmlFor="meta_keywords">Meta Keywords</Label>
              <Input
                id="meta_keywords"
                value={formData.meta_keywords || ''}
                onChange={(e) => handleInputChange('meta_keywords', e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
              <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
            </div>
          </div>
        </div>

        {/* Medium Article Link Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Medium Article Link</h3>
          
          <div>
            <Label htmlFor="medium_url">Medium Article URL</Label>
            <Input
              id="medium_url"
              value={formData.medium_url || ''}
              onChange={(e) => handleInputChange('medium_url', e.target.value)}
              placeholder="https://medium.com/@username/article-title"
            />
            <p className="text-xs text-gray-500 mt-1">Link to the original Medium article</p>
          </div>
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
