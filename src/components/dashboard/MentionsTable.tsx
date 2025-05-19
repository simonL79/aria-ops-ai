
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Flag, Check, ExternalLink, Filter } from "lucide-react";
import { ContentAlert } from "@/types/dashboard";

interface MentionsTableProps {
  mentions: ContentAlert[];
  onViewDetail?: (mention: ContentAlert) => void;
  onMarkResolved?: (id: string) => void;
  onEscalate?: (id: string) => void;
}

const MentionsTable = ({
  mentions,
  onViewDetail,
  onMarkResolved,
  onEscalate,
}: MentionsTableProps) => {
  const [filteredMentions, setFilteredMentions] = useState<ContentAlert[]>(mentions);
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [severityRange, setSeverityRange] = useState<[number, number]>([1, 10]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  // Apply filters
  const applyFilters = () => {
    let filtered = [...mentions];

    // Filter by source
    if (selectedSource !== "all") {
      filtered = filtered.filter((mention) => mention.platform === selectedSource);
    }

    // Filter by severity
    filtered = filtered.filter((mention) => {
      const severityMap = {
        'low': 1,
        'medium': 5,
        'high': 8
      };
      const severityNum = severityMap[mention.severity as keyof typeof severityMap] || 1;
      return severityNum >= severityRange[0] && severityNum <= severityRange[1];
    });

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((mention) => mention.category === selectedCategory);
    }

    // Filter by date range
    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((mention) => {
        const mentionDate = new Date(mention.date);
        let isInRange = true;
        
        if (dateRange.from) {
          isInRange = mentionDate >= dateRange.from;
        }
        
        if (isInRange && dateRange.to) {
          isInRange = mentionDate <= dateRange.to;
        }
        
        return isInRange;
      });
    }

    setFilteredMentions(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedSource("all");
    setSeverityRange([1, 10]);
    setSelectedCategory("all");
    setDateRange({});
    setFilteredMentions(mentions);
  };

  // Get unique sources for the dropdown
  const sources = Array.from(new Set(mentions.map((mention) => mention.platform)));

  // Get unique categories for the dropdown
  const categories = Array.from(
    new Set(mentions.map((mention) => mention.category).filter(Boolean))
  );

  // Get severity class
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get category class
  const getCategoryClass = (category?: string) => {
    switch (category) {
      case "Reputation Threat":
        return "bg-red-100 text-red-800";
      case "Misinformation":
        return "bg-purple-100 text-purple-800";
      case "Legal Risk":
        return "bg-orange-100 text-orange-800";
      case "Complaint":
        return "bg-yellow-100 text-yellow-800";
      case "Positive":
        return "bg-green-100 text-green-800";
      case "Neutral":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Brand Mentions Monitor</CardTitle>
        <CardDescription>
          View and filter mentions across multiple platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Source filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <Select
                value={selectedSource}
                onValueChange={setSelectedSource}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All sources</SelectItem>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Severity slider */}
            <div className="space-y-2 w-full md:w-[200px]">
              <label className="text-sm font-medium">
                Severity: {severityRange[0]} - {severityRange[1]}
              </label>
              <Slider
                defaultValue={[1, 10]}
                max={10}
                min={1}
                step={1}
                value={severityRange}
                onValueChange={(value: [number, number]) => setSeverityRange(value)}
              />
            </div>

            {/* Date range picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-[110px]"
                    >
                      {dateRange.from ? (
                        format(dateRange.from, "PP")
                      ) : (
                        <span>From</span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) =>
                        setDateRange((prev) => ({ ...prev, from: date }))
                      }
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-[110px]"
                    >
                      {dateRange.to ? (
                        format(dateRange.to, "PP")
                      ) : (
                        <span>To</span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) =>
                        setDateRange((prev) => ({ ...prev, to: date }))
                      }
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Filter actions */}
            <div className="flex gap-2">
              <Button onClick={applyFilters} className="gap-2">
                <Filter className="h-4 w-4" />
                Apply Filters
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMentions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No mentions match your current filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredMentions.map((mention) => (
                  <TableRow key={mention.id}>
                    <TableCell>
                      <Badge variant="outline">{mention.platform}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate">{mention.content}</div>
                    </TableCell>
                    <TableCell>
                      {mention.category && (
                        <Badge className={getCategoryClass(mention.category)}>
                          {mention.category}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityClass(mention.severity)}>
                        {mention.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{mention.date}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetail && onViewDetail(mention)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMarkResolved && onMarkResolved(mention.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEscalate && onEscalate(mention.id)}
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentionsTable;
