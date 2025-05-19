
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const Index = () => {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading...</div>;
  }

  return isSignedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/signin" replace />;
};

export default Index;
