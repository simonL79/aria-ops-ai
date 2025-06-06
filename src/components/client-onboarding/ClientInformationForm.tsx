
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface ClientInformationFormProps {
  onSubmit: (data: any) => void;
  isProcessing: boolean;
}

const ClientInformationForm = ({ onSubmit, isProcessing }: ClientInformationFormProps) => {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    contactName: '',
    contactEmail: '',
    description: '',
    focusAreas: [] as string[],
    entities: [] as Array<{ name: string; type: string; description: string; }>
  });

  const [newEntity, setNewEntity] = useState({ name: '', type: 'brand', description: '' });
  const [newFocusArea, setNewFocusArea] = useState('');

  const addEntity = () => {
    if (newEntity.name.trim()) {
      setFormData(prev => ({
        ...prev,
        entities: [...prev.entities, newEntity]
      }));
      setNewEntity({ name: '', type: 'brand', description: '' });
    }
  };

  const removeEntity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      entities: prev.entities.filter((_, i) => i !== index)
    }));
  };

  const addFocusArea = () => {
    if (newFocusArea.trim() && !formData.focusAreas.includes(newFocusArea.trim())) {
      setFormData(prev => ({
        ...prev,
        focusAreas: [...prev.focusAreas, newFocusArea.trim()]
      }));
      setNewFocusArea('');
    }
  };

  const removeFocusArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.filter(a => a !== area)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.companyName && formData.contactEmail && formData.entities.length > 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
            className="bg-corporate-dark border-corporate-border text-white"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            value={formData.industry}
            onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            className="bg-corporate-dark border-corporate-border text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactName">Contact Name *</Label>
          <Input
            id="contactName"
            value={formData.contactName}
            onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
            className="bg-corporate-dark border-corporate-border text-white"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="contactEmail">Contact Email *</Label>
          <Input
            id="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
            className="bg-corporate-dark border-corporate-border text-white"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Company Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="bg-corporate-dark border-corporate-border text-white"
          rows={3}
        />
      </div>

      {/* Focus Areas */}
      <div>
        <Label>Focus Areas</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newFocusArea}
            onChange={(e) => setNewFocusArea(e.target.value)}
            placeholder="Add focus area..."
            className="bg-corporate-dark border-corporate-border text-white"
          />
          <Button type="button" onClick={addFocusArea} variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.focusAreas.map(area => (
            <Badge key={area} variant="secondary" className="gap-1">
              {area}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFocusArea(area)} />
            </Badge>
          ))}
        </div>
      </div>

      {/* Entities to Monitor */}
      <div>
        <Label>Entities to Monitor *</Label>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Input
              value={newEntity.name}
              onChange={(e) => setNewEntity(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Entity name..."
              className="bg-corporate-dark border-corporate-border text-white"
            />
            <Select value={newEntity.type} onValueChange={(value) => setNewEntity(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="bg-corporate-dark border-corporate-border text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brand">Brand</SelectItem>
                <SelectItem value="person">Person</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={newEntity.description}
              onChange={(e) => setNewEntity(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description..."
              className="bg-corporate-dark border-corporate-border text-white"
            />
            <Button type="button" onClick={addEntity} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {formData.entities.map((entity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-corporate-dark border border-corporate-border rounded">
                <div>
                  <span className="font-medium text-white">{entity.name}</span>
                  <Badge variant="outline" className="ml-2">{entity.type}</Badge>
                  {entity.description && (
                    <p className="text-xs text-corporate-lightGray mt-1">{entity.description}</p>
                  )}
                </div>
                <Button type="button" onClick={() => removeEntity(index)} variant="ghost" size="sm">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={isProcessing || !formData.companyName || !formData.contactEmail || formData.entities.length === 0}
        className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
      >
        {isProcessing ? 'Saving...' : 'Save & Continue to Live Discovery'}
      </Button>
    </form>
  );
};

export default ClientInformationForm;
