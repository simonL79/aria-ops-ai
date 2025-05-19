
import React from "react";
import { responseTemplates } from "./constants";

const ResponseTemplatesTab = () => {
  return (
    <div className="space-y-3">
      {responseTemplates.map((template) => (
        <div key={template.type} className="border rounded-md p-3">
          <div className="flex items-center gap-2 mb-1">
            {template.icon}
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
