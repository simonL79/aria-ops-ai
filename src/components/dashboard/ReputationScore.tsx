
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface ReputationScoreProps {
  score: number;
  previousScore?: number;
  isLoading?: boolean;
}

const ReputationScore = ({ score, previousScore, isLoading = false }: ReputationScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score < 40) return "text-alert-negative";
    if (score < 70) return "text-alert-warning";
    return "text-alert-positive";
  };

  const getProgressColor = (score: number) => {
    if (score < 40) return "bg-alert-negative";
    if (score < 70) return "bg-alert-warning";
    return "bg-alert-positive";
  };

  const scoreDifference = previousScore ? score - previousScore : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            <Skeleton className="h-6 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-baseline mb-2">
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-2 w-full rounded-full mb-3" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Reputation Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-baseline mb-2">
          <div className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}</div>
          {previousScore && (
            <div className={`text-sm font-medium ${scoreDifference >= 0 ? 'text-alert-positive' : 'text-alert-negative'}`}>
              {scoreDifference > 0 ? '+' : ''}{scoreDifference} pts
            </div>
          )}
        </div>
        <Progress value={score} max={100} className={`h-2 ${getProgressColor(score)}`} />
        <div className="mt-3 text-sm text-muted-foreground">
          Based on 58 monitored sources across social media, review sites, and forums.
        </div>
      </CardContent>
    </Card>
  );
};

export default ReputationScore;
