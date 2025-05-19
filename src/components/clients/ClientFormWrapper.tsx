
import { Client } from "@/types/clients";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClientForm from "./ClientForm";

interface ClientFormWrapperProps {
  onSubmit: (data: any) => void;
  defaultValues?: Partial<Client>;
  isEditMode?: boolean;
}

const ClientFormWrapper = ({ 
  onSubmit, 
  defaultValues, 
  isEditMode = false 
}: ClientFormWrapperProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Client" : "Add New Client"}</CardTitle>
        <CardDescription>
          {isEditMode 
            ? "Update client details for monitoring and analysis" 
            : "Enter client details for monitoring and analysis"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ClientForm onSubmit={onSubmit} defaultValues={defaultValues} />
      </CardContent>
    </Card>
  );
};

export default ClientFormWrapper;
