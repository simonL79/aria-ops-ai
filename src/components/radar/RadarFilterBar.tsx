
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Users, Building, MapPin, SlidersHorizontal, Filter } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { RadarFilters } from "@/types/radar";

interface RadarFilterBarProps {
  filters: RadarFilters;
  onChange: (filters: Partial<RadarFilters>) => void;
}

const RadarFilterBar = ({ filters, onChange }: RadarFilterBarProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    // In a real implementation, convert date to timeframe or use exact date
    onChange({ timeframe: 'last24h' });
  };

  const handleEntityTypeChange = (value: string[]) => {
    const entityTypes = value as ('person' | 'organization' | 'location')[];
    onChange({ entityTypes });
  };

  const handleRiskScoreChange = (value: number[]) => {
    onChange({ minRiskScore: value[0] });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {filters.timeframe === 'last24h' ? 'Last 24 Hours' : 
               filters.timeframe === 'last7d' ? 'Last 7 Days' : 
               filters.timeframe === 'last30d' ? 'Last 30 Days' : 
               filters.timeframe === 'last3d' ? 'Last 3 Days' : 'Last Week'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Time Range</h4>
                <div className="flex flex-col space-y-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start h-7 px-2"
                    onClick={() => onChange({ timeframe: 'last24h' })}
                  >
                    Last 24 Hours
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start h-7 px-2"
                    onClick={() => onChange({ timeframe: 'last3d' })}
                  >
                    Last 3 Days
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start h-7 px-2"
                    onClick={() => onChange({ timeframe: 'last7d' })}
                  >
                    Last Week
                  </Button>
                </div>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <ToggleGroup 
          type="multiple" 
          variant="outline"
          value={filters.entityTypes}
          onValueChange={handleEntityTypeChange}
        >
          <ToggleGroupItem value="person" size="sm" className="h-8">
            <Users className="h-4 w-4 mr-1" />
            People
          </ToggleGroupItem>
          <ToggleGroupItem value="organization" size="sm" className="h-8">
            <Building className="h-4 w-4 mr-1" />
            Organizations
          </ToggleGroupItem>
          <ToggleGroupItem value="location" size="sm" className="h-8">
            <MapPin className="h-4 w-4 mr-1" />
            Places
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm">Min Risk:</span>
        <div className="w-32">
          <Slider 
            value={[filters.minRiskScore]} 
            min={0} 
            max={10} 
            step={1} 
            onValueChange={handleRiskScoreChange}
          />
        </div>
        <Badge variant={filters.minRiskScore >= 7 ? "destructive" : "outline"}>
          {filters.minRiskScore}
        </Badge>
      </div>

      <div className="ml-auto">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onChange({
            timeframe: 'last24h',
            entityTypes: ['person', 'organization', 'location'],
            minRiskScore: 0,
            sources: [],
            categories: []
          })}
          className="h-8"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default RadarFilterBar;
