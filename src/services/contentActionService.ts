
import { ContentAlert } from "@/types/dashboard";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Request removal of content
 */
export const requestContentRemoval = async (alert: ContentAlert): Promise<boolean> => {
  try {
    // Log the content removal request in the database
    const { data, error } = await supabase.from("content_actions").insert({
      alert_id: alert.id,
      action: "request_removal",
      type: "content_removal",
      platform: alert.platform,
      description: `Requested removal of content: "${alert.content.substring(0, 50)}..."`,
      status: "pending"
    }).select();

    if (error) {
      console.error("Error requesting content removal:", error);
      toast.error("Failed to request content removal");
      return false;
    }

    toast.success("Removal requested", {
      description: "Content has been flagged for removal. Our team will process this request."
    });

    return true;
  } catch (error) {
    console.error("Error requesting content removal:", error);
    toast.error("Failed to request content removal");
    return false;
  }
};

/**
 * Mark alert as read
 */
export const markAlertAsRead = async (alert: ContentAlert): Promise<boolean> => {
  try {
    // Log the mark as read action in the database
    const { data, error } = await supabase.from("content_actions").insert({
      alert_id: alert.id,
      action: "mark_as_read",
      type: "content_status_update",
      platform: alert.platform,
      description: `Marked alert as read: "${alert.content.substring(0, 50)}..."`,
      status: "completed"
    }).select();

    if (error) {
      console.error("Error marking alert as read:", error);
      toast.error("Failed to mark alert as read");
      return false;
    }

    // Also update the status in the content_alerts table
    const { error: updateError } = await supabase
      .from("content_alerts")
      .update({ status: "read" })
      .eq("id", alert.id);

    if (updateError) {
      console.error("Error updating alert status:", updateError);
    }

    return true;
  } catch (error) {
    console.error("Error marking alert as read:", error);
    toast.error("Failed to mark alert as read");
    return false;
  }
};

/**
 * Dismiss an alert
 */
export const dismissAlert = async (alert: ContentAlert): Promise<boolean> => {
  try {
    // Log the dismiss action in the database
    const { data, error } = await supabase.from("content_actions").insert({
      alert_id: alert.id,
      action: "dismiss",
      type: "content_status_update",
      platform: alert.platform,
      description: `Dismissed alert: "${alert.content.substring(0, 50)}..."`,
      status: "completed"
    }).select();

    if (error) {
      console.error("Error dismissing alert:", error);
      toast.error("Failed to dismiss alert");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error dismissing alert:", error);
    toast.error("Failed to dismiss alert");
    return false;
  }
};
