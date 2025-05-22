
import { useState } from "react";
import InfluencerAlertsList from "@/components/influencers/InfluencerAlertsList";

const InfluencerRadar = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Influencer Risk Intelligence Feed</h1>
      <InfluencerAlertsList />
    </div>
  );
};

export default InfluencerRadar;
