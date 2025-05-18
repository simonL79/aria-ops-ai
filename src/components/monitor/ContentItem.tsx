
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ContentItem as ContentItemType } from "@/types/monitor";

interface ContentItemProps {
  item: ContentItemType;
  getSentimentColor: (sentiment: string) => string;
  getImpactColor: (impact: string) => string;
  isLast: boolean;
}

const ContentItem = ({ item, getSentimentColor, getImpactColor, isLast }: ContentItemProps) => {
  return (
    <div key={item.id}>
      <div className="p-4">
        <div className="flex flex-wrap justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">{item.platform}</span>
            <Badge variant="outline">{item.type}</Badge>
          </div>
          <div className="flex gap-2">
            <Badge className={getSentimentColor(item.sentiment)}>
              {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
            </Badge>
            <Badge variant="outline" className={getImpactColor(item.impact)}>
              {item.impact === 'high' ? 'High Impact' : 
              item.impact === 'medium' ? 'Medium Impact' : 'Low Impact'}
            </Badge>
          </div>
        </div>
        <p className="text-sm mb-2">{item.content}</p>
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground">{item.date}</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">View</Button>
            {item.sentiment === 'negative' && (
              <>
                <Button size="sm" variant="outline">Hide</Button>
                <Button size="sm" variant="destructive">Request Removal</Button>
              </>
            )}
            {item.sentiment === 'neutral' && (
              <Button size="sm" variant="outline">Monitor</Button>
            )}
            {item.sentiment === 'positive' && (
              <Button size="sm" variant="outline">Highlight</Button>
            )}
          </div>
        </div>
      </div>
      {!isLast && <Separator />}
    </div>
  );
};

export default ContentItem;
