
import { Button } from "@/components/ui/button";

const SignedInRedirect = () => {
  return (
    <div className="mt-6">
      <p className="text-muted-foreground mb-2 text-center">You're already signed in</p>
      <Button asChild>
        <a href="/dashboard">Go to Dashboard</a>
      </Button>
    </div>
  );
};

export default SignedInRedirect;
