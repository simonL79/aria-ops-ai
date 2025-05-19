
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MentionsTable from "@/components/dashboard/MentionsTable";
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogContent, 
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel, 
  AlertDialogAction 
} from "@/components/ui/alert-dialog";

// Sample mock data for initial development
const mockMentions: ContentAlert[] = [
  {
    id: "1",
    platform: "Twitter",
    content: "This company ruined my skin! I used their Product XYZ and got a terrible rash. #NeverAgain",
    date: "2025-05-18",
    severity: "high",
    status: "new",
    sourceType: "social",
    threatType: "Reputation Threat",
    category: "Reputation Threat",
    recommendation: "Respond immediately and offer support",
    ai_reasoning: "Direct product complaint with health implications",
    url: "https://twitter.com/user/status/123456789"
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

  // Get dialog title based on action type
  const getDialogTitle = () => {
    switch (actionType) {
      case "view":
        return "View Mention";
      case "resolve":
        return "Mark as Resolved";
      case "escalate":
        return "Escalate Mention";
    }
  };

  // Get dialog description based on action type
  const getDialogDescription = () => {
    switch (actionType) {
      case "view":
        return "View details about this mention.";
      case "resolve":
        return "Are you sure you want to mark this mention as resolved?";
      case "escalate":
        return "Are you sure you want to escalate this mention for urgent review?";
    }
  };

  // Get dialog content based on action type
  const getDialogContent = () => {
    if (!selectedMention) return null;

    if (actionType === "view") {
      return (
        <div className="space-y-4 mt-4">
          <div className="space-y-1">
            <h4 className="font-medium">Source</h4>
            <p>{selectedMention.platform}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium">Content</h4>
            <p>{selectedMention.content}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium">Analysis</h4>
            <p>{selectedMention.ai_reasoning}</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="font-medium">Recommendation</h4>
            <p>{selectedMention.recommendation}</p>
          </div>
          
          {selectedMention.url && (
            <div className="space-y-1">
              <h4 className="font-medium">Original Post</h4>
              <a 
                href={selectedMention.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View original post
              </a>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <DashboardLayout>
      <DashboardHeader
        title="Brand Mentions Monitor"
        description="View and analyze mentions across multiple platforms"
      />
      
      <div className="mt-6">
        <MentionsTable
          mentions={mentions}
          onViewDetail={handleViewDetail}
          onMarkResolved={handleMarkResolved}
          onEscalate={handleEscalate}
        />
      </div>
      
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getDialogTitle()}</AlertDialogTitle>
            <AlertDialogDescription>
              {getDialogDescription()}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {getDialogContent()}
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            {actionType !== "view" && (
              <AlertDialogAction onClick={handleConfirmAction}>
                {actionType === "resolve" ? "Mark Resolved" : "Escalate"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default MentionsPage;
