
import { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function HomePage() {
  const [mentions, setMentions] = useState<any[]>([]);
  const [severity, setSeverity] = useState<number>(1);

  useEffect(() => {
    // Mock data since we don't have an actual /api/mentions endpoint
    const mockMentions = [
      ['Twitter', 'This company has terrible customer service! I waited for 2 hours on hold and no one answered.', 'https://twitter.com/user/status/123', 'Complaint', 6, 'Monitor for escalation'],
      ['Reddit', 'DO NOT BUY from this company! They sold me a defective product and refused to refund.', 'https://reddit.com/r/complaints/123', 'Reputation Threat', 9, 'Respond immediately'],
      ['Instagram', 'Having some issues with my recent purchase, hope their support team can help.', 'https://instagram.com/p/123', 'Neutral', 3, 'Standard follow-up'],
      ['Facebook', 'Is this company legitimate? I heard they had some legal troubles recently.', 'https://facebook.com/post/123', 'Misinformation', 7, 'Clarify facts publicly'],
      ['News Site', 'Company XYZ faces allegations of poor product quality, spokesperson denies claims', 'https://news.com/article/123', 'Reputation Threat', 8, 'Press response needed'],
    ];
    
    setMentions(mockMentions);
    
    // Uncomment this when we have an actual API endpoint
    // fetch(`/api/mentions`)
    //   .then(res => res.json())
    //   .then(data => setMentions(data));
  }, []);

  const handleSeverityChange = (value: number[]) => {
    setSeverity(value[0]);
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">ARIA Threat Dashboard</h1>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Filter by Severity ≥ {severity}</label>
        <div className="w-full max-w-md">
          <Slider 
            defaultValue={[1]} 
            max={10} 
            step={1} 
            min={1} 
            value={[severity]} 
            onValueChange={handleSeverityChange} 
          />
        </div>
      </div>

      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Platform</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Recommendation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mentions
            .filter(m => m[4] >= severity)
            .map((m, i) => (
              <TableRow key={i}>
                <TableCell>{m[0]}</TableCell>
                <TableCell>{m[1].slice(0, 80)}...</TableCell>
                <TableCell className={`${m[4] >= 8 ? 'text-destructive font-medium' : m[4] >= 5 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                  {m[4]}
                </TableCell>
                <TableCell>{m[3]}</TableCell>
                <TableCell>{m[5]}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </main>
  );
}
