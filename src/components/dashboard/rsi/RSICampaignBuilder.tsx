
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Play, Pause, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  targetPlatforms: string[];
  keywords: string[];
  responseType: string;
  createdAt: string;
}

const RSICampaignBuilder = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Brand Defense Campaign',
      description: 'Automated responses for negative brand mentions',
      status: 'active',
      targetPlatforms: ['Twitter', 'Reddit'],
      keywords: ['negative review', 'poor service'],
      responseType: 'defensive',
      createdAt: '2024-01-15'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetPlatforms: [] as string[],
    keywords: [] as string[],
    responseType: ''
  });
  const [keywordInput, setKeywordInput] = useState('');

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      targetPlatforms: prev.targetPlatforms.includes(platform)
        ? prev.targetPlatforms.filter(p => p !== platform)
        : [...prev.targetPlatforms, platform]
    }));
  };

  const createCampaign = () => {
    if (!formData.name.trim()) {
      toast.error('Campaign name is required');
      return;
    }

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      status: 'draft',
      targetPlatforms: formData.targetPlatforms,
      keywords: formData.keywords,
      responseType: formData.responseType,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCampaigns(prev => [...prev, newCampaign]);
    setFormData({
      name: '',
      description: '',
      targetPlatforms: [],
      keywords: [],
      responseType: ''
    });
    setShowForm(false);
    toast.success('Campaign created successfully');
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === id) {
        const newStatus = campaign.status === 'active' ? 'paused' : 'active';
        toast.success(`Campaign ${newStatus === 'active' ? 'activated' : 'paused'}`);
        return { ...campaign, status: newStatus };
      }
      return campaign;
    }));
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    toast.success('Campaign deleted');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">RSI Campaign Builder</h3>
          <p className="text-sm text-muted-foreground">Create and manage automated response campaigns</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter campaign name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the campaign objectives"
              />
            </div>

            <div>
              <Label>Target Platforms</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Twitter', 'Reddit', 'Facebook', 'LinkedIn', 'News Sites'].map(platform => (
                  <Button
                    key={platform}
                    variant={formData.targetPlatforms.includes(platform) ? "default" : "outline"}
                    size="sm"
                    onClick={() => togglePlatform(platform)}
                  >
                    {platform}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Keywords</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Add keyword"
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                />
                <Button onClick={addKeyword} variant="outline" size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {formData.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword(keyword)}>
                    {keyword} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="responseType">Response Type</Label>
              <Select value={formData.responseType} onValueChange={(value) => setFormData(prev => ({ ...prev, responseType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select response type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defensive">Defensive - Address concerns</SelectItem>
                  <SelectItem value="proactive">Proactive - Positive messaging</SelectItem>
                  <SelectItem value="corrective">Corrective - Fact correction</SelectItem>
                  <SelectItem value="diversionary">Diversionary - Redirect attention</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={createCampaign}>Create Campaign</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{campaign.name}</h4>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>Platforms: {campaign.targetPlatforms.join(', ')}</span>
                    <span>Keywords: {campaign.keywords.length}</span>
                    <span>Created: {campaign.createdAt}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleCampaignStatus(campaign.id)}
                  >
                    {campaign.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCampaign(campaign.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && !showForm && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground mb-4">Create your first RSI campaign to get started</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RSICampaignBuilder;
