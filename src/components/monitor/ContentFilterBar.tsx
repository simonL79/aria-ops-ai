
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentFilterBarProps {
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  selectedSentiment: string;
  setSelectedSentiment: (sentiment: string) => void;
  onFilter: () => void;
}

const ContentFilterBar = ({
  selectedPlatform,
  setSelectedPlatform,
  selectedSentiment,
  setSelectedSentiment,
  onFilter
}: ContentFilterBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input placeholder="Search content..." />
      </div>
      <div className="flex gap-2">
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="Twitter">Twitter</SelectItem>
            <SelectItem value="Facebook">Facebook</SelectItem>
            <SelectItem value="Reddit">Reddit</SelectItem>
            <SelectItem value="Yelp">Yelp</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedSentiment} onValueChange={setSelectedSentiment}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sentiment</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="action" onClick={onFilter}>Filter</Button>
      </div>
    </div>
  );
};

export default ContentFilterBar;
