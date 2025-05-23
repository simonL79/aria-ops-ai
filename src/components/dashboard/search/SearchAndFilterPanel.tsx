
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, X } from 'lucide-react';
import { ContentAlert } from '@/types/dashboard';

interface SearchAndFilterPanelProps {
  alerts: ContentAlert[];
  onFilteredResults: (filtered: ContentAlert[]) => void;
}

const SearchAndFilterPanel: React.FC<SearchAndFilterPanelProps> = ({ 
  alerts, 
  onFilteredResults 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const applyFilters = () => {
    let filtered = alerts;

    // Search term filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(alert => 
        alert.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (alert.detectedEntities && alert.detectedEntities.some(entity => 
          entity.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter(alert => alert.platform === platformFilter);
    }

    // Severity filter
    if (severityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case '24h':
          filterDate.setHours(now.getHours() - 24);
          break;
        case '7d':
          filterDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          filterDate.setDate(now.getDate() - 30);
          break;
      }
      
      filtered = filtered.filter(alert => new Date(alert.date) >= filterDate);
    }

    // Update active filters
    const filters = [];
    if (searchTerm.trim()) filters.push(`Search: "${searchTerm}"`);
    if (platformFilter !== 'all') filters.push(`Platform: ${platformFilter}`);
    if (severityFilter !== 'all') filters.push(`Severity: ${severityFilter}`);
    if (dateFilter !== 'all') filters.push(`Date: ${dateFilter}`);
    
    setActiveFilters(filters);
    onFilteredResults(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPlatformFilter('all');
    setSeverityFilter('all');
    setDateFilter('all');
    setActiveFilters([]);
    onFilteredResults(alerts);
  };

  const exportResults = () => {
    // Create CSV content
    const headers = ['Platform', 'Content', 'Severity', 'Date', 'Threat Type'];
    const csvContent = [
      headers.join(','),
      ...alerts.map(alert => [
        alert.platform,
        `"${alert.content.replace(/"/g, '""')}"`,
        alert.severity,
        alert.date,
        alert.threatType || ''
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aria-alerts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const platforms = [...new Set(alerts.map(alert => alert.platform))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search content, platforms, entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={applyFilters}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Platforms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platforms.map(platform => (
                <SelectItem key={platform} value={platform}>{platform}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {filter}
                <X className="h-3 w-3 cursor-pointer" onClick={clearFilters} />
              </Badge>
            ))}
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={exportResults} className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchAndFilterPanel;
