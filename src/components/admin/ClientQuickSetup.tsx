
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ClientQuickSetup = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    contactEmail: '',
    contactName: '',
    industry: 'Technology',
    clientType: 'brand',
    keywords: '',
    entityName: '',
    entityType: 'person',
    notes: ''
  });
  const [entities, setEntities] = useState<string[]>([]);
  const [currentEntity, setCurrentEntity] = useState('');

  const addEntity = () => {
    if (currentEntity.trim() && !entities.includes(currentEntity.trim())) {
      setEntities([...entities, currentEntity.trim()]);
      setCurrentEntity('');
    }
  };

  const removeEntity = (entity: string) => {
    setEntities(entities.filter(e => e !== entity));
  };

  const handleCreateClient = async () => {
    if (!formData.clientName || !formData.contactEmail) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsCreating(true);
    
    try {
      // Create client
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({
          name: formData.clientName,
          contactemail: formData.contactEmail,
          contactname: formData.contactName,
          industry: formData.industry,
          client_type: formData.clientType,
          keywordtargets: formData.keywords,
          notes: formData.notes
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Create primary entity
      if (formData.entityName) {
        await supabase
          .from('client_entities')
          .insert({
            client_id: client.id,
            entity_name: formData.entityName,
            entity_type: formData.entityType,
            notes: 'Primary entity'
          });
      }

      // Create additional entities
      for (const entityName of entities) {
        await supabase
          .from('client_entities')
          .insert({
            client_id: client.id,
            entity_name: entityName,
            entity_type: 'person',
            notes: 'Additional entity from quick setup'
          });
      }

      // Create initial notification to test system
      await supabase
        .from('aria_notifications')
        .insert({
          entity_name: formData.entityName || formData.clientName,
          event_type: 'client_setup',
          summary: `New client ${formData.clientName} configured and ready for monitoring`,
          priority: 'medium'
        });

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          action: 'client_created',
          entity_type: 'client',
          entity_id: client.id,
          details: `Quick setup completed for ${formData.clientName}`
        });

      toast.success('✅ Client setup completed successfully!');
      
      // Reset form
      setFormData({
        clientName: '',
        contactEmail: '',
        contactName: '',
        industry: 'Technology',
        clientType: 'brand',
        keywords: '',
        entityName: '',
        entityType: 'person',
        notes: ''
      });
      setEntities([]);

    } catch (error) {
      console.error('Failed to create client:', error);
      toast.error('❌ Failed to create client');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="bg-corporate-dark border-corporate-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="h-5 w-5 text-corporate-accent" />
          Quick Client Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Client Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-corporate-lightGray">
              Client Name *
            </Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              className="bg-corporate-darkSecondary border-corporate-border text-white"
              placeholder="Enter client name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="text-corporate-lightGray">
              Contact Email *
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
              className="bg-corporate-darkSecondary border-corporate-border text-white"
              placeholder="contact@client.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName" className="text-corporate-lightGray">
              Contact Name
            </Label>
            <Input
              id="contactName"
              value={formData.contactName}
              onChange={(e) => setFormData({...formData, contactName: e.target.value})}
              className="bg-corporate-darkSecondary border-corporate-border text-white"
              placeholder="Contact person name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className="text-corporate-lightGray">
              Industry
            </Label>
            <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
              <SelectTrigger className="bg-corporate-darkSecondary border-corporate-border text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Healthcare">Healthcare</SelectItem>
                <SelectItem value="Legal">Legal</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Real Estate">Real Estate</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Primary Entity */}
        <div className="space-y-2">
          <Label htmlFor="entityName" className="text-corporate-lightGray">
            Primary Entity to Monitor
          </Label>
          <div className="flex gap-2">
            <Input
              id="entityName"
              value={formData.entityName}
              onChange={(e) => setFormData({...formData, entityName: e.target.value})}
              className="bg-corporate-darkSecondary border-corporate-border text-white"
              placeholder="Person or organization name"
            />
            <Select value={formData.entityType} onValueChange={(value) => setFormData({...formData, entityType: value})}>
              <SelectTrigger className="w-40 bg-corporate-darkSecondary border-corporate-border text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="person">Person</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="brand">Brand</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Additional Entities */}
        <div className="space-y-2">
          <Label className="text-corporate-lightGray">Additional Entities</Label>
          <div className="flex gap-2">
            <Input
              value={currentEntity}
              onChange={(e) => setCurrentEntity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addEntity()}
              className="bg-corporate-darkSecondary border-corporate-border text-white"
              placeholder="Add additional entity"
            />
            <Button
              type="button"
              onClick={addEntity}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {entities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {entities.map((entity, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {entity}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeEntity(entity)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-corporate-lightGray">
            Target Keywords
          </Label>
          <Input
            id="keywords"
            value={formData.keywords}
            onChange={(e) => setFormData({...formData, keywords: e.target.value})}
            className="bg-corporate-darkSecondary border-corporate-border text-white"
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-corporate-lightGray">
            Notes
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="bg-corporate-darkSecondary border-corporate-border text-white"
            placeholder="Additional notes about this client"
            rows={3}
          />
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreateClient}
          disabled={isCreating || !formData.clientName || !formData.contactEmail}
          className="w-full bg-corporate-accent text-black hover:bg-corporate-accent/90"
        >
          {isCreating ? (
            'Creating Client...'
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Create Client & Start Monitoring
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClientQuickSetup;
