import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Search, 
  Globe, 
  ArrowUpRight, 
  Plus,
  Loader,
  CheckCircle,
  CircleSlash,
  Clock,
  ScrollText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { SeoContent } from "@/types/dashboard";
import { generateSeoContent } from "@/services/openaiService";

import { storeSecureKey, getSecureKey, hasValidKey } from "@/utils/secureKeyStorage";

const DEMO_CONTENT: SeoContent[] = [
  {
    id: "seo-1",
    title: "How to Improve Your Brand's Online Reputation",
    keywords: ["brand reputation", "online reputation", "reputation management"],
    status: "published",
    dateCreated: "2023-05-12",
    publishDate: "2023-05-15",
    url: "https://yourbrand.com/blog/improve-online-reputation",
    score: 87,
    type: "blog",
    date: "2023-05-12"
  },
  {
    id: "seo-2",
    title: "Understanding Customer Feedback: A Brand's Guide",
    keywords: ["customer feedback", "brand management", "customer satisfaction"],
    status: "optimizing",
    dateCreated: "2023-06-01",
    score: 72,
    type: "article",
    date: "2023-06-01"
  },
  {
    id: "seo-3",
    title: "Top 10 Reputation Management Strategies for 2023",
    keywords: ["reputation strategies", "reputation management", "brand protection"],
    status: "draft",
    dateCreated: "2023-06-10",
    type: "press",
    date: "2023-06-10"
  }
];

const SeoSuppressionPipeline = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [seoContent, setSeoContent] = useState<SeoContent[]>(DEMO_CONTENT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyMasked, setApiKeyMasked] = useState<boolean>(hasValidKey('openai_api_key'));
  
  // Form states
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [wordCount, setWordCount] = useState("1000");
  const [generatedContent, setGeneratedContent] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  
  // Status tracking
  const publishedCount = seoContent.filter(c => c.status === "published").length;
  const draftCount = seoContent.filter(c => c.status === "draft").length;
  const optimizingCount = seoContent.filter(c => c.status === "optimizing").length;
  
  // Check for existing API key when component loads
  useEffect(() => {
    // If we have a key in secure storage, show that it's masked
    if (hasValidKey('openai_api_key')) {
      setApiKeyMasked(true);
    }
  }, []); 
  
  const handleGenerateContent = async () => {
    if (!keywords.trim()) {
      toast.error("Please enter at least one keyword");
      return;
    }
    
    // Save API key if provided
    if (apiKey) {
      storeSecureKey('openai_api_key', apiKey, 60); // Store for 60 minutes
      setApiKey('');
      setApiKeyMasked(true);
    }
    
    // Check if we have a key after attempting to save
    if (!hasValidKey('openai_api_key')) {
      toast.error("Please enter an OpenAI API key");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const mainKeyword = keywords.split(",")[0].trim();
      
      const result = await generateSeoContent(
        mainKeyword,
        title,
        parseInt(wordCount)
      );
      
      setTitle(result.title);
      setGeneratedContent(result.content);
      toast.success("SEO content generated successfully");
      
      // Add to drafts
      const newContent: SeoContent = {
        id: `seo-${Date.now()}`,
        title: result.title,
        keywords: keywords.split(",").map(k => k.trim()),
        status: "draft",
        dateCreated: new Date().toISOString().split("T")[0],
        type: "blog",
        date: new Date().toISOString().split("T")[0]
      };
      
      setSeoContent([newContent, ...seoContent]);
      setActiveTab("content");
      
    } catch (error) {
      console.error("Error generating SEO content:", error);
      toast.error("Failed to generate SEO content");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleOptimize = (id: string) => {
    setSeoContent(seoContent.map(item => 
      item.id === id ? {...item, status: "optimizing", score: 72} : item
    ));
    
    toast.success("Content sent for optimization", {
      description: "This process typically takes 5-10 minutes"
    });
    
    // Simulate optimization completion after delay
    setTimeout(() => {
      setSeoContent(seoContent.map(item => 
        item.id === id ? {...item, status: "optimizing", score: 85} : item
      ));
      
      toast.success("Content optimization complete", {
        description: "Content score improved to 85"
      });
    }, 8000);
  };
  
  const handlePublish = (id: string) => {
    const mockUrl = `https://yourbrand.com/blog/${id.replace("seo-", "")}`;
    
    setSeoContent(seoContent.map(item => 
      item.id === id ? {
        ...item, 
        status: "published", 
        publishDate: new Date().toISOString().split("T")[0],
        url: mockUrl
      } : item
    ));
    
    toast.success("Content published successfully", {
      description: `Published to ${mockUrl}`
    });
  };
  
  const handleIndex = (id: string) => {
    toast.success("Content submitted for indexing", {
      description: "Submitted to Google Search Console and other search engines"
    });
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "draft":
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded flex items-center"><Clock className="w-3 h-3 mr-1" />Draft</span>;
      case "optimizing":
        return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center"><Search className="w-3 h-3 mr-1" />Optimizing</span>;
      case "published":
        return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center"><CheckCircle className="w-3 h-3 mr-1" />Published</span>;
      case "indexed":
        return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded flex items-center"><Globe className="w-3 h-3 mr-1" />Indexed</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{status}</span>;
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">SEO Suppression Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="content">Content Library</TabsTrigger>
            <TabsTrigger value="targets">Target URLs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <div className="text-2xl font-bold">{publishedCount}</div>
                  <div className="text-xs text-muted-foreground">Published Content</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <div className="text-2xl font-bold">{draftCount}</div>
                  <div className="text-xs text-muted-foreground">Draft Content</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md text-center">
                  <div className="text-2xl font-bold">{optimizingCount}</div>
                  <div className="text-xs text-muted-foreground">Optimizing</div>
                </div>
              </div>
              
              <h3 className="text-sm font-medium mt-2">How It Works</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 border-l-2 border-gray-200 pl-3">
                  <div className="bg-gray-100 rounded-full p-1 mt-1">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">1. Generate</div>
                    <div className="text-muted-foreground text-xs">
                      Automatically create SEO-optimized content around target keywords
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 border-l-2 border-gray-200 pl-3">
                  <div className="bg-gray-100 rounded-full p-1 mt-1">
                    <Search className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">2. Optimize</div>
                    <div className="text-muted-foreground text-xs">
                      Enhance content using advanced SEO algorithms for maximum ranking potential
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 border-l-2 border-gray-200 pl-3">
                  <div className="bg-gray-100 rounded-full p-1 mt-1">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">3. Publish</div>
                    <div className="text-muted-foreground text-xs">
                      Push content to your blog or microsites with a single click
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-gray-100 rounded-full p-1 mt-1">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">4. Index</div>
                    <div className="text-muted-foreground text-xs">
                      Submit to search engines and track ranking performance
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  onClick={() => setActiveTab("generate")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate New SEO Content
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="generate">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">OpenAI API Key</label>
                {apiKeyMasked ? (
                  <div className="flex space-x-2">
                    <Input
                      type="password"
                      value="••••••••••••••••••••••"
                      disabled
                      className="font-mono text-sm flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setApiKeyMasked(false);
                        setApiKey('');
                      }}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                    className="font-mono text-sm"
                  />
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Your API key is stored securely in memory and will be cleared when your session ends.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Target Keywords (comma separated)</label>
                  <Input 
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="brand reputation, complaint response, customer service"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The first keyword will be used as the primary focus
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Title (optional)</label>
                  <Input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Leave blank to generate automatically"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Content Type</label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="press">Press Release</SelectItem>
                        <SelectItem value="faq">FAQ Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Word Count</label>
                    <Select value={wordCount} onValueChange={setWordCount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select word count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500">500 words</SelectItem>
                        <SelectItem value="1000">1000 words</SelectItem>
                        <SelectItem value="1500">1500 words</SelectItem>
                        <SelectItem value="2000">2000 words</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Target URL (optional)</label>
                  <Input 
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="URL you want to suppress in search results"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Content will be optimized to outrank this specific URL
                  </p>
                </div>
              </div>
              
              <Button
                onClick={handleGenerateContent}
                disabled={isGenerating || !keywords.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Generating SEO Content...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate SEO Content
                  </>
                )}
              </Button>
              
              {generatedContent && (
                <div className="mt-4">
                  <label className="text-sm font-medium mb-1 block">Generated Content Preview</label>
                  <div className="border rounded-md p-3 bg-gray-50 max-h-[300px] overflow-y-auto">
                    <h3 className="text-lg font-medium mb-2">{title}</h3>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="space-y-4">
              {seoContent.length === 0 ? (
                <div className="text-center p-8">
                  <CircleSlash className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                  <h3 className="mt-2 text-lg font-medium">No content yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate SEO-optimized content to suppress negative search results.
                  </p>
                  <Button 
                    onClick={() => setActiveTab("generate")}
                    variant="outline" 
                    className="mt-4"
                  >
                    Create Content
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {seoContent.map((item) => (
                    <div key={item.id} className="border rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center">
                            <ScrollText className="h-3 w-3 mr-1" />
                            Created: {item.dateCreated}
                            {item.publishDate && (
                              <span className="ml-2">• Published: {item.publishDate}</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.keywords.map((keyword, index) => (
                              <span 
                                key={index} 
                                className="bg-gray-100 text-xs px-2 py-0.5 rounded"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(item.status)}
                          {item.score && (
                            <div className="text-xs mt-1 text-right">
                              Score: <span className="font-medium">{item.score}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-end gap-2">
                        {item.status === "draft" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleOptimize(item.id)}
                          >
                            <Search className="h-3 w-3 mr-1" /> 
                            Optimize
                          </Button>
                        )}
                        
                        {(item.status === "draft" || item.status === "optimizing") && (
                          <Button 
                            size="sm" 
                            onClick={() => handlePublish(item.id)}
                          >
                            <Globe className="h-3 w-3 mr-1" /> 
                            Publish
                          </Button>
                        )}
                        
                        {item.status === "published" && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleIndex(item.id)}
                            >
                              <ArrowUpRight className="h-3 w-3 mr-1" /> 
                              Submit for Indexing
                            </Button>
                            
                            {item.url && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => window.open(item.url, "_blank")}
                              >
                                <ArrowUpRight className="h-3 w-3 mr-1" /> 
                                View
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="targets">
            <div className="space-y-4">
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
                Here you can define negative URLs or search results that you want to suppress in search engines.
                The system will generate and optimize content specifically designed to outrank these targets.
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Target URL to Suppress</label>
                <div className="flex gap-2">
                  <Input placeholder="https://example.com/negative-article" className="flex-1" />
                  <Button>Add Target</Button>
                </div>
              </div>
              
              <div className="border rounded-md p-2">
                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md">
                  <div>
                    <div className="text-sm font-medium truncate max-w-[250px]">
                      https://competitor.com/negative-review-about-your-brand
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Added on 2023-05-12
                    </div>
                  </div>
                  <Button variant="destructive" size="sm">
                    Remove
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <Button className="w-full">
                  Generate Content For All Targets
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SeoSuppressionPipeline;
