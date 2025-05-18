
import { AlertTriangle } from "lucide-react";
import SerpResultItem from "./SerpResultItem";
import { SERPResult } from "../../../types/serp";

interface SerpDefenseTabSerpProps {
  keyword: string;
  serpResults: SERPResult[];
}

const SerpDefenseTabSerp = ({ keyword, serpResults }: SerpDefenseTabSerpProps) => {
  return (
    <div>
      <div className="mb-4 text-sm">
        <span className="font-medium">Monitoring keyword:</span> {keyword}
      </div>
      
      <div className="space-y-2">
        {serpResults.map((result) => (
          <SerpResultItem key={result.url} result={result} />
        ))}
      </div>
      
      <div className="mt-4 p-2 border rounded-md bg-amber-50 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <div className="text-xs">
          <span className="font-medium">Alert:</span> Negative content on position #4 - implement defense tactics.
        </div>
      </div>
    </div>
  );
};

export default SerpDefenseTabSerp;
