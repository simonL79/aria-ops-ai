
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader, AlertCircle, RefreshCw, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RedditScanResult {
  status: string;
  scanned: string[];
  matchesFound: number;
  processed: number;
  results: Array<{
    title: string;
    url: string;
    success: boolean;
    ariaResult?: any;
    error?: string;
  }>;
}

const RedditScannerPanel = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<RedditScanResult | null>(null);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);

  const triggerScan = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('reddit-scan');
      
      if (error) {
        throw new Error(error.message);
      }
      
      setLastScanResult(data);
      setLastScanTime(new Date().toLocaleString());
      
      toast.success('Reddit scan completed', {
        description: `Found ${data.matchesFound} matching posts, processed ${data.processed}`
      });
    } catch (error) {
      console.error('Error triggering Reddit scan:', error);
      toast.error('Reddit scan failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Reddit Threat Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Scans Reddit for potential threats and sends them to the ARIA ingest pipeline.
            </p>
            {lastScanTime && (
              <p className="text-sm font-medium mt-1">
                Last scan: {lastScanTime}
              </p>
            )}
          </div>
          <Button 
            onClick={triggerScan} 
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Manual Scan
              </>
            )}
          </Button>
        </div>

        {!lastScanResult && !isScanning && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No scan results</AlertTitle>
            <AlertDescription>
              Run a manual scan to see results here, or wait for the scheduled hourly scan.
            </AlertDescription>
          </Alert>
        )}

        {lastScanResult && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted rounded-md p-3">
                <p className="text-sm text-muted-foreground">Subreddits Scanned</p>
                <p className="font-medium">{lastScanResult.scanned.join(', ')}</p>
              </div>
              <div className="bg-muted rounded-md p-3">
                <p className="text-sm text-muted-foreground">Matches Found</p>
                <p className="font-medium">{lastScanResult.matchesFound}</p>
              </div>
              <div className="bg-muted rounded-md p-3">
                <p className="text-sm text-muted-foreground">Processed</p>
                <p className="font-medium">{lastScanResult.processed}</p>
              </div>
            </div>

            {lastScanResult.results.length > 0 && (
              <div className="border rounded-md">
                <div className="p-3 border-b bg-muted">
                  <h3 className="font-medium">Detected Reddit Posts</h3>
                </div>
                <div className="divide-y">
                  {lastScanResult.results.map((result, idx) => (
                    <div key={idx} className="p-3">
                      <div className="flex justify-between items-start">
                        <a 
                          href={result.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm font-medium hover:underline"
                        >
                          {result.title}
                        </a>
                        <Badge variant={result.success ? "default" : "destructive"}>
                          {result.success ? (
                            <span className="flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Processed
                            </span>
                          ) : "Failed"}
                        </Badge>
                      </div>
                      {!result.success && result.error && (
                        <p className="text-xs text-destructive mt-1">{result.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RedditScannerPanel;
