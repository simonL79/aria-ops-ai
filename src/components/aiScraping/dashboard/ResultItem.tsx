
import React from 'react';
import { Button } from "@/components/ui/button";
import { ContentAlert } from "@/types/dashboard";

interface ResultItemProps {
  result: ContentAlert;
}

const ResultItem: React.FC<ResultItemProps> = ({ result }) => {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className={`h-2 w-2 rounded-full mr-2 ${
            result.severity === 'high' 
              ? 'bg-red-500' 
              : result.severity === 'medium' 
              ? 'bg-yellow-500' 
              : 'bg-green-500'
          }`} />
          <span className="font-medium">{result.platform}</span>
        </div>
        <span className="text-xs text-muted-foreground">{result.date}</span>
      </div>
      <p className="mt-1 text-sm">{result.content}</p>
      <div className="mt-2">
        {result.category === 'customer_enquiry' && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Customer Enquiry
          </span>
        )}
        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
          result.severity === 'high' 
            ? 'bg-red-100 text-red-800' 
            : result.severity === 'medium' 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {result.severity === 'high' 
            ? 'High Priority' 
            : result.severity === 'medium' 
            ? 'Medium Priority' 
            : 'Low Priority'
          }
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-2"
          onClick={() => {
            window.location.href = `/dashboard/engagement?alert=${result.id}`;
          }}
        >
          View & Respond
        </Button>
      </div>
    </div>
  );
};

export default ResultItem;
