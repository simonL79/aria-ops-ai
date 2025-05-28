
import { Helmet } from 'react-helmet-async';
import SovraDecisionEngine from '@/components/sovra/SovraDecisionEngine';
import { Button } from '@/components/ui/button';
import { sovraService } from '@/services/sovra/sovraService';
import { Zap } from 'lucide-react';

const SovraPage = () => {
  const handleSimulateThreat = async () => {
    await sovraService.simulateThreatDetection();
  };

  return (
    <>
      <Helmet>
        <title>SOVRA™ Decision Engine - Human-Authorized Threat Response</title>
        <meta name="description" content="SOVRA™ Admin-Controlled Decision Engine for threat detection and response authorization" />
      </Helmet>
      
      <div className="container mx-auto py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">SOVRA™ Decision Engine</h1>
            <p className="text-muted-foreground">Human-supervised threat response system</p>
          </div>
          <Button 
            onClick={handleSimulateThreat}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Zap className="h-4 w-4 mr-2" />
            Simulate Threat Detection
          </Button>
        </div>
        
        <SovraDecisionEngine />
      </div>
    </>
  );
};

export default SovraPage;
