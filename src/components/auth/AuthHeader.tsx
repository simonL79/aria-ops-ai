
import { Shield } from "lucide-react";

const AuthHeader = () => {
  return (
    <div className="mb-8 flex flex-col items-center">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">A.R.I.A.</h1>
      </div>
      <p className="text-muted-foreground text-center max-w-md">
        AI Reputation Intelligence Agent: Secure your brand's online reputation with advanced threat intelligence and monitoring
      </p>
    </div>
  );
};

export default AuthHeader;
