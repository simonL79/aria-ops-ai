
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface Lead {
  name: string;
  alerts: number;
  avg: number;
  top: 'low' | 'medium' | 'high' | 'critical';
}

interface LeadPrioritizationTableProps {
  leads?: Lead[];
}

const LeadPrioritizationTable = ({ leads }: LeadPrioritizationTableProps) => {
  // Mock data if no leads are provided
  const displayLeads = leads || [
    { name: "Kiera Stone", alerts: 2, avg: 3.0, top: "critical" as const },
    { name: "Liam James", alerts: 2, avg: 3.5, top: "critical" as const },
    { name: "Maya Chan", alerts: 1, avg: 4.0, top: "critical" as const },
    { name: "Emma Knight", alerts: 2, avg: 2.5, top: "high" as const },
    { name: "Jordan Fields", alerts: 2, avg: 2.5, top: "high" as const }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case 'high':
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case 'medium':
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case 'low':
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">Lead Prioritization View</h2>
      
      <Table>
        <TableHeader className="bg-gray-800">
          <TableRow>
            <TableHead className="text-left p-3 text-white">Name</TableHead>
            <TableHead className="text-left p-3 text-white"># of Alerts</TableHead>
            <TableHead className="text-left p-3 text-white">Avg. Severity</TableHead>
            <TableHead className="text-left p-3 text-white">Top Severity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-700">
          {displayLeads.map((lead, index) => (
            <TableRow key={index} className="bg-gray-900">
              <TableCell className="p-3 font-medium">{lead.name}</TableCell>
              <TableCell className="p-3">{lead.alerts}</TableCell>
              <TableCell className="p-3">{lead.avg.toFixed(1)}</TableCell>
              <TableCell className="p-3">
                <Badge className={`capitalize ${getSeverityColor(lead.top)}`}>
                  {lead.top}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadPrioritizationTable;
