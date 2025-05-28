
import DashboardLayout from "@/components/layout/DashboardLayout";
import HyperCoreDashboard from "@/components/aria/HyperCoreDashboard";

const HyperCorePage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <HyperCoreDashboard />
      </div>
    </DashboardLayout>
  );
};

export default HyperCorePage;
