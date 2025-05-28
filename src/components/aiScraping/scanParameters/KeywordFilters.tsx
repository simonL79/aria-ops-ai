
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface KeywordFiltersProps {
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
}

const KeywordFilters = ({ keywords, onAddKeyword, onRemoveKeyword }: KeywordFiltersProps) => {
  const [currentKeyword, setCurrentKeyword] = useState("");
  
  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !keywords?.includes(currentKeyword.trim())) {
      onAddKeyword(currentKeyword.trim());
      setCurrentKeyword("");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  return (
    <div className="space-y-2">
      <Label>Keyword Filters</Label>
      <div className="flex space-x-2">
        <Input
          placeholder="Add keyword to filter by..."
          value={currentKeyword}
          onChange={(e) => setCurrentKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button onClick={handleAddKeyword} type="button" variant="outline">Add</Button>
      </div>
      
      {keywords && keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {keywords.map(kw => (
            <Badge key={kw} variant="secondary" className="flex items-center gap-1">
              {kw}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onRemoveKeyword(kw)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordFilters;
