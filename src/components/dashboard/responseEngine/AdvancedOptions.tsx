
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languageOptions } from "./constants";

interface AdvancedOptionsProps {
  selectedPlatform: string;
  setPlatform: (platform: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const AdvancedOptions = ({ 
  selectedPlatform, 
  setPlatform, 
  language, 
  setLanguage 
}: AdvancedOptionsProps) => {
  return (
    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
      <div>
        <label className="text-xs font-medium mb-1 block">Platform Context</label>
        <Select value={selectedPlatform} onValueChange={setPlatform}>
          <SelectTrigger>
            <SelectValue placeholder="Select platform (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            <SelectItem value="Twitter">Twitter</SelectItem>
            <SelectItem value="Facebook">Facebook</SelectItem>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="Yelp">Yelp</SelectItem>
            <SelectItem value="Reddit">Reddit</SelectItem>
            <SelectItem value="TripAdvisor">TripAdvisor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-xs font-medium mb-1 block">Response Language</label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AdvancedOptions;
