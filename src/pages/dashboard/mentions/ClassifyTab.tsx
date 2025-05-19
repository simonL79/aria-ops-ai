
import ManualClassificationForm from "@/components/dashboard/threatClassifier/ManualClassification";
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";

interface ClassifyTabProps {
  setMentions: React.Dispatch<React.SetStateAction<ContentAlert[]>>;
  setActiveTab: (tab: string) => void;
}

const ClassifyTab = ({ setMentions, setActiveTab }: ClassifyTabProps) => {
  const handleClassificationResult = (result: any) => {
    if (!result) return;
    
    // Create a new mention from the classification result
    const newMention: ContentAlert = {
      id: `manual-${Date.now()}`,
      platform: "Manual Entry",
      content: result.content || "Manually classified content",
      date: new Date().toISOString().split('T')[0],
      severity: result.severity >= 7 ? "high" : result.severity >= 4 ? "medium" : "low",
      status: "new",
      category: result.category,
      recommendation: result.recommendation,
      ai_reasoning: result.ai_reasoning || result.explanation,
      url: ""
    };
    
    setMentions(prev => [newMention, ...prev]);
    toast.success("New classification added to mentions");
    
    // Switch to mentions tab to show the new item
    setActiveTab("mentions");
  };

  return (
    <ManualClassificationForm onClassified={handleClassificationResult} />
  );
};

export default ClassifyTab;
