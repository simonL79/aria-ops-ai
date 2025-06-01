
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

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
  'Medium',
  'LinkedIn',
  'WordPress',
  'Ghost',
  'Substack',
  'Dev.to',
  'Hashnode'
];

const ScheduleForm = ({ formData, setFormData, onSubmit, onCancel }: ScheduleFormProps) => {
  const handlePlatformChange = (platform: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        platforms: [...formData.platforms, platform]
      });
    } else {
      setFormData({
        ...formData,
        platforms: formData.platforms.filter(p => p !== platform)
      });
    }
  };

  const handleArticleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only update if it's a valid number or empty string
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setFormData({
        ...formData,
        articleCount: value === '' ? 0 : Number(value)
      });
    }
  };

  return (
    <Card className="mb-6 border-corporate-accent bg-corporate-darkSecondary">
      <CardHeader>
        <CardTitle className="text-corporate-accent">Create New Scheduled Deployment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-corporate-lightGray">Schedule Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Daily Brand Monitoring"
              className="bg-corporate-dark border-corporate-border text-white"
            />
          </div>

          <div>
            <Label htmlFor="entityName" className="text-corporate-lightGray">Entity Name</Label>
            <Input
              id="entityName"
              value={formData.entityName}
              onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
              placeholder="Company or individual name"
              className="bg-corporate-dark border-corporate-border text-white"
            />
          </div>

          <div>
            <Label className="text-corporate-lightGray">Frequency</Label>
            <Select 
              value={formData.frequency} 
              onValueChange={(value) => setFormData({ ...formData, frequency: value })}
            >
              <SelectTrigger className="bg-corporate-dark border-corporate-border text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
              className="bg-corporate-dark border-corporate-border text-white"
            />
          </div>

          <div>
            <Label htmlFor="articleCount" className="text-corporate-lightGray">Article Count</Label>
            <Input
              id="articleCount"
              type="number"
              min="1"
              value={formData.articleCount || ''}
              onChange={handleArticleCountChange}
              placeholder="10"
              className="bg-corporate-dark border-corporate-border text-white"
            />
          </div>

          <div>
            <Label htmlFor="keywords" className="text-corporate-lightGray">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
              placeholder="brand name, reputation, crisis"
              className="bg-corporate-dark border-corporate-border text-white"
            />
          </div>
        </div>

        <div>
          <Label className="text-corporate-lightGray mb-2 block">Deployment Platforms</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {availablePlatforms.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={platform}
                  checked={formData.platforms.includes(platform)}
                  onCheckedChange={(checked) => handlePlatformChange(platform, !!checked)}
                />
                <Label htmlFor={platform} className="text-corporate-lightGray text-sm">
                  {platform}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onSubmit}
            className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
          >
            Create Schedule
          </Button>
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-corporate-border text-corporate-lightGray hover:bg-corporate-dark"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleForm;
