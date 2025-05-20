
import { Shield, MessageSquare, Scale, Users, Search, BarChart3, AlertTriangle } from "lucide-react";
import { AgentRole } from "@/types/intelligence";

export const getAgentIcon = (role: AgentRole) => {
  switch (role) {
    case "sentinel":
      return <Shield className="h-5 w-5 text-blue-500" />;
    case "liaison":
      return <MessageSquare className="h-5 w-5 text-green-500" />;
    case "legal":
      return <Scale className="h-5 w-5 text-amber-500" />;
    case "outreach":
      return <Users className="h-5 w-5 text-purple-500" />;
    case "researcher":
      return <Search className="h-5 w-5 text-indigo-500" />;
    case "predictor":
      return <BarChart3 className="h-5 w-5 text-red-500" />;
    case "analyst":
      return <Shield className="h-5 w-5 text-cyan-500" />;
    case "responder":
      return <Shield className="h-5 w-5 text-green-700" />;
    case "monitor":
      return <Shield className="h-5 w-5 text-violet-500" />;
    case "coordinator":
      return <Shield className="h-5 w-5 text-orange-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-gray-500" />;
  }
};
