
import React from "react";
import { MessageSquareText, FileCheck, ThumbsUp, UserRound } from "lucide-react";
import { responseTemplates } from "./constants";

// Function to get the icon component based on the icon name
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "UserRound":
      return <UserRound className="h-4 w-4" />;
    case "FileCheck":
      return <FileCheck className="h-4 w-4" />;
    case "ThumbsUp":
      return <ThumbsUp className="h-4 w-4" />;
    case "MessageSquareText":
      return <MessageSquareText className="h-4 w-4" />;
    default:
      return <MessageSquareText className="h-4 w-4" />;
  }
};

const ResponseTemplatesTab = () => {
  return (
    <div className="space-y-3">
      {responseTemplates.map((template) => (
        <div key={template.type} className="border rounded-md p-3">
          <div className="flex items-center gap-2 mb-1">
            {getIconComponent(template.icon)}
            <h3 className="font-medium capitalize">{template.type} Response</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
          <div className="bg-gray-50 p-2 rounded text-sm">{template.template}</div>
        </div>
      ))}
    </div>
  );
};

export default ResponseTemplatesTab;
