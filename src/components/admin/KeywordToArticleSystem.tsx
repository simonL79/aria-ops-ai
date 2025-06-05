
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Search, FileText, Brain, Zap } from 'lucide-react';
import ArticleGenerationTab from './keyword-system/ArticleGenerationTab';

const KeywordToArticleSystem = () => {
  const [selectedEntity, setSelectedEntity] = useState('');
  const [entities] = useState([
    'Simon Lindsay',
    'TechCorp Inc',
    'Global Solutions Ltd',
    'Innovation Partners'
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
            <Target className="h-8 w-8 text-corporate-accent" />
            A.R.I.A vX™ — Keyword-to-Article System
          </h1>
          <p className="text-corporate-lightGray mt-1">
            Real-time reputation reshaping engine with AI-powered content generation
          </p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          LIVE ENGINE
        </Badge>
      </div>

      {/* Entity Selection */}
      <Card className="bg-corporate-dark border-corporate-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="h-5 w-5 text-corporate-accent" />
            Entity Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {entities.map((entity) => (
              <Button
                key={entity}
                onClick={() => setSelectedEntity(entity)}
                variant={selectedEntity === entity ? "default" : "outline"}
                className={
                  selectedEntity === entity
                    ? "bg-corporate-accent text-black hover:bg-corporate-accent/90"
                    : "border-corporate-border text-corporate-lightGray hover:bg-corporate-darkSecondary"
                }
              >
                {entity}
              </Button>
            ))}
          </div>
          {selectedEntity && (
            <div className="mt-4 p-3 bg-corporate-accent/10 border border-corporate-accent/30 rounded-lg">
              <p className="text-corporate-accent font-medium">
                Selected Entity: {selectedEntity}
              </p>
              <p className="text-corporate-lightGray text-sm">
                AI engine will monitor and generate content for this entity
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main System Tabs */}
      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList className="grid grid-cols-4 bg-corporate-darkSecondary">
          <TabsTrigger value="monitoring" className="text-corporate-lightGray data-[state=active]:text-black data-[state=active]:bg-corporate-accent">
            Entity Monitoring
          </TabsTrigger>
          <TabsTrigger value="filtering" className="text-corporate-lightGray data-[state=active]:text-black data-[state=active]:bg-corporate-accent">
            CIA Filtering
          </TabsTrigger>
          <TabsTrigger value="narratives" className="text-corporate-lightGray data-[state=active]:text-black data-[state=active]:bg-corporate-accent">
            Counter-Narratives
          </TabsTrigger>
          <TabsTrigger value="articles" className="text-corporate-lightGray data-[state=active]:text-black data-[state=active]:bg-corporate-accent">
            Article Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring">
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Search className="h-5 w-5 text-corporate-accent" />
                Real-Time Entity Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
                <p className="text-corporate-lightGray">
                  {selectedEntity ? `Monitoring ${selectedEntity} across all platforms` : 'Select an entity to begin monitoring'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filtering">
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-corporate-accent" />
                CIA-Level Precision Filtering
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
                <p className="text-corporate-lightGray">
                  Advanced AI filtering to eliminate false positives and focus on genuine threats
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="narratives">
          <Card className="bg-corporate-dark border-corporate-border">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-corporate-accent" />
                Strategic Counter-Narratives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Zap className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
                <p className="text-corporate-lightGray">
                  AI-generated counter-narratives and strategic messaging for threat neutralization
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles">
          <ArticleGenerationTab entityName={selectedEntity} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeywordToArticleSystem;
