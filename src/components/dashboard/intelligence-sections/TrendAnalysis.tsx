
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const TrendAnalysis = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Trend Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-40 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Trend visualization will be available with more data</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendAnalysis;
