
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ThreatResponsePanel from "@/components/dashboard/ThreatResponsePanel";

const ThreatResponsePage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto">
        <DashboardHeader 
          title="Strategic Threat Response" 
          description="Review high-priority threats and generate strategic communication responses"
        />
        
        <div className="space-y-8">
          <ThreatResponsePanel />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ThreatResponsePage;
