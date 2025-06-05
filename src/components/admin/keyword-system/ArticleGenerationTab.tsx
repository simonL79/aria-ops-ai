import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, FileText, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { KeywordCIAIntegration } from '@/services/intelligence/keywordCIAIntegration';
import { LiveDataEnforcer } from '@/services/ariaCore/liveDataEnforcer';

const ArticleGenerationTab = () => {
  const [selectedEntity, setSelectedEntity] = useState('');
  const [keyword, setKeyword] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [generatedContent, setGeneratedContent] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleAddKeyword = () => {
    if (keyword.trim() && !keywords.includes(keyword.trim())) {
      setKeywords([...keywords, keyword.trim()]);
      setKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  const handleAnalyzeKeywords = async () => {
    if (!selectedEntity || keywords.length === 0) {
      toast.error('Please select an entity and add keywords');
      return;
    }

    setAnalyzing(true);
    setResults([]);

    try {
      // MANDATORY: Validate live data compliance before proceeding
      const compliance = await LiveDataEnforcer.validateLiveDataCompliance();
      if (!compliance.isCompliant) {
        toast.error('Live data compliance failed - analysis blocked');
        return;
      }

      const analysisResults = await KeywordCIAIntegration.executeKeywordCIAAnalysis({
        keywords,
        entityName: selectedEntity,
        precisionMode: 'high',
        liveDataOnly: true,
        blockSimulations: true,
        source: 'article_generation_tab'
      });

      setResults(analysisResults);

      if (analysisResults.length > 0) {
        toast.success(`Analysis complete: ${analysisResults.length} keyword results processed`);
      } else {
        toast.info('No results found for the provided keywords');
      }

    } catch (error) {
      console.error('Keyword analysis failed:', error);
      if (error.message.includes('simulation') || error.message.includes('blocked')) {
        toast.error('Analysis blocked: Simulation data detected');
      } else {
        toast.error('Analysis failed - please try again');
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateArticle = async () => {
    if (results.length === 0) {
      toast.error('Please analyze keywords first');
      return;
    }

    setGenerating(true);
    try {
      // Simulate article generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate sample content based on keywords and entity
      const sampleContent = `
# ${selectedEntity}: Industry Analysis

## Overview
${selectedEntity} has been a significant player in the industry, with particular focus on ${keywords.join(', ')}.

## Key Findings
${results.map(r => `- ${r.keyword}: ${r.recommendations[0]}`).join('\n')}

## Recommendations
Based on our analysis, we recommend the following strategies:
${results.map(r => `- For "${r.keyword}": ${r.recommendations[1] || 'Develop a comprehensive strategy'}`).join('\n')}

## Conclusion
Continued monitoring of ${keywords.join(', ')} will be essential for ${selectedEntity}'s market position.
      `;
      
      setGeneratedContent(sampleContent);
      toast.success('Article generated successfully');
    } catch (error) {
      console.error('Article generation failed:', error);
      toast.error('Failed to generate article');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyword to Article Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Entity Name</label>
            <Input 
              placeholder="Enter entity name" 
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Keywords</label>
            <div className="flex gap-2">
              <Input 
                placeholder="Add keyword" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
              <Button onClick={handleAddKeyword}>Add</Button>
            </div>
            
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((kw) => (
                  <Badge key={kw} variant="secondary" className="px-2 py-1">
                    {kw}
                    <button 
                      className="ml-2 text-xs" 
                      onClick={() => handleRemoveKeyword(kw)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleAnalyzeKeywords} 
            disabled={analyzing || !selectedEntity || keywords.length === 0}
            className="w-full"
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Keywords
              </>
            )}
          </Button>
          
          {results.length > 0 && (
            <div className="mt-4 border rounded-md p-4">
              <h3 className="text-lg font-medium mb-2">Analysis Results</h3>
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="border-b pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{result.keyword}</span>
                      <Badge variant={result.precision_score > 0.7 ? "default" : "outline"}>
                        {Math.round(result.precision_score * 100)}% precision
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {result.recommendations[0]}
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={handleGenerateArticle} 
                className="w-full mt-4"
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Article
                  </>
                )}
              </Button>
            </div>
          )}
          
          {generatedContent && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2 flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Generated Article
              </h3>
              <div className="border rounded-md p-4 bg-muted/30">
                <Textarea 
                  value={generatedContent} 
                  className="min-h-[300px] font-mono text-sm"
                  readOnly
                />
              </div>
              <div className="flex items-center mt-2 p-2 bg-yellow-50 text-yellow-800 rounded-md">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="text-xs">
                  This is AI-generated content based on keyword analysis. Review for accuracy before publishing.
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleGenerationTab;
