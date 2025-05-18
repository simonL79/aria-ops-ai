
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";
import { SERPResult } from "../../../types/serp";

interface SerpResultItemProps {
  result: SERPResult;
}

const SerpResultItem = ({ result }: SerpResultItemProps) => {
  return (
    <div className="border rounded-md p-2 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 p-2 rounded-md text-center min-w-[24px]">
          {result.position}
        </div>
        <div>
          <div className="font-medium text-sm line-clamp-1">{result.title}</div>
          <div className="text-xs text-muted-foreground truncate">{result.url}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={
          result.type === "owned" ? "outline" : 
          result.type === "negative" ? "destructive" : "secondary"
        }>
          {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
        </Badge>
        <div className={`flex items-center ${
          result.previousPosition > result.position ? "text-green-600" : 
          result.previousPosition < result.position ? "text-red-600" : ""
        }`}>
          {result.previousPosition > result.position ? (
            <ArrowUp className="h-4 w-4" />
          ) : result.previousPosition < result.position ? (
            <ArrowDown className="h-4 w-4" />
          ) : null}
          <span className="text-xs">{Math.abs(result.previousPosition - result.position) || ""}</span>
        </div>
      </div>
    </div>
  );
};

export default SerpResultItem;
