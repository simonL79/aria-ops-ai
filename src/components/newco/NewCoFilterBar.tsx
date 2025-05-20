
import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { NewCoFilters } from '@/types/newco';

interface NewCoFilterBarProps {
  filters: NewCoFilters;
  onFilterChange: (filters: Partial<NewCoFilters>) => void;
}

const NewCoFilterBar: React.FC<NewCoFilterBarProps> = ({ filters, onFilterChange }) => {
  const jurisdictions = ['United Kingdom', 'United States', 'Canada', 'Australia', 'Germany', 'France'];
  const industries = ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing', 'Environmental Services'];
  const statuses = [
    { value: 'new', label: 'New' },
    { value: 'scanned', label: 'Scanned' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'onboarded', label: 'Onboarded' },
    { value: 'declined', label: 'Declined' }
  ];
  
  const timeframeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];
  
  const cleanLaunchCategories = [
    { value: 'green', label: 'Green (Clean)' },
    { value: 'yellow', label: 'Yellow (Some Issues)' },
    { value: 'red', label: 'Red (High Risk)' }
  ];

  const handleJurisdictionSelect = (jurisdiction: string) => {
    if (filters.jurisdictions.includes(jurisdiction)) {
      onFilterChange({ jurisdictions: filters.jurisdictions.filter(j => j !== jurisdiction) });
    } else {
      onFilterChange({ jurisdictions: [...filters.jurisdictions, jurisdiction] });
    }
  };

  const handleIndustrySelect = (industry: string) => {
    if (filters.industries.includes(industry)) {
      onFilterChange({ industries: filters.industries.filter(i => i !== industry) });
    } else {
      onFilterChange({ industries: [...filters.industries, industry] });
    }
  };

  const handleStatusSelect = (status: 'new' | 'scanned' | 'contacted' | 'onboarded' | 'declined') => {
    if (filters.status.includes(status)) {
      onFilterChange({ status: filters.status.filter(s => s !== status) });
    } else {
      onFilterChange({ status: [...filters.status, status] });
    }
  };

  const handleCleanLaunchSelect = (category: 'green' | 'yellow' | 'red') => {
    if (filters.cleanLaunchCategories.includes(category)) {
      onFilterChange({ cleanLaunchCategories: filters.cleanLaunchCategories.filter(c => c !== category) });
    } else {
      onFilterChange({ cleanLaunchCategories: [...filters.cleanLaunchCategories, category] });
    }
  };

  const handleTimeframeSelect = (timeframe: 'today' | 'this_week' | 'this_month' | 'custom') => {
    onFilterChange({ timeframe });
  };

  const clearFilters = () => {
    onFilterChange({
      jurisdictions: [],
      industries: [],
      status: [],
      cleanLaunchCategories: [],
      timeframe: 'this_week'
    });
  };

  const activeFilterCount = filters.jurisdictions.length + 
    filters.industries.length + 
    filters.status.length + 
    filters.cleanLaunchCategories.length;

  return (
    <div className="flex flex-wrap gap-2 py-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="h-3.5 w-3.5 mr-1" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-1 h-5 px-1.5" variant="secondary">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs">Timeframe</DropdownMenuLabel>
            {timeframeOptions.map((option) => (
              <DropdownMenuItem 
                key={option.value}
                onSelect={() => handleTimeframeSelect(option.value as any)}
                className={filters.timeframe === option.value ? 'bg-secondary' : ''}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs">Jurisdiction</DropdownMenuLabel>
            {jurisdictions.map((jurisdiction) => (
              <DropdownMenuItem 
                key={jurisdiction}
                onSelect={() => handleJurisdictionSelect(jurisdiction)}
                className={filters.jurisdictions.includes(jurisdiction) ? 'bg-secondary' : ''}
              >
                {jurisdiction}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs">Industry</DropdownMenuLabel>
            {industries.map((industry) => (
              <DropdownMenuItem 
                key={industry}
                onSelect={() => handleIndustrySelect(industry)}
                className={filters.industries.includes(industry) ? 'bg-secondary' : ''}
              >
                {industry}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs">Status</DropdownMenuLabel>
            {statuses.map((status) => (
              <DropdownMenuItem 
                key={status.value}
                onSelect={() => handleStatusSelect(status.value as any)}
                className={filters.status.includes(status.value as any) ? 'bg-secondary' : ''}
              >
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs">Clean Launch Score</DropdownMenuLabel>
            {cleanLaunchCategories.map((category) => (
              <DropdownMenuItem 
                key={category.value}
                onSelect={() => handleCleanLaunchSelect(category.value as any)}
                className={filters.cleanLaunchCategories.includes(category.value as any) ? 'bg-secondary' : ''}
              >
                {category.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {filters.timeframe && (
        <Badge variant="secondary" className="h-8 px-3">
          {timeframeOptions.find(o => o.value === filters.timeframe)?.label}
        </Badge>
      )}

      {filters.jurisdictions.map(jurisdiction => (
        <Badge key={jurisdiction} variant="secondary" className="h-8 px-3">
          {jurisdiction}
          <button onClick={() => handleJurisdictionSelect(jurisdiction)} className="ml-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.industries.map(industry => (
        <Badge key={industry} variant="secondary" className="h-8 px-3">
          {industry}
          <button onClick={() => handleIndustrySelect(industry)} className="ml-1">
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.status.map(status => {
        const label = statuses.find(s => s.value === status)?.label;
        return (
          <Badge key={status} variant="secondary" className="h-8 px-3">
            {label}
            <button onClick={() => handleStatusSelect(status)} className="ml-1">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}

      {filters.cleanLaunchCategories.map(category => {
        const label = cleanLaunchCategories.find(c => c.value === category)?.label;
        return (
          <Badge key={category} variant="secondary" className="h-8 px-3">
            {label}
            <button onClick={() => handleCleanLaunchSelect(category)} className="ml-1">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        );
      })}

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
          Clear all
        </Button>
      )}
    </div>
  );
};

export default NewCoFilterBar;
