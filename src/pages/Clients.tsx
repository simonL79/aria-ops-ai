
import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Client } from "@/types/clients";
import ClientList from "@/components/clients/ClientList";
import ClientFormWrapper from "@/components/clients/ClientFormWrapper";

// Mock data for demonstration
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
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const handleAddClient = (clientData: any) => {
    const newClient = {
      id: `${clients.length + 1}`,
      name: clientData.name,
      industry: clientData.industry,
      contactName: clientData.contactName,
      contactEmail: clientData.contactEmail,
      website: clientData.website,
      notes: clientData.notes,
      keywordTargets: clientData.keywordTargets
    };
    
    setClients([...clients, newClient]);
    toast.success(`Client ${clientData.name} added successfully`);
  };

  const handleEditClient = (client: Client) => {
    setActiveClient(client);
    setIsEditMode(true);
  };

  const handleUpdateClient = (clientData: any) => {
    const updatedClients = clients.map(client => 
      client.id === activeClient?.id ? { ...client, ...clientData } : client
    );
    
    setClients(updatedClients);
    setActiveClient(null);
    setIsEditMode(false);
    toast.success(`Client ${clientData.name} updated successfully`);
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Client Management</h1>
          <p className="text-muted-foreground">
            Manage client information for monitoring and reputation management.
          </p>
        </div>
        <Link to="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
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
          <ClientList 
            clients={clients}
            onSelectClient={handleSelectClient}
            onEditClient={handleEditClient}
            onRunIntelligence={handleRunIntelligence}
          />
        </TabsContent>
        
        <TabsContent value="add">
          {isEditMode && activeClient ? (
            <ClientFormWrapper 
              onSubmit={handleUpdateClient} 
              defaultValues={activeClient}
              isEditMode={true}
            />
          ) : (
            <ClientFormWrapper onSubmit={handleAddClient} />
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Clients;
