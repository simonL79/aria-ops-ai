
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SystemStatus {
  lastImport: string | null;
  lastScan: string | null;
  lastEmail: string | null;
  pendingCompanies: number;
  importActive: boolean;
  scanActive: boolean;
}

const SystemStatusIndicator = () => {
  const [status, setStatus] = useState<SystemStatus>({
    lastImport: null,
    lastScan: null,
    lastEmail: null,
    pendingCompanies: 0,
    importActive: false,
    scanActive: false
  });
  const [loading, setLoading] = useState(true);
  const [manualRunning, setManualRunning] = useState<string | null>(null);

  // Fetch system status data
  const fetchSystemStatus = async () => {
    try {
      // Get latest company creation date as proxy for last import
      const { data: latestCompany } = await supabase
        .from('clean_launch_targets')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1);

      // Get latest scan date
      const { data: latestScan } = await supabase
        .from('clean_launch_targets')
        .select('last_scanned')
        .order('last_scanned', { ascending: false })
        .limit(1);

      // Count pending companies
      const { count } = await supabase
        .from('clean_launch_targets')
        .select('*', { count: 'exact', head: true })
        .eq('scan_status', 'pending');

      setStatus({
        lastImport: latestCompany?.[0]?.created_at || null,
        lastScan: latestScan?.[0]?.last_scanned || null,
        lastEmail: localStorage.getItem('last_email_digest') || null, // Using localStorage as demo
        pendingCompanies: count || 0,
        importActive: false,
        scanActive: false
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching system status:", error);
      toast.error("Failed to fetch system status");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemStatus();
    
    // Refresh status every minute
    const interval = setInterval(() => {
      fetchSystemStatus();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Run manual import
  const runManualImport = async () => {
    setManualRunning('import');
    try {
      const response = await fetch('https://ssvskbejfacmjemphmry.supabase.co/functions/v1/companies-house-daily-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          maxResults: 5
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success("Manual import completed", {
        description: `Processed ${data.companies?.length || 0} companies`
      });
      
      // Refresh status
      fetchSystemStatus();
    } catch (error) {
      console.error("Error running manual import:", error);
      toast.error("Failed to run manual import");
    } finally {
      setManualRunning(null);
    }
  };
  
  // Run manual scan
  const runManualScan = async () => {
    setManualRunning('scan');
    try {
      const response = await fetch('https://ssvskbejfacmjemphmry.supabase.co/functions/v1/reputation-scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxCompanies: 5
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success("Manual scan completed", {
        description: `Processed ${data.results?.length || 0} companies`
      });
      
      // Refresh status
      fetchSystemStatus();
    } catch (error) {
      console.error("Error running manual scan:", error);
      toast.error("Failed to run manual scan");
    } finally {
      setManualRunning(null);
    }
  };
  
  // Run manual email digest
  const runManualEmailDigest = async () => {
    setManualRunning('email');
    try {
      const response = await fetch('https://ssvskbejfacmjemphmry.supabase.co/functions/v1/email-digest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sinceDays: 7
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      toast.success("Email digest sent", {
        description: `Processed ${data.companiesProcessed || 0} companies`
      });
      
      // Store last email time in localStorage for demo
      localStorage.setItem('last_email_digest', new Date().toISOString());
      
      // Refresh status
      fetchSystemStatus();
    } catch (error) {
      console.error("Error sending email digest:", error);
      toast.error("Failed to send email digest");
    } finally {
      setManualRunning(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleString();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          System Status
          {loading ? (
            <Badge variant="outline" className="bg-gray-100">
              <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Loading...
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" /> Online
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Live Mode status for A.R.I.A™ Clean Launch
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Last Company Import</p>
            <div className="flex items-center text-sm">
              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
              <span>{formatDate(status.lastImport)}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Last Reputation Scan</p>
            <div className="flex items-center text-sm">
              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
              <span>{formatDate(status.lastScan)}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Last Email Digest</p>
            <div className="flex items-center text-sm">
              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
              <span>{formatDate(status.lastEmail)}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">Pending Companies</p>
            <div className="flex items-center">
              {status.pendingCompanies > 0 ? (
                <Badge variant="outline" className="bg-amber-100 text-amber-800">
                  <AlertCircle className="h-3 w-3 mr-1" /> {status.pendingCompanies} Pending
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" /> All Processed
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={runManualImport}
            disabled={manualRunning !== null}
            className="flex items-center justify-center"
          >
            {manualRunning === 'import' ? (
              <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Importing...</>
            ) : (
              <>Run Import</>
            )}
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={runManualScan}
            disabled={manualRunning !== null}
            className="flex items-center justify-center"
          >
            {manualRunning === 'scan' ? (
              <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Scanning...</>
            ) : (
              <>Run Scan</>
            )}
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={runManualEmailDigest}
            disabled={manualRunning !== null}
            className="flex items-center justify-center"
          >
            {manualRunning === 'email' ? (
              <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Sending...</>
            ) : (
              <>Send Digest</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatusIndicator;
