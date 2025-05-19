
import { useState, useMemo } from "react";
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
  CardFooter,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Filter, 
  Check, 
  Flag, 
  ExternalLink, 
  FileText, 
  SortAsc, 
  SortDesc 
} from "lucide-react";
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";

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
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting state
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filtering state
  const [filteredMentions, setFilteredMentions] = useState<ContentAlert[]>(mentions);
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [severityRange, setSeverityRange] = useState<[number, number]>([1, 10]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{
    from?: Date;
    to?: Date;
  }>({});

  // Get unique sources for the dropdown
  const sources = Array.from(new Set(mentions.map((mention) => mention.platform)));

  // Get unique categories for the dropdown
  const categories = Array.from(
    new Set(mentions.map((mention) => mention.category).filter(Boolean))
  );

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

    // Apply sorting if active
    if (sortField) {
      filtered = sortData(filtered);
    }

    setFilteredMentions(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedSource("all");
    setSeverityRange([1, 10]);
    setSelectedCategory("all");
    setDateRange({});
    setSortField(null);
    setSortDirection('desc');
    setFilteredMentions(mentions);
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if already sorting by this field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort data based on current sort settings
  const sortData = (data: ContentAlert[]) => {
    if (!sortField) return data;
    
    return [...data].sort((a: any, b: any) => {
      if (!a[sortField] && !b[sortField]) return 0;
      if (!a[sortField]) return 1;
      if (!b[sortField]) return -1;
      
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      const compareResult = 
        typeof aValue === 'string' 
          ? aValue.localeCompare(bValue)
          : aValue - bValue;
          
      return sortDirection === 'asc' ? compareResult : -compareResult;
    });
  };

  // Update whenever mentions, sort, or filters change
  useMemo(() => {
    let filtered = [...mentions];
    
    if (sortField) {
      filtered = sortData(filtered);
    }
    
    setFilteredMentions(filtered);
  }, [mentions, sortField, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredMentions.slice(startIndex, endIndex);
  }, [filteredMentions, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredMentions.length / itemsPerPage);

  // Generate page numbers for pagination display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page and neighbors, and last page
      pages.push(1);
      
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (startPage > 2) pages.push(-1); // -1 represents ellipsis
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages - 1) pages.push(-1);
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  // Export data as CSV
  const exportToCSV = () => {
    // Convert data to CSV string
    const headers = ["Platform", "Content", "Category", "Severity", "Date", "URL"];
    
    const csvContent = [
      headers.join(','),
      ...filteredMentions.map(mention => [
        `"${mention.platform || ''}"`,
        `"${(mention.content || '').replace(/"/g, '""')}"`, // Escape quotes in content
        `"${mention.category || ''}"`,
        `"${mention.severity || ''}"`,
        `"${mention.date || ''}"`,
        `"${mention.url || ''}"`
      ].join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mentions_export_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Export successful", {
      description: `${filteredMentions.length} records exported to CSV`
    });
  };

  // Get severity class for styling
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

  // Get category class for styling
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

  // Get sort icon
  const getSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <SortAsc className="h-4 w-4 inline ml-1" /> : 
      <SortDesc className="h-4 w-4 inline ml-1" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Brand Mentions Monitor</CardTitle>
        <CardDescription>
          View and filter mentions across multiple platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters section */}
        <div className="flex flex-col md:flex-row gap-4 items-end flex-wrap">
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

        {/* Export button */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {filteredMentions.length} mentions found
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Export to CSV
          </Button>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('platform')} className="cursor-pointer">
                Source {getSortIcon('platform')}
              </TableHead>
              <TableHead onClick={() => handleSort('content')} className="cursor-pointer">
                Content {getSortIcon('content')}
              </TableHead>
              <TableHead onClick={() => handleSort('category')} className="cursor-pointer">
                Category {getSortIcon('category')}
              </TableHead>
              <TableHead onClick={() => handleSort('severity')} className="cursor-pointer">
                Severity {getSortIcon('severity')}
              </TableHead>
              <TableHead onClick={() => handleSort('date')} className="cursor-pointer">
                Date {getSortIcon('date')}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No mentions match your current filters
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((mention) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-4">
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">Items per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(val) => setItemsPerPage(Number(val))}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue>{itemsPerPage}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {getPageNumbers().map((pageNumber, i) => (
                  pageNumber === -1 ? (
                    <PaginationItem key={`ellipsis-${i}`}>
                      <div className="flex h-9 w-9 items-center justify-center">...</div>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={pageNumber === currentPage}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                ))}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MentionsTable;
