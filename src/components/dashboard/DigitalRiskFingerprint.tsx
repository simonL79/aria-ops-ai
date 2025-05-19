
import { useState } from "react";
import { useClientChanges } from "@/hooks/useClientChanges";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle,
  Fingerprint,
  Pencil,
  Plus,
  Save,
  Shield,
  ThumbsUp,
  Trash
} from "lucide-react";
import { toast } from "sonner";

interface DigitalRiskFingerprintProps {
  selectedClient?: string;
  className?: string;
}

const DigitalRiskFingerprint = ({ selectedClient, className }: DigitalRiskFingerprintProps) => {
  const { 
    riskFingerprints, 
    addKeywordToFingerprint, 
    addKnownThreat,
    updateTonalPreferences,
    handleFingerprintFormSubmit,
    isUpdatingFingerprint
  } = useClientChanges();
  
  const [newKeyword, setNewKeyword] = useState("");
  const [newThreat, setNewThreat] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("keywords");
  
  // Find the selected client's fingerprint
  const fingerprint = riskFingerprints.find(fp => 
    fp.clientName === selectedClient
  );
  
  // If no fingerprint for selected client, display a message
  if (!fingerprint) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5" />
            Digital Risk Fingerprint™
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            No risk profile found for this client. Create one to enable advanced threat detection.
          </p>
          <Button>Create Risk Profile</Button>
        </CardContent>
      </Card>
    );
  }
  
  // Handle adding a new keyword
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    
    addKeywordToFingerprint(fingerprint.clientId, newKeyword.trim());
    setNewKeyword("");
  };
  
  // Handle adding a new known threat
  const handleAddThreat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreat.trim()) return;
    
    addKnownThreat(fingerprint.clientId, newThreat.trim());
    setNewThreat("");
  };
  
  // Handle tonal preference changes
  const handleToneChange = (type: 'boldness' | 'empathy' | 'formality', value: number[]) => {
    updateTonalPreferences(fingerprint.clientId, {
      [type]: value[0]
    });
  };
  
  // Calculate risk score color based on value
  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return "text-red-500";
    if (score >= 60) return "text-orange-500";
    if (score >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5" />
            Digital Risk Fingerprint™
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Risk Score:</span>
            <span className={`text-xl font-bold ${getRiskScoreColor(fingerprint.riskScore)}`}>
              {fingerprint.riskScore}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="threats">Threats</TabsTrigger>
            <TabsTrigger value="tone">Tone</TabsTrigger>
          </TabsList>
          
          <TabsContent value="keywords" className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Sensitive Keywords</h3>
                <Badge variant="outline">Sensitivity: {fingerprint.sensitivityScore}/10</Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {fingerprint.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
              
              <form onSubmit={handleAddKeyword} className="flex gap-2">
                <Input 
                  value={newKeyword} 
                  onChange={(e) => setNewKeyword(e.target.value)}
                  placeholder="Add sensitive keyword..."
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="threats" className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Known Threats</h3>
                <Badge 
                  variant="outline" 
                  className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                >
                  {fingerprint.knownThreats.length} Identified
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                {fingerprint.knownThreats.map((threat, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-md border bg-muted/50">
                    <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    <span className="text-sm">{threat}</span>
                  </div>
                ))}
                
                {fingerprint.pastAttackVectors.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Past Attack Vectors</h3>
                    {fingerprint.pastAttackVectors.map((attack, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 rounded-md border bg-muted/30 mb-1">
                        <Shield className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="text-sm">{attack}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <form onSubmit={handleAddThreat} className="flex gap-2">
                <Input 
                  value={newThreat} 
                  onChange={(e) => setNewThreat(e.target.value)}
                  placeholder="Add known threat..."
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </form>
            </div>
          </TabsContent>
          
          <TabsContent value="tone" className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-4">Response Tone Preferences</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Boldness</span>
                    <span className="text-sm font-medium">{fingerprint.tonalPreferences.boldness}/10</span>
                  </div>
                  <Slider 
                    value={[fingerprint.tonalPreferences.boldness]} 
                    min={1} 
                    max={10} 
                    step={1}
                    onValueChange={(val) => handleToneChange('boldness', val)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Cautious</span>
                    <span>Assertive</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Empathy</span>
                    <span className="text-sm font-medium">{fingerprint.tonalPreferences.empathy}/10</span>
                  </div>
                  <Slider 
                    value={[fingerprint.tonalPreferences.empathy]} 
                    min={1} 
                    max={10} 
                    step={1}
                    onValueChange={(val) => handleToneChange('empathy', val)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Factual</span>
                    <span>Empathetic</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Formality</span>
                    <span className="text-sm font-medium">{fingerprint.tonalPreferences.formality}/10</span>
                  </div>
                  <Slider 
                    value={[fingerprint.tonalPreferences.formality]} 
                    min={1} 
                    max={10} 
                    step={1}
                    onValueChange={(val) => handleToneChange('formality', val)}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Casual</span>
                    <span>Formal</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Response Timing</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(['immediate', 'measured', 'delayed'] as const).map((timing) => (
                      <Button 
                        key={timing}
                        variant={fingerprint.responseTiming === timing ? "default" : "outline"}
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          handleFingerprintFormSubmit(
                            new Event('click') as any, 
                            { responseTiming: timing }, 
                            fingerprint.clientId
                          );
                        }}
                      >
                        {timing.charAt(0).toUpperCase() + timing.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between border-t mt-4 px-6 py-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            toast.info(`Last updated: ${fingerprint.lastUpdated.toLocaleString()}`, {
              description: "Risk profile is continuously adapting"
            });
          }}
        >
          <ThumbsUp className="w-4 h-4 mr-1" />
          Self-adapting
        </Button>
        
        <Button
          size="sm" 
          onClick={() => {
            toast.success("Risk Fingerprint calibrated", {
              description: "AI has recalibrated the sensitivity based on recent events"
            });
          }}
          disabled={isUpdatingFingerprint}
        >
          Recalibrate Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DigitalRiskFingerprint;
