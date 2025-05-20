
import { Button } from "@/components/ui/button";
import { BellRing, AlertTriangle, AlertCircle, AlertOctagon, MessageSquare } from "lucide-react";

interface FilterButtonsProps {
  filter: 'all' | 'high' | 'medium' | 'low' | 'customer';
  setFilter: (filter: 'all' | 'high' | 'medium' | 'low' | 'customer') => void;
}

const FilterButtons = ({ filter, setFilter }: FilterButtonsProps) => {
  return (
    <div className="flex items-center space-x-1">
      <Button
        variant={filter === "all" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 text-xs"
        onClick={() => setFilter("all")}
      >
        <BellRing className="h-3.5 w-3.5 mr-1" />
        All
      </Button>
      <Button
        variant={filter === "high" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 text-xs"
        onClick={() => setFilter("high")}
      >
        <AlertOctagon className="h-3.5 w-3.5 mr-1 text-red-500" />
        High
      </Button>
      <Button
        variant={filter === "medium" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 text-xs"
        onClick={() => setFilter("medium")}
      >
        <AlertTriangle className="h-3.5 w-3.5 mr-1 text-amber-500" />
        Medium
      </Button>
      <Button
        variant={filter === "low" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 text-xs"
        onClick={() => setFilter("low")}
      >
        <AlertCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
        Low
      </Button>
      <Button
        variant={filter === "customer" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 text-xs"
        onClick={() => setFilter("customer")}
      >
        <MessageSquare className="h-3.5 w-3.5 mr-1 text-blue-500" />
        Customer
      </Button>
    </div>
  );
};

export default FilterButtons;
