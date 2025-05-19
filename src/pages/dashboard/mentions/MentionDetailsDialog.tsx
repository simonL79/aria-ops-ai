
import { ContentAlert } from "@/types/dashboard";
import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";

interface MentionDetailsDialogProps {
  selectedMention: ContentAlert | null;
  actionType: "view" | "resolve" | "escalate";
  onConfirm: () => void;
}

const MentionDetailsDialog = ({ 
  selectedMention, 
  actionType, 
  onConfirm 
}: MentionDetailsDialogProps) => {
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
          <AlertDialogAction onClick={onConfirm}>
            {actionType === "resolve" ? "Mark Resolved" : "Escalate"}
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default MentionDetailsDialog;
