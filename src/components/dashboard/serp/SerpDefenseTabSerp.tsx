
import { AlertTriangle, Shield } from "lucide-react";
import SerpResultItem from "./SerpResultItem";
import { SERPResult } from "../../../types/serp";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SerpDefenseTabSerpProps {
  keyword: string;
  serpResults: SERPResult[];
}

const SerpDefenseTabSerp = ({ keyword, serpResults }: SerpDefenseTabSerpProps) => {
  // Count negative results for highlighting
  const negativeResults = serpResults.filter(result => result.type === "negative");
  const hasNegativeResults = negativeResults.length > 0;
  
  // Find the highest ranked negative result (lowest position number)
  const highestNegativePosition = hasNegativeResults 
    ? Math.min(...negativeResults.map(result => result.position))
    : null;

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm">
          <span className="font-medium">Monitoring keyword:</span> {keyword}
        </div>
        <div className="text-xs bg-gray-100 px-3 py-1 rounded-full">
          {serpResults.length} results
        </div>
      </div>
      
      <div className="space-y-3">
        {serpResults.map((result) => (
          <SerpResultItem 
            key={result.url} 
            result={result} 
            isHighlighted={result.type === "negative"}
          />
        ))}
      </div>
      
      {hasNegativeResults && (
        <Alert variant="destructive" className="mt-6 bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <span className="font-semibold">Alert:</span> {negativeResults.length} negative {negativeResults.length === 1 ? 'result' : 'results'} detected
              {highestNegativePosition && ` (highest at position #${highestNegativePosition})`}
            </div>
            <Shield className="h-4 w-4 text-red-600 ml-2" />
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SerpDefenseTabSerp;
