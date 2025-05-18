
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ContentAction } from "@/types/dashboard";

interface RecentActionsProps {
  actions: ContentAction[];
}

const RecentActions = ({ actions }: RecentActionsProps) => {
  const getActionText = (action: string) => {
    switch (action) {
      case 'removal_requested': return 'Removal Requested';
      case 'content_hidden': return 'Content Hidden';
      case 'reported': return 'Reported';
      case 'auto_responded': return 'Auto Responded';
      default: return action;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-alert-positive text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'rejected': return 'bg-alert-negative text-white';
      default: return 'bg-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-52 overflow-y-auto">
          {actions.map((action, idx) => (
            <div key={action.id}>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{getActionText(action.action)}</div>
                    <div className="text-sm text-muted-foreground">{action.platform} • {action.date}</div>
                  </div>
                  <Badge className={getStatusColor(action.status)}>
                    {action.status === 'completed' ? 'Completed' : 
                     action.status === 'pending' ? 'Pending' : 'Rejected'}
                  </Badge>
                </div>
              </div>
              {idx < actions.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActions;
