
import React from "react";

interface ThreatSeverityIndicatorProps {
  severity?: number;
}

const ThreatSeverityIndicator = ({ severity }: ThreatSeverityIndicatorProps) => {
  if (!severity) return null;
  
  let color = "bg-green-500";
  if (severity > 3) color = "bg-blue-500";
  if (severity > 5) color = "bg-yellow-500";
  if (severity > 7) color = "bg-orange-500";
  if (severity > 8) color = "bg-red-500";
  
  return (
    <div className="flex items-center gap-2">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full`} 
          style={{ width: `${(severity / 10) * 100}%` }}
        />
      </div>
      <span className="text-sm font-medium">{severity}/10</span>
    </div>
  );
};

export default ThreatSeverityIndicator;
