import { useState } from "react";
import { EntityMention } from "@/types/radar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Send, Wand2, Copy, Users, Building, MapPin, Linkedin, Mail, ExternalLink } from "lucide-react";

interface OutreachPanelProps {
  entity: EntityMention;
}

const OutreachPanel = ({ entity }: OutreachPanelProps) => {
  const [outreachText, setOutreachText] = useState<string>(entity.outreachDraft || "");
  const [generating, setGenerating] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  const generateOutreach = async () => {
    setGenerating(true);
    try {
      // In a real implementation, call your AI service to generate content
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulated AI response
      const generatedText = entity.type === 'person'
        ? `Dear ${entity.name},\n\nI noticed the recent media coverage about you and wanted to reach out. Our firm specializes in reputation management and privacy protection, and we may be able to assist during this challenging situation.\n\nWould you be open to a confidential conversation about digital reputation protection strategies?\n\nBest regards,\n[Your Name]\n[Your Company]`
        : `Dear ${entity.name} team,\n\nI noticed the recent coverage of ${entity.name} in the media. Our agency specializes in corporate reputation management and crisis response, helping organizations navigate challenging media situations.\n\nWould your communications team be available for a brief conversation about our reputation protection and media management services?\n\nBest regards,\n[Your Name]\n[Your Company]`;
      
      setOutreachText(generatedText);
      toast.success("Outreach message generated successfully");
    } catch (error) {
      console.error("Error generating outreach:", error);
      toast.error("Failed to generate outreach message");
    } finally {
      setGenerating(false);
    }
  };

  const sendOutreach = async () => {
    setSending(true);
    try {
      // In a real implementation, send the message through your chosen channel
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Outreach queued for sending", {
        description: `Your message to ${entity.name} has been queued for sending.`
      });
    } catch (error) {
      console.error("Error sending outreach:", error);
      toast.error("Failed to send outreach message");
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outreachText);
    toast.success("Copied to clipboard");
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  const getEntityTypeIcon = () => {
    switch (entity.type) {
      case 'person': return <Users className="h-4 w-4" />;
      case 'organization': return <Building className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className={entity.type === 'person' ? 'bg-blue-100' : 'bg-amber-100'}>
              {getInitials(entity.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{entity.name}</h3>
              <Badge variant="outline" className="font-normal">
                {getEntityTypeIcon()}
                <span className="ml-1 capitalize">{entity.type}</span>
              </Badge>
            </div>
            {entity.riskCategory && (
              <p className="text-xs text-muted-foreground">
                Flagged for: {entity.riskCategory}
              </p>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="message">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="message">Message</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="message" className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Outreach Message</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={generateOutreach}
              disabled={generating}
              className="h-7 text-xs"
            >
              {generating ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Wand2 className="h-3 w-3 mr-1" />}
              Generate
            </Button>
          </div>

          <Textarea 
            value={outreachText}
            onChange={(e) => setOutreachText(e.target.value)}
            placeholder="Write or generate an outreach message..."
            className="min-h-[240px] text-sm"
          />

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyToClipboard}
              className="text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            <Button 
              onClick={sendOutreach} 
              size="sm"
              disabled={!outreachText.trim() || sending}
              className="text-xs"
            >
              {sending ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Send className="h-3 w-3 mr-1" />}
              Queue to Send
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="channels">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Outreach Channels</CardTitle>
              <CardDescription className="text-xs">
                Select channels to send your outreach message
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Linkedin className="h-3 w-3 mr-2" />
                  LinkedIn InMail
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Mail className="h-3 w-3 mr-2" />
                  Email Outreach
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Mail className="h-3 w-3 mr-2" />
                  X/X DM
                </Button>
                
                <div className="pt-2 mt-2 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    Our AI agent can automatically adapt your outreach message 
                    for each platform and schedule delivery.
                  </p>
                  <Button size="sm" variant="secondary" className="w-full text-xs">
                    <Wand2 className="h-3 w-3 mr-1" />
                    Use AI Outreach Agent
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="articles">
          <ScrollArea className="h-[320px] pr-4">
            <div className="space-y-3">
              {entity.articles.map(article => (
                <Card key={article.id}>
                  <CardContent className="p-3">
                    <div className="font-medium text-sm mb-1">{article.title}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {article.source} • {new Date(article.publishDate).toLocaleDateString()}
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      {article.snippet}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs w-full"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {/* Placeholder card */}
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    No more articles found for this entity
                  </p>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OutreachPanel;
