
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { IntelligenceReport } from "@/types/intelligence";

interface DashboardOverviewProps {
  report: IntelligenceReport;
}

const DashboardOverview = ({ report }: DashboardOverviewProps) => {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium">{report.title}</h3>
            <p className="text-sm text-muted-foreground">{report.date}</p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">Threat Level</div>
            <div className="text-3xl font-bold">{report.threatLevel}/10</div>
          </div>
        </div>
        
        <p>{report.summary}</p>
        
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="text-3xl font-bold">{report.sources}</div>
            <div className="text-sm text-muted-foreground">Sources</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{report.mentions}</div>
            <div className="text-sm text-muted-foreground">Mentions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{report.topics.length}</div>
            <div className="text-sm text-muted-foreground">Topics</div>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">Sentiment Analysis</div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden flex">
            <div 
              className="bg-green-500 h-full" 
              style={{ width: `${report.sentiment.positive}%` }}
            ></div>
            <div 
              className="bg-gray-400 h-full" 
              style={{ width: `${report.sentiment.neutral}%` }}
            ></div>
            <div 
              className="bg-red-500 h-full" 
              style={{ width: `${report.sentiment.negative}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <div>Positive: {report.sentiment.positive}%</div>
            <div>Neutral: {report.sentiment.neutral}%</div>
            <div>Negative: {report.sentiment.negative}%</div>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">Topics</div>
          <div className="flex flex-wrap gap-2">
            {report.topics.map((topic) => (
              <Badge key={topic} variant="secondary">{topic}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardOverview;
