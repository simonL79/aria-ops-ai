
import { Separator } from "@/components/ui/separator";
import { ContentItem as ContentItemType } from "@/types/monitor";
import ContentItem from "./ContentItem";

interface ContentListProps {
  items: ContentItemType[];
  getSentimentColor: (sentiment: string) => string;
  getImpactColor: (impact: string) => string;
  filterBySentiment?: string;
}

const ContentList = ({ 
  items, 
  getSentimentColor, 
  getImpactColor,
  filterBySentiment 
}: ContentListProps) => {
  const filteredItems = filterBySentiment && filterBySentiment !== 'all' 
    ? items.filter(item => item.sentiment === filterBySentiment)
    : items;

  return (
    <div className="space-y-0 border rounded-md">
      {filteredItems.map((item, idx, arr) => (
        <ContentItem 
          key={item.id}
          item={item}
          getSentimentColor={getSentimentColor}
          getImpactColor={getImpactColor}
          isLast={idx === arr.length - 1}
        />
      ))}
    </div>
  );
};

export default ContentList;
