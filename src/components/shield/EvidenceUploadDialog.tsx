import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

async function sha256Hex(input: string) {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function EvidenceUploadDialog({ alertId, onAdded }: { alertId: string; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [working, setWorking] = useState(false);

  // file
  const [file, setFile] = useState<File | null>(null);
  const [fileNotes, setFileNotes] = useState('');
  // url
  const [url, setUrl] = useState('');
  // text
  const [text, setText] = useState('');
  const [textSourceUrl, setTextSourceUrl] = useState('');
  // note
  const [note, setNote] = useState('');

  const reset = () => { setFile(null); setFileNotes(''); setUrl(''); setText(''); setTextSourceUrl(''); setNote(''); };

  const submitFile = async () => {
    if (!file) return;
    setWorking(true);
    const path = `alert/${alertId}/${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, '_')}`;
    const { error: upErr } = await supabase.storage.from('shield-evidence').upload(path, file);
    if (upErr) { toast.error('Upload failed'); setWorking(false); return; }
    const buf = new Uint8Array(await file.arrayBuffer());
    const hashBuf = await crypto.subtle.digest('SHA-256', buf);
    const hash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await (supabase as any).from('shield_evidence_items').insert({
      alert_id: alertId, evidence_type: 'uploaded_file', storage_path: path,
      content_hash: hash, captured_by: user?.id, notes: fileNotes || file.name,
      metadata: { size: file.size, mime: file.type },
    });
    setWorking(false);
    if (error) { toast.error('Failed to record evidence'); return; }
    toast.success('Evidence uploaded'); reset(); setOpen(false); onAdded();
  };

  const submitUrl = async () => {
    if (!url) return;
    setWorking(true);
    const { error } = await supabase.functions.invoke('shield-capture-url-metadata', { body: { alert_id: alertId, url } });
    setWorking(false);
    if (error) { toast.error('Capture failed'); return; }
    toast.success('URL captured'); reset(); setOpen(false); onAdded();
  };

  const submitText = async () => {
    if (!text.trim()) return;
    setWorking(true);
    const hash = await sha256Hex(text);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await (supabase as any).from('shield_evidence_items').insert({
      alert_id: alertId, evidence_type: 'copied_text', source_url: textSourceUrl || null,
      captured_text: text, content_hash: hash, captured_by: user?.id,
    });
    setWorking(false);
    if (error) { toast.error('Failed to save'); return; }
    toast.success('Text evidence saved'); reset(); setOpen(false); onAdded();
  };

  const submitNote = async () => {
    if (!note.trim()) return;
    setWorking(true);
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await (supabase as any).from('shield_evidence_items').insert({
      alert_id: alertId, evidence_type: 'analyst_note', notes: note, captured_by: user?.id,
    });
    setWorking(false);
    if (error) { toast.error('Failed to save'); return; }
    toast.success('Note saved'); reset(); setOpen(false); onAdded();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add evidence</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader><DialogTitle>Add evidence to vault</DialogTitle></DialogHeader>
        <Tabs defaultValue="url">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="url">URL</TabsTrigger>
            <TabsTrigger value="file">File</TabsTrigger>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="note">Note</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-3">
            <Label>Source URL (auto-captures status, title, body hash)</Label>
            <Input placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />
            <Button onClick={submitUrl} disabled={!url || working} className="w-full">{working ? 'Capturing…' : 'Capture URL'}</Button>
          </TabsContent>

          <TabsContent value="file" className="space-y-3">
            <Label>Screenshot or document</Label>
            <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Textarea placeholder="Notes (optional)" value={fileNotes} onChange={(e) => setFileNotes(e.target.value)} rows={2} />
            <Button onClick={submitFile} disabled={!file || working} className="w-full">{working ? 'Uploading…' : 'Upload file'}</Button>
          </TabsContent>

          <TabsContent value="text" className="space-y-3">
            <Label>Source URL (optional)</Label>
            <Input placeholder="https://…" value={textSourceUrl} onChange={(e) => setTextSourceUrl(e.target.value)} />
            <Label>Captured text</Label>
            <Textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste captured content…" />
            <Button onClick={submitText} disabled={!text.trim() || working} className="w-full">{working ? 'Saving…' : 'Save text'}</Button>
          </TabsContent>

          <TabsContent value="note" className="space-y-3">
            <Label>Analyst note</Label>
            <Textarea rows={5} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Observation, judgement, context…" />
            <Button onClick={submitNote} disabled={!note.trim() || working} className="w-full">{working ? 'Saving…' : 'Save note'}</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
