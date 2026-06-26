import jsPDF from 'jspdf';

export interface TimelineEntry {
  date: string;
  event: string;
}

export interface CasePackData {
  issue_type: string;
  urgency_label: string;
  issue_description: string;
  desired_outcome?: string;
  evidence_summary?: string;
  evidence_timeline: TimelineEntry[];
  full_name: string;
  email: string;
  phone?: string;
}

// Brand colours
const GOLD: [number, number, number] = [139, 92, 246]; // #8B5CF6
const NAVY: [number, number, number] = [21, 18, 31]; // #15121F
const SLATE: [number, number, number] = [71, 85, 105]; // slate-600
const LIGHT: [number, number, number] = [148, 163, 184]; // muted

const MARGIN = 48;

function buildReference(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 3) || 'ALS';
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  return `ALS-${initials}-${stamp}`;
}

export function generateCasePack(data: CasePackData): { reference: string } {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - MARGIN * 2;
  const reference = buildReference(data.full_name);
  const generatedOn = new Date().toLocaleString('en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  let y = MARGIN;

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - MARGIN - 30) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const sectionHeading = (title: string) => {
    ensureSpace(40);
    y += 10;
    doc.setFillColor(...GOLD);
    doc.rect(MARGIN, y - 9, 4, 14, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(title.toUpperCase(), MARGIN + 12, y + 2);
    y += 12;
    doc.setDrawColor(...GOLD);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, y, pageWidth - MARGIN, y);
    y += 16;
  };

  const labelValue = (label: string, value: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...SLATE);
    doc.text(label.toUpperCase(), MARGIN, y);
    y += 13;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(...NAVY);
    const lines = doc.splitTextToSize(value || '—', contentWidth) as string[];
    lines.forEach((line) => {
      ensureSpace(16);
      doc.text(line, MARGIN, y);
      y += 15;
    });
    y += 8;
  };

  // ---- Header band ----
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageWidth, 90, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('ARIA Legal Shield', MARGIN, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...GOLD);
  doc.text('SOLICITOR-READY CASE PACK', MARGIN, 60);
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(8);
  doc.text(`Reference: ${reference}`, pageWidth - MARGIN, 42, { align: 'right' });
  doc.text(`Generated: ${generatedOn}`, pageWidth - MARGIN, 56, { align: 'right' });

  y = 120;

  // ---- Intro ----
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...SLATE);
  const intro =
    'This case pack has been prepared to help a regulated legal professional quickly understand the ' +
    'matter. It organises the client\u2019s account, desired outcome and an evidence timeline. It is ' +
    'AI-assisted preparation only and is not legal advice.';
  doc.splitTextToSize(intro, contentWidth).forEach((line: string) => {
    doc.text(line, MARGIN, y);
    y += 14;
  });
  y += 6;

  // ---- Client details ----
  sectionHeading('Client details');
  labelValue('Full name', data.full_name);
  labelValue('Email', data.email);
  if (data.phone) labelValue('Phone', data.phone);

  // ---- Matter summary ----
  sectionHeading('Matter summary');
  labelValue('Issue type', data.issue_type);
  labelValue('Urgency', data.urgency_label);
  labelValue('What happened', data.issue_description);
  if (data.desired_outcome) labelValue('Desired outcome', data.desired_outcome);

  // ---- Evidence timeline ----
  sectionHeading('Evidence timeline');
  if (data.evidence_timeline.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(...LIGHT);
    doc.text('No timeline entries were provided.', MARGIN, y);
    y += 18;
  } else {
    const dateCol = 90;
    // header row
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...SLATE);
    doc.text('DATE', MARGIN, y);
    doc.text('EVENT', MARGIN + dateCol, y);
    y += 6;
    doc.setDrawColor(...LIGHT);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, pageWidth - MARGIN, y);
    y += 14;

    data.evidence_timeline.forEach((entry) => {
      const eventLines = doc.splitTextToSize(
        entry.event || '—',
        contentWidth - dateCol,
      ) as string[];
      ensureSpace(eventLines.length * 14 + 8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...NAVY);
      doc.text(entry.date || '—', MARGIN, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...SLATE);
      eventLines.forEach((line, i) => {
        doc.text(line, MARGIN + dateCol, y + i * 14);
      });
      y += eventLines.length * 14 + 8;
    });
    y += 4;
  }

  // ---- Supporting evidence ----
  sectionHeading('Supporting evidence');
  labelValue('Evidence held by the client', data.evidence_summary || 'None specified.');

  // ---- For the solicitor ----
  sectionHeading('Notes for the solicitor');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...SLATE);
  const notes = [
    'The client has organised the above account and evidence in advance to reduce review time.',
    'Please advise on the merits, available remedies and recommended next steps.',
    'Original evidence (documents, messages, screenshots) can be supplied on request.',
  ];
  notes.forEach((n) => {
    const lines = doc.splitTextToSize(`\u2022  ${n}`, contentWidth) as string[];
    lines.forEach((line) => {
      ensureSpace(16);
      doc.text(line, MARGIN, y);
      y += 15;
    });
    y += 2;
  });

  // ---- Footer on every page ----
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(...LIGHT);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, pageHeight - 40, pageWidth - MARGIN, pageHeight - 40);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...LIGHT);
    const disclaimer =
      'ARIA Legal Shield\u2122 provides AI-powered legal information, document preparation and case ' +
      'organisation. It is not a law firm and does not provide regulated legal services or a ' +
      'substitute for independent legal advice.';
    const dl = doc.splitTextToSize(disclaimer, contentWidth - 60) as string[];
    dl.forEach((line, idx) => {
      doc.text(line, MARGIN, pageHeight - 30 + idx * 9);
    });
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - MARGIN, pageHeight - 30, {
      align: 'right',
    });
  }

  doc.save(`ARIA-Legal-Shield-Case-Pack-${reference}.pdf`);
  return { reference };
}
