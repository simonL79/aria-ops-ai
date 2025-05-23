
import { BellRing } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";

interface AlertHeaderProps {
  alertCount: number;
}

const AlertHeader = ({ alertCount }: AlertHeaderProps) => {
  return (
    <CardTitle className="text-lg flex items-center gap-2">
      <BellRing className="h-5 w-5" />
      Real-Time Alerts
      {alertCount > 0 && (
        <Badge variant="destructive" className="animate-pulse">
          {alertCount} Active
        </Badge>
      )}
    </CardTitle>
  );
};

export default AlertHeader;
