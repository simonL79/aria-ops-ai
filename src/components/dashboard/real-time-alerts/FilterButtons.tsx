
import { Button } from "@/components/ui/button";
import { BellRing, AlertTriangle, AlertCircle, AlertOctagon, MessageSquare } from "lucide-react";

interface FilterButtonsProps {
  currentFilter: 'all' | 'high' | 'new';
  onFilterChange: (filter: 'all' | 'high' | 'new') => void;
}

const FilterButtons = ({ currentFilter, onFilterChange }: FilterButtonsProps) => {
  return (
    <div className="flex items-center space-x-1">
      <Button
        variant={currentFilter === "all" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 text-xs"
        onClick={() => onFilterChange("all")}
      >
        <BellRing className="h-3.5 w-3.5 mr-1" />
        All
      </Button>
      <Button
        variant={currentFilter === "high" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 text-xs"
        onClick={() => onFilterChange("high")}
      >
        <AlertOctagon className="h-3.5 w-3.5 mr-1 text-red-500" />
        High
      </Button>
      <Button
        variant={currentFilter === "new" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 text-xs"
        onClick={() => onFilterChange("new")}
      >
        <AlertCircle className="h-3.5 w-3.5 mr-1 text-blue-500" />
        New
      </Button>
    </div>
  );
};

export default FilterButtons;
