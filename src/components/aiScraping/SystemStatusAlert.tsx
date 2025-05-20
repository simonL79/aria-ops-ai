
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const SystemStatusAlert = () => {
  return (
    <Alert className="bg-green-50 border-green-200 mb-8">
      <AlertTriangle className="h-5 w-5 text-green-600" />
      <AlertTitle>Live System Active</AlertTitle>
      <AlertDescription className="text-green-700">
        ARIA is now operating in live mode, actively monitoring content sources in real-time. 
        Alerts and notifications represent actual mentions detected across monitored platforms.
      </AlertDescription>
    </Alert>
  );
};

export default SystemStatusAlert;
