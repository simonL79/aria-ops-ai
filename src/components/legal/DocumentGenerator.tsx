
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Send } from 'lucide-react';

const DocumentGenerator = () => {
  const [documentType, setDocumentType] = useState('');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');

  return (
    <Card className="bg-corporate-darkSecondary border-corporate-border">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-corporate-accent" />
          Legal Document Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={documentType} onValueChange={setDocumentType}>
          <SelectTrigger className="bg-corporate-dark border-corporate-border text-white">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cease-desist">Cease & Desist</SelectItem>
            <SelectItem value="dmca">DMCA Takedown</SelectItem>
            <SelectItem value="defamation">Defamation Notice</SelectItem>
            <SelectItem value="privacy">Privacy Violation</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Subject/Target"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="bg-corporate-dark border-corporate-border text-white"
        />

        <Textarea
          placeholder="Additional details and context..."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="bg-corporate-dark border-corporate-border text-white min-h-[100px]"
        />

        <div className="flex gap-2">
          <Button className="bg-corporate-accent text-black hover:bg-corporate-accentDark flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Generate Document
          </Button>
          <Button variant="outline" className="border-corporate-border text-corporate-lightGray">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="border-corporate-border text-corporate-lightGray">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentGenerator;
