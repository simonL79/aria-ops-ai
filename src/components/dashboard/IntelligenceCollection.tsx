
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Globe, Search, Rss, MessageSquare, Star } from "lucide-react";
import { toast } from "sonner";

interface DataSourceProps {
  name: string;
  status: "connected" | "disconnected" | "pending";
  icon: React.ReactNode;
  lastSync?: string;
}

interface IntelligenceCollectionProps {
  onSourceConnect?: (source: string) => void;
}

const IntelligenceCollection = ({ onSourceConnect }: IntelligenceCollectionProps) => {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  
  const dataSources: DataSourceProps[] = [
    { name: "Social Media", status: "connected", icon: <MessageSquare className="h-5 w-5" />, lastSync: "10 mins ago" },
    { name: "News & Blogs", status: "connected", icon: <Rss className="h-5 w-5" />, lastSync: "15 mins ago" },
    { name: "Reviews", status: "disconnected", icon: <Star className="h-5 w-5" /> },
    { name: "Search Results", status: "connected", icon: <Search className="h-5 w-5" />, lastSync: "30 mins ago" },
    { name: "Dark Web", status: "disconnected", icon: <Globe className="h-5 w-5" /> }
  ];
  
  const handleConnect = (sourceName: string) => {
    setConnecting(sourceName);
    
    // Simulate connection process
    setTimeout(() => {
      setConnecting(null);
      toast.success(`${sourceName} connected successfully`);
      
      if (onSourceConnect) {
        onSourceConnect(sourceName);
      }
    }, 1500);
  };
  
  const handleApiKeySave = (sourceName: string) => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    setConnecting(sourceName);
    
    // Simulate connection process
    setTimeout(() => {
      setConnecting(null);
      setApiKey("");
      toast.success(`${sourceName} connected successfully with API key`);
      
      if (onSourceConnect) {
        onSourceConnect(sourceName);
      }
    }, 1500);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Intelligence Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sources">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="settings">Connection Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sources">
            <div className="space-y-3">
              {dataSources.map((source) => (
                <div key={source.name} className="flex justify-between items-center p-2 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-md">
                      {source.icon}
                    </div>
                    <div>
                      <div className="font-medium">{source.name}</div>
                      {source.lastSync && (
                        <div className="text-xs text-muted-foreground">Last sync: {source.lastSync}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={source.status === "connected" ? "outline" : "secondary"}>
                      {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                    </Badge>
                    {source.status === "disconnected" && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        disabled={connecting === source.name}
                        onClick={() => handleConnect(source.name)}
                      >
                        {connecting === source.name ? (
                          <>
                            <Loader className="h-3 w-3 mr-2 animate-spin" />
                            Connecting
                          </>
                        ) : "Connect"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="space-y-4">
              <div className="border rounded-md p-3">
                <h3 className="font-medium mb-2">Dark Web Intelligence</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Connect to darknet forums and onion sites for advanced threat detection.
                </p>
                <div className="space-y-2">
                  <Input 
                    placeholder="Enter API key" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <Button 
                    size="sm" 
                    className="w-full"
                    disabled={connecting === "Dark Web"}
                    onClick={() => handleApiKeySave("Dark Web")}
                  >
                    {connecting === "Dark Web" ? (
                      <>
                        <Loader className="h-3 w-3 mr-2 animate-spin" />
                        Connecting
                      </>
                    ) : "Save API Key"}
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-md p-3">
                <h3 className="font-medium mb-2">Data Collection Frequency</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm">5 min</Button>
                  <Button variant="default" size="sm">15 min</Button>
                  <Button variant="outline" size="sm">30 min</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntelligenceCollection;
