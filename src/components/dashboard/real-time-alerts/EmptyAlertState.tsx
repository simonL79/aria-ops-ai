
import { Info } from "lucide-react";

const EmptyAlertState = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <Info className="h-10 w-10 text-muted-foreground" />
      <p className="mt-2 text-sm text-muted-foreground">No active alerts at this time</p>
      <p className="text-xs text-muted-foreground mt-1">
        New alerts will appear here as they are detected
      </p>
    </div>
  );
};

export default EmptyAlertState;
