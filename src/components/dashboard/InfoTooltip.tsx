
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface InfoTooltipProps {
  text: string;
  detailed?: string;
  position?: "top" | "bottom" | "left" | "right";
}

const InfoTooltip = ({ 
  text, 
  detailed, 
  position = "top"
}: InfoTooltipProps) => {
  if (detailed) {
    // Use Popover for more detailed information
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
            <Info className="h-4 w-4 text-muted-foreground ml-1 cursor-help" />
            <span className="sr-only">More information</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side={position} className="max-w-sm">
          <div className="space-y-2">
            <p className="font-medium">{text}</p>
            <p className="text-sm text-muted-foreground">{detailed}</p>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
  
  // Use Tooltip for simple information
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-4 w-4 text-muted-foreground ml-1 cursor-help" />
      </TooltipTrigger>
      <TooltipContent side={position}>
        <p className="max-w-xs">{text}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default InfoTooltip;
