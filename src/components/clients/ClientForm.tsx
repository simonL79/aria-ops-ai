
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

const clientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  website: z.string().url("Must be a valid URL").or(z.string().length(0)),
  industry: z.string().min(1, "Industry is required"),
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z.string().email("Invalid email address"),
  notes: z.string().optional(),
  keywordTargets: z.string().optional()
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface ClientFormProps {
  onSubmit?: (data: ClientFormValues) => void;
  defaultValues?: Partial<ClientFormValues>;
}

export const ClientForm = ({ onSubmit, defaultValues = {} }: ClientFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: defaultValues.name || "",
      website: defaultValues.website || "",
      industry: defaultValues.industry || "",
      contactName: defaultValues.contactName || "",
      contactEmail: defaultValues.contactEmail || "",
      notes: defaultValues.notes || "",
      keywordTargets: defaultValues.keywordTargets || ""
    }
  });

  const handleSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        onSubmit(data);
      } else {
        // Default behavior if no onSubmit handler is provided
        console.log("Client data:", data);
        toast.success("Client information saved", {
          description: `${data.name} has been added to your clients.`
        });
      }
    } catch (error) {
      toast.error("Failed to save client information");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter client name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input placeholder="E.g., Technology, Healthcare, Retail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="keywordTargets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monitoring Keywords</FormLabel>
              <FormControl>
                <Input placeholder="Enter keywords separated by commas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional information about this client" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Save Client Details
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ClientForm;
