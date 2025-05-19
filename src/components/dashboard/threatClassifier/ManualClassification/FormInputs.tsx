
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormInputsProps {
  url: string;
  setUrl: (url: string) => void;
  platform: string;
  setPlatform: (platform: string) => void;
  content: string;
  setContent: (content: string) => void;
  brand: string;
  setBrand: (brand: string) => void;
  isClassifying: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const FormInputs = ({
  url,
  setUrl,
  platform,
  setPlatform,
  content,
  setContent,
  brand,
  setBrand,
  isClassifying,
  handleSubmit
}: FormInputsProps) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Input
            id="platform"
            placeholder="e.g., Twitter, Reddit"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL (optional)</Label>
          <Input
            id="url"
            placeholder="https://example.com/post"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="brand">Brand Name</Label>
        <Input
          id="brand"
          placeholder="Your brand name"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content to Classify</Label>
        <Textarea
          id="content"
          placeholder="Enter the content you want to classify..."
          className="min-h-[150px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      
      <Button 
        type="submit"
        className="w-full"
        disabled={isClassifying || !content.trim()}
      >
        {isClassifying ? "Classifying..." : "Classify Content"}
      </Button>
    </form>
  );
};

export default FormInputs;
