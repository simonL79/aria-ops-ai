
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PrioritySelectorProps {
  priority?: 'high' | 'medium' | 'low';
  onPriorityChange: (priority?: 'high' | 'medium' | 'low') => void;
}

const PrioritySelector = ({ priority, onPriorityChange }: PrioritySelectorProps) => {
  const handleValueChange = (value: string) => {
    if (value === "none") {
      onPriorityChange(undefined);
    } else if (value === "high" || value === "medium" || value === "low") {
      onPriorityChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Priority Level</Label>
      <Select 
        value={priority || "none"}
        onValueChange={handleValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select priority level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">All Priorities</SelectItem>
          <SelectItem value="high">High Priority</SelectItem>
          <SelectItem value="medium">Medium Priority</SelectItem>
          <SelectItem value="low">Low Priority</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PrioritySelector;
