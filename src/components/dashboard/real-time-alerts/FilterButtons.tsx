
import { Button } from "@/components/ui/button";

interface FilterButtonsProps {
  filter: 'all' | 'high' | 'medium' | 'low';
  setFilter: (filter: 'all' | 'high' | 'medium' | 'low') => void;
}

const FilterButtons = ({ filter, setFilter }: FilterButtonsProps) => {
  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setFilter('all')}
        className={`px-2 h-7 ${filter === 'all' ? 'bg-secondary' : ''}`}
      >
        All
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setFilter('high')}
        className={`px-2 h-7 ${filter === 'high' ? 'bg-secondary' : ''}`}
      >
        High
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setFilter('medium')}
        className={`px-2 h-7 ${filter === 'medium' ? 'bg-secondary' : ''}`}
      >
        Medium
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => setFilter('low')}
        className={`px-2 h-7 ${filter === 'low' ? 'bg-secondary' : ''}`}
      >
        Low
      </Button>
    </div>
  );
};

export default FilterButtons;
