
import { useState } from "react";
import InfluencerAlertsList from "@/components/influencers/InfluencerAlertsList";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { StickyHeader } from "@/components/layout/StickyHeader";

const InfluencerRadar = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <StickyHeader title="Influencer Radar" />
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="container mx-auto py-4">
            <h1 className="text-2xl font-bold mb-6">Influencer Risk Intelligence Feed</h1>
            <InfluencerAlertsList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerRadar;
