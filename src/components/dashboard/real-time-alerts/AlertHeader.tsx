
import { BellRing } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardTitle } from "@/components/ui/card";
import { ContentAlert } from "@/types/dashboard";

interface AlertHeaderProps {
  activeAlerts: ContentAlert[];
}

const AlertHeader = ({ activeAlerts }: AlertHeaderProps) => {
  const highSeverityCount = activeAlerts.filter(a => a.severity === 'high' && a.status === 'new').length;
  const customerEnquiryCount = activeAlerts.filter(a => a.category === 'customer_enquiry' && a.status === 'new').length;
  
  return (
    <CardTitle className="text-lg flex items-center gap-2">
      <BellRing className="h-5 w-5" />
      Real-Time Alerts
      {highSeverityCount > 0 && (
        <Badge variant="destructive" className="animate-pulse">
          {highSeverityCount} High Risk
        </Badge>
      )}
      {customerEnquiryCount > 0 && (
        <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-800 animate-pulse">
          {customerEnquiryCount} Customer Enquiries
        </Badge>
      )}
    </CardTitle>
  );
};

export default AlertHeader;
