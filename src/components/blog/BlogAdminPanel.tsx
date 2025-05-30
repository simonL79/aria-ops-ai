
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlogPostEditor from './BlogPostEditor';
import BlogPostsList from './BlogPostsList';
import BulkArticleImport from './BulkArticleImport';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const BlogAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleEditPost = (post) => {
    setEditingPost(post);
    setIsCreatingPost(true);
    setActiveTab('editor');
  };
  
  const handleCreateNewPost = () => {
    setEditingPost(null);
    setIsCreatingPost(true);
    setActiveTab('editor');
  };
  
  const handleBackToPosts = () => {
    setIsCreatingPost(false);
    setEditingPost(null);
    setActiveTab('posts');
    // Trigger refresh of posts list
    setRefreshKey(prev => prev + 1);
  };

  const handleArticlesAdded = () => {
    // Refresh the posts list and switch to posts tab
    setRefreshKey(prev => prev + 1);
    setActiveTab('posts');
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Blog Management</h2>
          
          {!isCreatingPost && (
            <Button onClick={handleCreateNewPost} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          )}
        </div>
        
        {isCreatingPost ? (
          <BlogPostEditor 
            post={editingPost} 
            onCancel={handleBackToPosts}
            onSave={handleBackToPosts}
          />
        ) : (
          <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="posts">All Posts</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="bulk-import">Copy & Paste</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <BlogPostsList key={`posts-${refreshKey}`} onEditPost={handleEditPost} filter="all" />
            </TabsContent>
            
            <TabsContent value="drafts">
              <BlogPostsList key={`drafts-${refreshKey}`} onEditPost={handleEditPost} filter="draft" />
            </TabsContent>
            
            <TabsContent value="published">
              <BlogPostsList key={`published-${refreshKey}`} onEditPost={handleEditPost} filter="published" />
            </TabsContent>

            <TabsContent value="bulk-import">
              <BulkArticleImport onArticlesAdded={handleArticlesAdded} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogAdminPanel;
