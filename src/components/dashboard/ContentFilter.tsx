
import { Check, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useState } from "react";

interface ContentFilterProps {
  onFilterChange: (filters: {
    platforms: string[];
    severities: string[];
    statuses: string[];
  }) => void;
}

const platforms = [
  { value: "twitter", label: "Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "reddit", label: "Reddit" },
  { value: "yelp", label: "Yelp" },
];

const severities = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const statuses = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "actioned", label: "Actioned" },
];

const ContentFilter = ({ onFilterChange }: ContentFilterProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handlePlatformToggle = (value: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSeverityToggle = (value: string) => {
    setSelectedSeverities((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleStatusToggle = (value: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleApplyFilters = () => {
    onFilterChange({
      platforms: selectedPlatforms,
      severities: selectedSeverities,
      statuses: selectedStatuses,
    });
    setOpen(false);
  };

  const resetFilters = () => {
    setSelectedPlatforms([]);
    setSelectedSeverities([]);
    setSelectedStatuses([]);
    onFilterChange({
      platforms: [],
      severities: [],
      statuses: [],
    });
  };

  const totalFiltersApplied = 
    selectedPlatforms.length +
    selectedSeverities.length +
    selectedStatuses.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="mr-2 h-3.5 w-3.5" />
          Filter
          {totalFiltersApplied > 0 && (
            <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal">
              {totalFiltersApplied}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0" align="end">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Platforms">
              {platforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.value);
                return (
                  <CommandItem
                    key={platform.value}
                    onSelect={() => handlePlatformToggle(platform.value)}
                    className="flex items-center justify-between px-2 py-1"
                  >
                    <span>{platform.label}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Severity">
              {severities.map((severity) => {
                const isSelected = selectedSeverities.includes(severity.value);
                return (
                  <CommandItem
                    key={severity.value}
                    onSelect={() => handleSeverityToggle(severity.value)}
                    className="flex items-center justify-between px-2 py-1"
                  >
                    <span>{severity.label}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Status">
              {statuses.map((status) => {
                const isSelected = selectedStatuses.includes(status.value);
                return (
                  <CommandItem
                    key={status.value}
                    onSelect={() => handleStatusToggle(status.value)}
                    className="flex items-center justify-between px-2 py-1"
                  >
                    <span>{status.label}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <div className="p-2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-1/2"
              onClick={resetFilters}
            >
              Reset
            </Button>
            <Button
              size="sm"
              className="w-1/2"
              onClick={handleApplyFilters}
            >
              Apply
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ContentFilter;
