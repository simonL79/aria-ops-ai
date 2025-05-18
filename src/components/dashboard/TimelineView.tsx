
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Clock } from "lucide-react";

interface TimelineDataPoint {
  date: string;
  score: number;
  mentions: number;
}

interface TimelineViewProps {
  data: TimelineDataPoint[];
  loading?: boolean;
}

const TimelineView = ({ data, loading = false }: TimelineViewProps) => {
  const [timeRange, setTimeRange] = useState<string>("week");
  
  // Filter data based on selected time range
  const getFilteredData = () => {
    if (data.length === 0) return [];
    
    const now = new Date();
    let filteredData = [...data];
    
    switch(timeRange) {
      case "day":
        // Last 24 hours
        filteredData = data.filter(item => {
          const itemDate = new Date(item.date);
          return (now.getTime() - itemDate.getTime()) <= 86400000;
        });
        break;
      case "week":
        // Last 7 days
        filteredData = data.filter(item => {
          const itemDate = new Date(item.date);
          return (now.getTime() - itemDate.getTime()) <= 604800000;
        });
        break;
      case "month":
        // Last 30 days
        filteredData = data.filter(item => {
          const itemDate = new Date(item.date);
          return (now.getTime() - itemDate.getTime()) <= 2592000000;
        });
        break;
      case "all":
        // All data
        break;
      default:
        break;
    }
    
    return filteredData;
  };
  
  // Sample data for demonstration
  const sampleData: TimelineDataPoint[] = [
    { date: "May 11", score: 72, mentions: 23 },
    { date: "May 12", score: 70, mentions: 45 },
    { date: "May 13", score: 68, mentions: 52 },
    { date: "May 14", score: 65, mentions: 87 },
    { date: "May 15", score: 69, mentions: 56 },
    { date: "May 16", score: 73, mentions: 41 },
    { date: "May 17", score: 78, mentions: 32 },
    { date: "May 18", score: 82, mentions: 28 },
  ];
  
  const displayData = data.length > 0 ? getFilteredData() : sampleData;
  
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>Reputation Timeline</span>
          </CardTitle>
          <Skeleton className="h-8 w-40 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span>Reputation Timeline</span>
        </CardTitle>
        <Tabs defaultValue={timeRange} onValueChange={setTimeRange} className="mt-2">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="day">24h</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayData}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="score"
                stroke="#8884d8"
                name="Reputation Score"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="mentions" 
                stroke="#82ca9d" 
                name="Mentions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col p-3 border rounded-md">
            <span className="text-xs text-muted-foreground">Current Score</span>
            <span className="text-2xl font-bold">{displayData[displayData.length - 1]?.score || '-'}</span>
          </div>
          <div className="flex flex-col p-3 border rounded-md">
            <span className="text-xs text-muted-foreground">Score Change</span>
            <span className={`text-2xl font-bold ${
              displayData.length >= 2 &&
              displayData[displayData.length - 1].score - displayData[0].score > 0
                ? 'text-green-500'
                : displayData.length >= 2 &&
                  displayData[displayData.length - 1].score - displayData[0].score < 0
                ? 'text-red-500'
                : ''
            }`}>
              {displayData.length >= 2
                ? (displayData[displayData.length - 1].score - displayData[0].score > 0 ? '+' : '') +
                  (displayData[displayData.length - 1].score - displayData[0].score)
                : '-'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineView;
