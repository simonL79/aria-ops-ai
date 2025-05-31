
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Search, Building, Mail, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  industry: string;
  contactname: string;
  contactemail: string;
  website?: string;
  created_at: string;
}

const ClientManagement = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    industry: '',
    contactname: '',
    contactemail: '',
    website: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async () => {
    if (!newClient.name || !newClient.industry || !newClient.contactname || !newClient.contactemail) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([newClient])
        .select()
        .single();

      if (error) throw error;

      setClients([data, ...clients]);
      setNewClient({ name: '', industry: '', contactname: '', contactemail: '', website: '' });
      setShowAddForm(false);
      toast.success('Client added successfully');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
    }
  };

  const runIntelligence = async (client: Client) => {
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-intelligence', {
        body: { 
          scanType: 'client_intelligence',
          clientName: client.name,
          enableLiveData: true 
        }
      });

      if (error) throw error;

      toast.success(`Intelligence scan initiated for ${client.name}`);
    } catch (error) {
      console.error('Intelligence scan failed:', error);
      toast.error('Failed to run intelligence scan');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contactname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold corporate-heading">Client Management</h2>
          <p className="text-corporate-lightGray">Manage and monitor client accounts</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-corporate-accent hover:bg-corporate-accentDark text-black">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-corporate-lightGray" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Add Client Form */}
      {showAddForm && (
        <Card className="corporate-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 corporate-heading">
              <Plus className="h-5 w-5 text-corporate-accent" />
              Add New Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  placeholder="Enter client name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Input
                  id="industry"
                  value={newClient.industry}
                  onChange={(e) => setNewClient({...newClient, industry: e.target.value})}
                  placeholder="Enter industry"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={newClient.contactname}
                  onChange={(e) => setNewClient({...newClient, contactname: e.target.value})}
                  placeholder="Enter contact name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={newClient.contactemail}
                  onChange={(e) => setNewClient({...newClient, contactemail: e.target.value})}
                  placeholder="Enter contact email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={newClient.website}
                onChange={(e) => setNewClient({...newClient, website: e.target.value})}
                placeholder="Enter website URL"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addClient} className="bg-corporate-accent hover:bg-corporate-accentDark text-black">
                Add Client
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Client List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-8">
            <Users className="h-8 w-8 animate-pulse mx-auto mb-4 text-corporate-accent" />
            <p className="text-corporate-lightGray">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Users className="h-12 w-12 text-corporate-lightGray mx-auto mb-4" />
            <p className="text-corporate-lightGray">No clients found</p>
            <p className="text-sm text-corporate-lightGray mt-2">Add your first client to get started</p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <Card key={client.id} className="corporate-card hover:border-corporate-accent transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg corporate-heading flex items-center gap-2">
                      <Building className="h-4 w-4 text-corporate-accent" />
                      {client.name}
                    </CardTitle>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {client.industry}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-3 w-3 text-corporate-lightGray" />
                    <span className="text-corporate-lightGray">{client.contactname}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-corporate-lightGray" />
                    <span className="text-corporate-lightGray">{client.contactemail}</span>
                  </div>
                  {client.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3 text-corporate-lightGray" />
                      <a 
                        href={client.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-corporate-accent hover:underline text-xs"
                      >
                        {client.website}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => runIntelligence(client)}
                    size="sm" 
                    className="flex-1 bg-corporate-accent hover:bg-corporate-accentDark text-black"
                  >
                    Run Intelligence
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                </div>
                
                <div className="text-xs text-corporate-lightGray pt-2 border-t border-corporate-border">
                  Added: {new Date(client.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientManagement;
