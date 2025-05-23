
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Rss } from "lucide-react";
import { MonitoringSource } from './types';
import { toast } from "sonner";

interface CustomRSSFormProps {
  onAddSource: (source: MonitoringSource) => void;
}

const CustomRSSForm: React.FC<CustomRSSFormProps> = ({ onAddSource }) => {
  const [customRSSUrl, setCustomRSSUrl] = useState('');

  const addCustomRSSFeed = () => {
    if (!customRSSUrl.trim()) {
      toast.error('Please enter a valid RSS URL');
      return;
    }
    
    const newSource: MonitoringSource = {
      id: `custom-rss-${Date.now()}`,
      name: `Custom UK Celebrity/Sports Feed`,
      type: 'news',
      platform: 'Custom',
      enabled: true,
      status: 'inactive',
      icon: <Rss className="h-4 w-4" />,
      description: customRSSUrl
    };
    
    onAddSource(newSource);
    setCustomRSSUrl('');
    toast.success('Custom UK celebrity/sports RSS feed added');
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="rss-url">Add Custom UK Celebrity/Sports RSS Feed</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="rss-url"
                placeholder="https://uk-celebrity-news-site.com/rss.xml"
                value={customRSSUrl}
                onChange={(e) => setCustomRSSUrl(e.target.value)}
              />
              <Button onClick={addCustomRSSFeed}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomRSSForm;
