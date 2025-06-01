
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ScheduleFormProps {
  formData: {
    name: string;
    frequency: string;
    time: string;
    platforms: string[];
    articleCount: number;
    entityName: string;
    keywords: string;
  };
  setFormData: (data: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const availablePlatforms = [
  'github-pages',
  'netlify', 
  'vercel',
  'cloudflare',
  'firebase',
  'surge'
];

const ScheduleForm = ({ formData, setFormData, onSubmit, onCancel }: ScheduleFormProps) => {
  return (
    <div className="mb-6 p-4 bg-corporate-darkSecondary rounded-lg border border-corporate-border">
      <h3 className="font-medium text-white mb-4">Create New Schedule</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="schedule-name" className="text-corporate-lightGray">Schedule Name</Label>
          <Input
            id="schedule-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Daily Simon Lindsay Campaign"
            className="bg-corporate-darkSecondary border-corporate-border text-white"
          />
        </div>
        
        <div>
          <Label htmlFor="entity-name" className="text-corporate-lightGray">Entity Name</Label>
          <Input
            id="entity-name"
            value={formData.entityName}
            onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
            placeholder="e.g., Simon Lindsay"
            className="bg-corporate-darkSecondary border-corporate-border text-white"
          />
        </div>

        <div>
          <Label htmlFor="frequency" className="text-corporate-lightGray">Frequency</Label>
          <Select value={formData.frequency} onValueChange={(value) => setFormData({ ...formData, frequency: value })}>
            <SelectTrigger className="bg-corporate-darkSecondary border-corporate-border text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="time" className="text-corporate-lightGray">Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="bg-corporate-darkSecondary border-corporate-border text-white"
          />
        </div>

        <div>
          <Label htmlFor="article-count" className="text-corporate-lightGray">Articles per Run</Label>
          <Input
            id="article-count"
            type="number"
            min="1"
            max="50"
            value={formData.articleCount}
            onChange={(e) => setFormData({ ...formData, articleCount: parseInt(e.target.value) })}
            className="bg-corporate-darkSecondary border-corporate-border text-white"
          />
        </div>

        <div>
          <Label htmlFor="keywords" className="text-corporate-lightGray">Keywords (comma-separated)</Label>
          <Input
            id="keywords"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            placeholder="e.g., reputation management, digital strategy"
            className="bg-corporate-darkSecondary border-corporate-border text-white"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label className="text-corporate-lightGray">Deployment Platforms</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {availablePlatforms.map((platform) => (
            <Button
              key={platform}
              size="sm"
              variant={formData.platforms.includes(platform) ? "default" : "outline"}
              onClick={() => {
                const newPlatforms = formData.platforms.includes(platform)
                  ? formData.platforms.filter(p => p !== platform)
                  : [...formData.platforms, platform];
                setFormData({ ...formData, platforms: newPlatforms });
              }}
              className={formData.platforms.includes(platform) 
                ? "bg-corporate-accent text-black" 
                : "border-corporate-border text-corporate-lightGray hover:bg-corporate-accent hover:text-black"
              }
            >
              {platform}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-corporate-border text-corporate-lightGray"
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
        >
          Create Schedule
        </Button>
      </div>
    </div>
  );
};

export default ScheduleForm;
