
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const AccessDenied = () => {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-destructive" />
          <CardTitle className="text-destructive">Access Denied</CardTitle>
        </div>
        <CardDescription>
          You don't have permission to view this content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Please contact your administrator if you believe this is an error.
        </p>
      </CardContent>
    </Card>
  );
};
