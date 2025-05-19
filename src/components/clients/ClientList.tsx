
import { useState } from "react";
import { Client } from "@/types/clients";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import ClientListItem from "./ClientListItem";

interface ClientListProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onRunIntelligence: (client: Client) => void;
}

const ClientList = ({ 
  clients, 
  onSelectClient, 
  onEditClient, 
  onRunIntelligence 
}: ClientListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredClients = clients.filter(
    client => client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
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
              <ClientListItem 
                key={client.id}
                client={client}
                onSelect={onSelectClient}
                onEdit={onEditClient}
                onRunIntelligence={onRunIntelligence}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientList;
