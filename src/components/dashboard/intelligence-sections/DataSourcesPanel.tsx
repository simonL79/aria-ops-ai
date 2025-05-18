
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DataSourceStats } from "@/types/intelligence";

interface DataSourcesPanelProps {
  sourceStats: DataSourceStats[];
  availableSources: any[];
}

const DataSourcesPanel = ({ sourceStats, availableSources }: DataSourcesPanelProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Data Sources</h3>
            <Badge variant="outline">
              {availableSources.filter(s => s.active).length}/{availableSources.length} Connected
            </Badge>
          </div>
          
          <div className="space-y-4">
            {availableSources.map((source) => (
              <div key={source.id} className="border rounded-md p-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${source.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <div className="font-medium">{source.name}</div>
                      <div className="text-xs text-muted-foreground">{source.type.charAt(0).toUpperCase() + source.type.slice(1)}</div>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    {source.active ? (
                      <div className="text-green-600">Connected</div>
                    ) : (
                      <Button size="sm" variant="outline" className="h-7 text-xs">Connect</Button>
                    )}
                  </div>
                </div>
                
                {source.active && source.lastScan && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Last scan: {source.lastScan}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Source Intelligence Coverage</h3>
            {sourceStats.map((stat) => (
              <div key={stat.source} className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{stat.source}</span>
                  <span>{stat.coverage}%</span>
                </div>
                <Progress value={stat.coverage} max={100} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourcesPanel;
