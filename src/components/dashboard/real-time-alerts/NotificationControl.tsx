
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";

interface NotificationControlProps {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const NotificationControl = ({ 
  notificationsEnabled, 
  setNotificationsEnabled 
}: NotificationControlProps) => {
  const handleToggleNotifications = () => {
    if (!notificationsEnabled && "Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    
    setNotificationsEnabled(!notificationsEnabled);
    
    toast.info(
      !notificationsEnabled ? 
        "Real-time notifications enabled" : 
        "Real-time notifications disabled"
    );
  };

  return (
    <>
      <Badge 
        variant="outline" 
        className={`cursor-pointer ${notificationsEnabled ? 'bg-green-100' : 'bg-red-100'}`}
        onClick={handleToggleNotifications}
      >
        {notificationsEnabled ? (
          <><Bell className="h-3 w-3 mr-1" /> Notifications On</>
        ) : (
          <><BellOff className="h-3 w-3 mr-1" /> Notifications Off</>
        )}
      </Badge>
      
      {!notificationsEnabled && (
        <div className="px-4 pt-2">
          <Alert variant="destructive" className="bg-amber-50">
            <AlertTitle>Notifications are disabled</AlertTitle>
            <AlertDescription>
              You may miss critical reputation threats. We recommend keeping notifications on.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default NotificationControl;
