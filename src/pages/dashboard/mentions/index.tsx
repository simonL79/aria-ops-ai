import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MentionsTab from "./MentionsTab";
import ClassifyTab from "./ClassifyTab";
import MentionDetailsDialog from "./MentionDetailsDialog";

// Sample mock data for initial development
const mockMentions: ContentAlert[] = [
  {
    id: "1",
    platform: "X",
    content: "This company ruined my skin! I used their Product XYZ and got a terrible rash. #NeverAgain",
    date: "2025-05-18",
    severity: "high",
    status: "new",
    sourceType: "social",
    threatType: "Reputation Threat",
    category: "Reputation Threat",
    recommendation: "Respond immediately and offer support",
    ai_reasoning: "Direct product complaint with health implications",
    url: "https://x.com/user/status/123456789"
  },
  {
    id: "2",
    platform: "Reddit",
    content: "Has anyone else noticed that YourBrand's customer service has been terrible lately? I've been waiting 3 weeks for a response.",
    date: "2025-05-17",
    severity: "medium",
    status: "new",
    sourceType: "forum",
    category: "Complaint",
    recommendation: "Respond with apology and follow up",
    ai_reasoning: "Customer service complaint that may influence others",
    url: "https://reddit.com/r/CustomerService/comments/abc123"
  },
  {
    id: "3",
    platform: "Google News",
    content: "Local news outlet reports that YourBrand's CEO has been seen at competitor meetings",
    date: "2025-05-16",
    severity: "high",
    status: "new",
    sourceType: "news",
    category: "Misinformation",
    recommendation: "Issue official statement",
    ai_reasoning: "False news that could damage brand reputation",
    url: "https://news.google.com/articles/123"
  },
  {
    id: "4",
    platform: "Discord",
    content: "I actually love YourBrand's new product line. The quality is amazing!",
    date: "2025-05-15",
    severity: "low",
    status: "read",
    sourceType: "social",
    category: "Positive",
    recommendation: "Engage and thank the customer",
    ai_reasoning: "Positive feedback that should be acknowledged",
    url: "https://discord.com/channels/123/456"
  },
  {
    id: "5",
    platform: "TikTok",
    content: "WARNING: YourBrand uses harmful chemicals in their products! #ConsumerAlert",
    date: "2025-05-14",
    severity: "high",
    status: "new",
    sourceType: "social",
    category: "Misinformation",
    recommendation: "Respond with factual information",
    ai_reasoning: "False claim that could go viral",
    url: "https://tiktok.com/@user/video/123456789"
  },
  {
    id: "6",
    platform: "WhatsApp",
    content: "Message circulating about YourBrand's manufacturing practices being unethical",
    date: "2025-05-13",
    severity: "medium",
    status: "new",
    sourceType: "messaging",
    category: "Misinformation",
    recommendation: "Monitor and prepare statement",
    ai_reasoning: "Messaging chain with potentially harmful content",
    url: ""
  },
  {
    id: "7",
    platform: "Telegram",
    content: "User group discussing legal action against YourBrand for alleged false advertising",
    date: "2025-05-12",
    severity: "high",
    status: "new",
    sourceType: "messaging",
    category: "Legal Risk",
    recommendation: "Escalate to legal team immediately",
    ai_reasoning: "Potential legal threat requiring immediate attention",
    url: "https://t.me/channel/123456"
  }
];

const MentionsPage = () => {
  const [mentions, setMentions] = useState<ContentAlert[]>(mockMentions);
  const [selectedMention, setSelectedMention] = useState<ContentAlert | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"view" | "resolve" | "escalate">("view");
  const [activeTab, setActiveTab] = useState<string>("mentions");

  const handleViewDetail = (mention: ContentAlert) => {
    setSelectedMention(mention);
    setActionType("view");
    setDialogOpen(true);
  };

  const handleMarkResolved = (id: string) => {
    setSelectedMention(mentions.find(m => m.id === id) || null);
    setActionType("resolve");
    setDialogOpen(true);
  };

  const handleEscalate = (id: string) => {
    setSelectedMention(mentions.find(m => m.id === id) || null);
    setActionType("escalate");
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedMention) return;
    
    if (actionType === "resolve") {
      // Mark as resolved
      setMentions(prev => 
        prev.map(m => m.id === selectedMention.id ? { ...m, status: "actioned" } : m)
      );
      toast.success("Mention marked as resolved");
    } else if (actionType === "escalate") {
      // Escalate
      setMentions(prev => 
        prev.map(m => m.id === selectedMention.id ? { ...m, status: "reviewing" } : m)
      );
      toast.success("Mention escalated for review");
    }
    
    setDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Brand Mentions Monitor"
        description="View, analyze, and classify mentions across multiple platforms"
      />
      
      <div className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="mentions">Mentions Table</TabsTrigger>
            <TabsTrigger value="classify">Classify Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mentions">
            <MentionsTab 
              mentions={mentions}
              setMentions={setMentions}
              onViewDetail={handleViewDetail}
              onMarkResolved={handleMarkResolved}
              onEscalate={handleEscalate}
            />
          </TabsContent>
          
          <TabsContent value="classify">
            <ClassifyTab 
              setMentions={setMentions} 
              setActiveTab={setActiveTab} 
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <MentionDetailsDialog 
          selectedMention={selectedMention}
          actionType={actionType}
          onConfirm={handleConfirmAction}
        />
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MentionsPage;
