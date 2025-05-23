
import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>;
    case 'error':
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Error</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-50 text-gray-600">Inactive</Badge>;
  }
};
