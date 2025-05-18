
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { SERPResult } from "../../../types/serp";

interface SerpResultItemProps {
  result: SERPResult;
  isHighlighted?: boolean;
}

const SerpResultItem = ({ result, isHighlighted = false }: SerpResultItemProps) => {
  const positionChange = result.previousPosition - result.position;
  const hasImproved = positionChange > 0; // Lower number = higher position = improvement
  const hasDeclined = positionChange < 0;
  const noChange = positionChange === 0;
  
  return (
    <div className={`border rounded-md p-3 flex justify-between items-center transition-colors ${
      isHighlighted ? 'border-red-200 bg-red-50' : ''
    }`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md text-center min-w-[28px] font-medium ${
          isHighlighted ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {result.position}
        </div>
        <div className="max-w-[280px]">
          <div className="font-medium text-sm line-clamp-1">{result.title}</div>
          <div className="text-xs text-muted-foreground truncate">{result.url}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <Badge variant={
            result.type === "owned" ? "outline" : 
            result.type === "negative" ? "destructive" : "secondary"
          } className={`${result.type === "negative" ? "border-red-200" : ""}`}>
            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
          </Badge>
          
          <div className="text-xs mt-1 text-muted-foreground">
            Previous: {result.previousPosition}
          </div>
        </div>
        
        <div className={`flex items-center gap-1 px-2 py-1 rounded ${
          hasImproved ? "bg-green-100 text-green-700" : 
          hasDeclined ? "bg-red-100 text-red-700" : 
          "bg-gray-100 text-gray-600"
        }`}>
          {hasImproved ? (
            <ArrowUp className="h-4 w-4" />
          ) : hasDeclined ? (
            <ArrowDown className="h-4 w-4" />
          ) : (
            <Minus className="h-4 w-4" />
          )}
          <span className="text-xs font-medium">{Math.abs(positionChange) || "0"}</span>
        </div>
      </div>
    </div>
  );
};

export default SerpResultItem;
