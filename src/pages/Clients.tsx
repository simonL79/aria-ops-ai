
import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import ClientForm from "@/components/clients/ClientForm";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

// Mock data for demonstration
interface Client {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  website?: string;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    industry: "Technology",
    contactName: "John Doe",
    contactEmail: "john@acme.com",
    website: "https://acme.example.com"
  },
  {
    id: "2",
    name: "Globex Industries",
    industry: "Manufacturing",
    contactName: "Jane Smith",
    contactEmail: "jane@globex.com",
    website: "https://globex.example.com"
  }
];

const Clients = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const filteredClients = clients.filter(
    client => client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddClient = (clientData: any) => {
    const newClient = {
      id: `${clients.length + 1}`,
      name: clientData.name,
      industry: clientData.industry,
      contactName: clientData.contactName,
      contactEmail: clientData.contactEmail,
      website: clientData.website
    };
    
    setClients([...clients, newClient]);
    toast.success(`Client ${clientData.name} added successfully`);
  };

  const handleEditClient = (client: Client) => {
    setActiveClient(client);
    setIsEditMode(true);
  };

  const handleRunIntelligence = (client: Client) => {
    toast.info(`Running intelligence scan for ${client.name}`, {
      description: "The scan has been initiated and results will be available soon"
    });
  };

  const handleSelectClient = (client: Client) => {
    setActiveClient(client);
    toast.info(`${client.name} selected`, {
      description: "View client details and run intelligence operations"
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Client Management</h1>
        <p className="text-muted-foreground">
          Manage client information for monitoring and reputation management.
        </p>
      </div>
      
      <Tabs defaultValue="list">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="list">
            <Users className="mr-2 h-4 w-4" />
            Client List
          </TabsTrigger>
          <TabsTrigger value="add">
            <UserPlus className="mr-2 h-4 w-4" />
            Add New Client
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Your Clients</CardTitle>
              <CardDescription>
                View and manage your client records
              </CardDescription>
              <div className="mt-4 relative">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search clients..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClients.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No clients found. Add your first client to get started.
                  </div>
                ) : (
                  filteredClients.map((client) => (
                    <div key={client.id} className="border p-4 rounded-md hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{client.name}</h3>
                        <span className="text-sm bg-muted px-2 py-1 rounded-md">{client.industry}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Contact: {client.contactName} ({client.contactEmail})
                      </div>
                      {client.website && (
                        <div className="text-sm text-blue-600">
                          <a href={client.website} target="_blank" rel="noopener noreferrer">
                            {client.website}
                          </a>
                        </div>
                      )}
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => handleSelectClient(client)}>View</Button>
                        <Button size="sm" variant="outline" onClick={() => handleEditClient(client)}>Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => handleRunIntelligence(client)}>Run Intelligence</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Client</CardTitle>
              <CardDescription>
                Enter client details for monitoring and analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientForm onSubmit={handleAddClient} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Clients;
