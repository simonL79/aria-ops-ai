
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader, Send } from 'lucide-react';

interface ManualClassificationFormProps {
  onClassify: (platform: string, content: string) => Promise<void>;
}

const ManualClassificationForm = ({ onClassify }: ManualClassificationFormProps) => {
  const [customContent, setCustomContent] = useState("");
  const [customPlatform, setCustomPlatform] = useState("Twitter");
  const [isClassifying, setIsClassifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customContent.trim()) return;
    
    setIsClassifying(true);
    try {
      await onClassify(customPlatform, customContent);
      setCustomContent("");
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <div className="border rounded-md p-3 mt-2">
      <h3 className="text-sm font-medium mb-2">Manual Content Classification</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid gap-2">
          <Label htmlFor="platform">Platform</Label>
          <select
            id="platform"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={customPlatform}
            onChange={(e) => setCustomPlatform(e.target.value)}
          >
            <option value="Twitter">Twitter</option>
            <option value="Reddit">Reddit</option>
            <option value="Google News">Google News</option>
            <option value="Discord">Discord</option>
            <option value="TikTok">TikTok</option>
            <option value="Telegram">Telegram</option>
            <option value="WhatsApp">WhatsApp</option>
          </select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="content">Content</Label>
          <Input
            id="content"
            placeholder="Enter content to classify..."
            value={customContent}
            onChange={(e) => setCustomContent(e.target.value)}
          />
        </div>
        <Button 
          type="submit" 
          size="sm" 
          className="w-full"
          disabled={isClassifying || !customContent.trim()}
        >
          {isClassifying ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Classifying...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Classify & Store
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default ManualClassificationForm;
