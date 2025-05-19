
import { useState } from "react";
import MentionsTable from "@/components/dashboard/MentionsTable";
import { ContentAlert } from "@/types/dashboard";
import { 
  AlertDialog,
  AlertDialogContent, 
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel, 
  AlertDialogAction 
} from "@/components/ui/alert-dialog";

interface MentionsTabProps {
  mentions: ContentAlert[];
  setMentions: React.Dispatch<React.SetStateAction<ContentAlert[]>>;
  onViewDetail: (mention: ContentAlert) => void;
  onMarkResolved: (id: string) => void;
  onEscalate: (id: string) => void;
}

const MentionsTab = ({ 
  mentions, 
  setMentions, 
  onViewDetail, 
  onMarkResolved, 
  onEscalate 
}: MentionsTabProps) => {
  return (
    <MentionsTable
      mentions={mentions}
      onViewDetail={onViewDetail}
      onMarkResolved={onMarkResolved}
      onEscalate={onEscalate}
    />
  );
};

export default MentionsTab;
