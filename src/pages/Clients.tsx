
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Client } from "@/types/clients";
import ClientList from "@/components/clients/ClientList";
import ClientFormWrapper from "@/components/clients/ClientFormWrapper";
import { fetchClients, addClient, updateClient } from "@/services/clientsService";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("list");
  
  // Fetch clients on component mount
  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      const clientsData = await fetchClients();
      setClients(clientsData);
      setIsLoading(false);
    };
    
    loadClients();
  }, []);

  const handleAddClient = async (clientData: Omit<Client, 'id'>) => {
    const newClient = await addClient(clientData);
    
    if (newClient) {
      setClients(prev => [...prev, newClient]);
      toast.success(`Client ${clientData.name} added successfully`);
      setActiveTab("list");
    }
  };

  const handleEditClient = (client: Client) => {
    setActiveClient(client);
    setIsEditMode(true);
    setActiveTab("add");
  };

  const handleUpdateClient = async (clientData: Partial<Client>) => {
    if (!activeClient) return;
    
    const updatedClient = await updateClient(activeClient.id, clientData);
    
    if (updatedClient) {
      setClients(prev => 
        prev.map(client => client.id === activeClient.id ? updatedClient : client)
      );
      setActiveClient(null);
      setIsEditMode(false);
      setActiveTab("list");
      toast.success(`Client ${clientData.name} updated successfully`);
    }
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
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset edit mode when switching to list tab
    if (value === "list" && isEditMode) {
      setIsEditMode(false);
      setActiveClient(null);
    }
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
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="list">
            <Users className="mr-2 h-4 w-4" />
            Client List
          </TabsTrigger>
          <TabsTrigger value="add">
            <UserPlus className="mr-2 h-4 w-4" />
            {isEditMode ? "Edit Client" : "Add New Client"}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading clients...</span>
            </div>
          ) : (
            <ClientList 
              clients={clients}
              onSelectClient={handleSelectClient}
              onEditClient={handleEditClient}
              onRunIntelligence={handleRunIntelligence}
            />
          )}
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
