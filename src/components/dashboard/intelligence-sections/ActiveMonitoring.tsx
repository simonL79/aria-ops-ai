
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";

const ActiveMonitoring = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Active Monitoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col">
          <div className="text-sm font-medium">Priority Mentions</div>
          <div className="text-3xl font-bold mt-2">37 <span className="text-sm text-muted-foreground font-normal">in the last 24h</span></div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <div className="font-medium text-green-600">19</div>
              <div className="text-xs text-muted-foreground">Positive</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-gray-600">8</div>
              <div className="text-xs text-muted-foreground">Neutral</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-red-600">10</div>
              <div className="text-xs text-muted-foreground">Negative</div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">Real-Time Systems</div>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Social Monitoring</span>
              </div>
              <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">News Alerts</span>
              </div>
              <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-sm">Dark Web Surveillance</span>
              </div>
              <Badge variant="outline" className="text-amber-600 bg-amber-50">Limited</Badge>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
              Risk Score
            </div>
            <div className="text-xl font-bold">42%</div>
          </div>
          <Progress value={42} max={100} className="h-2 mt-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Your brand's risk score is lower than 67% of similar companies in your industry.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveMonitoring;
