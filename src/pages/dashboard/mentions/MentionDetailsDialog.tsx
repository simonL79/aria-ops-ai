import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentAlert } from "@/types/dashboard";
import { AlertTriangle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { saveMentionAnalysis } from "@/services/api/mentionsApiService";

interface MentionDetailsDialogProps {
  mention: ContentAlert;
}

const MentionDetailsDialog = ({ mention }: MentionDetailsDialogProps) => {
  const [analysisText, setAnalysisText] = useState("");
  const [analysisResults, setAnalysisResults] = useState({
    threatLevel: "medium",
    category: "general",
    recommendedAction: "monitor",
    confidence: 75,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!analysisText.trim()) {
      toast.error("Please enter content to analyze");
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const analysisData = {
        threatLevel: analysisResults.threatLevel || 'medium',
        category: analysisResults.category || 'general',
        recommendedAction: analysisResults.recommendedAction || 'monitor',
        confidence: analysisResults.confidence || 75
      };
      
      const success = await saveMentionAnalysis(mention.id, analysisData);
      
      if (success) {
        toast.success("Analysis saved successfully");
      } else {
        toast.error("Failed to save analysis");
      }
    } catch (error) {
      console.error('Error analyzing mention:', error);
      toast.error("Error occurred during analysis");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">View Details</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Mention Details</AlertDialogTitle>
          <AlertDialogDescription>
            Here are the details of the selected mention.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="platform" className="text-right">
              Platform
            </Label>
            <Input
              type="text"
              id="platform"
              value={mention.platform}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              type="text"
              id="date"
              value={mention.date}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="severity" className="text-right">
              Severity
            </Label>
            <Input
              type="text"
              id="severity"
              value={mention.severity}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <Textarea
              id="content"
              value={mention.content}
              className="col-span-3"
              readOnly
            />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
              <CardDescription>
                Analyze the mention content for threat level, category, and
                recommended action.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="threatLevel" className="text-right">
                  Threat Level
                </Label>
                <Input
                  type="text"
                  id="threatLevel"
                  value={analysisResults.threatLevel}
                  className="col-span-3"
                  onChange={(e) =>
                    setAnalysisResults({
                      ...analysisResults,
                      threatLevel: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  type="text"
                  id="category"
                  value={analysisResults.category}
                  className="col-span-3"
                  onChange={(e) =>
                    setAnalysisResults({
                      ...analysisResults,
                      category: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recommendedAction" className="text-right">
                  Recommended Action
                </Label>
                <Input
                  type="text"
                  id="recommendedAction"
                  value={analysisResults.recommendedAction}
                  className="col-span-3"
                  onChange={(e) =>
                    setAnalysisResults({
                      ...analysisResults,
                      recommendedAction: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confidence" className="text-right">
                  Confidence
                </Label>
                <Input
                  type="number"
                  id="confidence"
                  value={analysisResults.confidence}
                  className="col-span-3"
                  onChange={(e) =>
                    setAnalysisResults({
                      ...analysisResults,
                      confidence: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Save Analysis"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Okay</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MentionDetailsDialog;
