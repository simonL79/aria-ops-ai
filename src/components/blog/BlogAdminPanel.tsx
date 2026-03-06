
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BlogPostEditor from './BlogPostEditor';
import BlogPostsList from './BlogPostsList';
import BulkArticleImport from './BulkArticleImport';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const BlogAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleBackToPosts = () => {
    setIsEditing(false);
    setActiveTab('posts');
    setRefreshKey(prev => prev + 1);
  };

  const handleArticlesAdded = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('posts');
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Blog Management</h2>
          {!isEditing && (
            <Button onClick={() => { setIsEditing(true); setActiveTab('sync'); }} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Settings
            </Button>
          )}
        </div>
        
        {isEditing ? (
          <BlogPostEditor 
            onCancel={handleBackToPosts}
            onSave={handleBackToPosts}
          />
        ) : (
          <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="posts">All Posts</TabsTrigger>
              <TabsTrigger value="sync">Sync</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              <BlogPostsList key={`posts-${refreshKey}`} onEditPost={() => {}} filter="all" />
            </TabsContent>

            <TabsContent value="sync">
              <BulkArticleImport onArticlesAdded={handleArticlesAdded} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogAdminPanel;
