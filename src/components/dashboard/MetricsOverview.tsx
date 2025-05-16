
import { Card, CardContent } from "@/components/ui/card";
import { Ban, MessageSquareX, Shield } from "lucide-react";

interface MetricsOverviewProps {
  monitoredSources?: number;
  negativeContent?: number;
  removedContent?: number;
}

const MetricsOverview = ({
  monitoredSources = 58,
  negativeContent = 12,
  removedContent = 7
}: MetricsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-white shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-brand/10 p-3 rounded-full">
              <Shield className="h-6 w-6 text-brand" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Monitored Sources</div>
              <div className="text-2xl font-bold">{monitoredSources}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-alert-negative/10 p-3 rounded-full">
              <MessageSquareX className="h-6 w-6 text-alert-negative" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Negative Content</div>
              <div className="text-2xl font-bold">{negativeContent}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white shadow-sm hover:shadow transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="bg-alert-positive/10 p-3 rounded-full">
              <Ban className="h-6 w-6 text-alert-positive" />
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Removed Content</div>
              <div className="text-2xl font-bold">{removedContent}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsOverview;
