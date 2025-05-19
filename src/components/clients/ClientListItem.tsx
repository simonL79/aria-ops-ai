
import { Client } from "@/types/clients";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ClientListItemProps {
  client: Client;
  onSelect: (client: Client) => void;
  onEdit: (client: Client) => void;
  onRunIntelligence: (client: Client) => void;
}

const ClientListItem = ({ 
  client, 
  onSelect, 
  onEdit, 
  onRunIntelligence 
}: ClientListItemProps) => {
  return (
    <div className="border p-4 rounded-md hover:bg-muted/50 transition-colors">
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
        <Button size="sm" variant="outline" onClick={() => onSelect(client)}>View</Button>
        <Button size="sm" variant="outline" onClick={() => onEdit(client)}>Edit</Button>
        <Button size="sm" variant="outline" onClick={() => onRunIntelligence(client)}>Run Intelligence</Button>
      </div>
    </div>
  );
};

export default ClientListItem;
