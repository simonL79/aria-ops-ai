
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface AiScrapingHeaderProps {
  isScanning: boolean;
  onScan: () => void;
}

const AiScrapingHeader = ({ isScanning, onScan }: AiScrapingHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold tracking-tight">AI-Powered Reputation Intelligence</h1>
          <span className="ml-3 px-2 py-1 bg-green-200 text-green-800 text-xs font-medium rounded-full">LIVE</span>
        </div>
        <Button 
          onClick={onScan} 
          disabled={isScanning}
          className="gap-2"
          variant="scan"
        >
          {isScanning ? (
            <>
              <Pause className="h-4 w-4" />
              Scanning...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start Quick Scan
            </>
          )}
        </Button>
      </div>
      <p className="text-muted-foreground">
        A.R.I.A™ is now running in live mode, actively monitoring and analyzing reputation data from across the web
      </p>
    </div>
  );
};

export default AiScrapingHeader;
