
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Plus, Search, Building, Mail, Globe, FileText } from "lucide-react";
import { toast } from "sonner";
import { fetchClients, addClient } from '@/services/clientsService';
import type { Client } from '@/types/clients';

interface ClientEntity {
  id: string;
  entity_name: string;
  entity_type: string;
  alias?: string;
}

interface ClientSelectorProps {
  selectedClient: Client | null;
  onClientSelect: (client: Client | null) => void;
  onEntitiesLoad: (entities: ClientEntity[]) => void;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({
  selectedClient,
  onClientSelect,
  onEntitiesLoad
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    contactName: '',
    contactEmail: '',
    website: '',
    notes: '',
    keywordTargets: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const clientsData = await fetchClients();
      console.log('Loaded clients:', clientsData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    console.log('Selecting client:', client);
    onClientSelect(client || null);
    
    // Mock entities for now - in real implementation, fetch from client_entities table
    if (client) {
      const mockEntities: ClientEntity[] = [
        {
          id: '1',
          entity_name: client.name,
          entity_type: 'organization',
          alias: client.name
        }
      ];
      onEntitiesLoad(mockEntities);
    } else {
      onEntitiesLoad([]);
    }
  };

  const handleAddClient = async () => {
    try {
      const newClient = await addClient(formData);
      if (newClient) {
        setClients(prev => [...prev, newClient]);
        setFormData({
          name: '',
          industry: '',
          contactName: '',
          contactEmail: '',
          website: '',
          notes: '',
          keywordTargets: ''
        });
        setShowAddForm(false);
        toast.success('Client added successfully');
        // Auto-select the new client
        onClientSelect(newClient);
      }
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Card className="bg-corporate-darkSecondary border-corporate-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Loading Clients...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-10 bg-corporate-dark rounded"></div>
            <div className="h-8 bg-corporate-dark rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-corporate-darkSecondary border-corporate-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-corporate-accent" />
            Client Context ({clients.length} clients)
          </div>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-corporate-darkSecondary border-corporate-border">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Client</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-corporate-lightGray text-sm">Client Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-corporate-dark border-corporate-border text-white"
                      placeholder="Company or Individual Name"
                    />
                  </div>
                  <div>
                    <label className="text-corporate-lightGray text-sm">Industry *</label>
                    <Input
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      className="bg-corporate-dark border-corporate-border text-white"
                      placeholder="Technology, Finance, etc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-corporate-lightGray text-sm">Contact Name *</label>
                    <Input
                      value={formData.contactName}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                      className="bg-corporate-dark border-corporate-border text-white"
                      placeholder="Primary contact person"
                    />
                  </div>
                  <div>
                    <label className="text-corporate-lightGray text-sm">Contact Email *</label>
                    <Input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="bg-corporate-dark border-corporate-border text-white"
                      placeholder="contact@company.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-corporate-lightGray text-sm">Website</label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    className="bg-corporate-dark border-corporate-border text-white"
                    placeholder="https://company.com"
                  />
                </div>
                <div>
                  <label className="text-corporate-lightGray text-sm">Keyword Targets</label>
                  <Input
                    value={formData.keywordTargets}
                    onChange={(e) => setFormData(prev => ({ ...prev, keywordTargets: e.target.value }))}
                    className="bg-corporate-dark border-corporate-border text-white"
                    placeholder="CEO name, company name, brand mentions"
                  />
                </div>
                <div>
                  <label className="text-corporate-lightGray text-sm">Notes</label>
                  <Input
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="bg-corporate-dark border-corporate-border text-white"
                    placeholder="Additional client information"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddClient}
                    disabled={!formData.name || !formData.industry || !formData.contactName || !formData.contactEmail}
                    className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
                  >
                    Add Client
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="border-corporate-border text-corporate-lightGray"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Client Selection */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-corporate-lightGray" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-corporate-dark border-corporate-border text-white"
            />
          </div>
          
          <Select value={selectedClient?.id || ''} onValueChange={handleClientSelect}>
            <SelectTrigger className="bg-corporate-dark border-corporate-border text-white">
              <SelectValue placeholder="Select a client..." />
            </SelectTrigger>
            <SelectContent className="bg-corporate-dark border-corporate-border">
              <SelectItem value="">No client selected</SelectItem>
              {filteredClients.map((client) => (
                <SelectItem key={client.id} value={client.id} className="text-white">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>{client.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {client.industry}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Client Details */}
        {selectedClient && (
          <div className="bg-corporate-dark rounded-lg p-4 border border-corporate-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-white font-medium">{selectedClient.name}</h3>
                <Badge className="mt-1 bg-corporate-accent/20 text-corporate-accent">
                  {selectedClient.industry}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onClientSelect(null)}
                className="border-corporate-border text-corporate-lightGray hover:text-white"
              >
                Clear
              </Button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-corporate-lightGray">
                <Mail className="h-4 w-4" />
                <span>{selectedClient.contactName} ({selectedClient.contactEmail})</span>
              </div>
              
              {selectedClient.website && (
                <div className="flex items-center gap-2 text-corporate-lightGray">
                  <Globe className="h-4 w-4" />
                  <a 
                    href={selectedClient.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-corporate-accent hover:underline"
                  >
                    {selectedClient.website}
                  </a>
                </div>
              )}
              
              {selectedClient.keywordTargets && (
                <div className="flex items-start gap-2 text-corporate-lightGray">
                  <FileText className="h-4 w-4 mt-0.5" />
                  <span className="text-xs">Keywords: {selectedClient.keywordTargets}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Clients State */}
        {clients.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-corporate-lightGray mx-auto mb-3" />
            <p className="text-corporate-lightGray mb-4">No clients found</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-corporate-accent text-black hover:bg-corporate-accent/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Client
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientSelector;
