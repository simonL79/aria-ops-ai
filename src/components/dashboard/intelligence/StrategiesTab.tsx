
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { strategies } from "@/data/threatData";

const StrategiesTab = () => {
  return (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="font-medium text-sm mb-2">Defense Strategies</h3>
        {strategies.map((strategy) => (
          <Card key={strategy.name} className="mb-3">
            <CardHeader className="p-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center">
                  {strategy.icon}
                  <span className="ml-2">{strategy.name}</span>
                </CardTitle>
                <Badge className="bg-green-600">{strategy.effectivenessRate}%</Badge>
              </div>
              <CardDescription className="text-xs mt-1">{strategy.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Platforms: {strategy.platforms.join(', ')}</span>
                <span className="text-muted-foreground">Time: {strategy.timeToImplement}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StrategiesTab;
