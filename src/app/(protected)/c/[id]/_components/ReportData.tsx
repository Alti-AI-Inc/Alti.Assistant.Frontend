'use client';

import { useState, useMemo } from 'react';
import { GeneratedReport, ReportSection } from '@/types/report-generation';
import { ChevronDown, FileText, Printer, FileDown, Search, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../../../../../components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ReportDataProps {
  report: GeneratedReport;
  sections?: ReportSection[];
}

export function ReportData({ report, sections }: ReportDataProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const displaySections = useMemo(() => {
    return sections || report.sections || [];
  }, [sections, report]);

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev => ({ ...prev, [sectionTitle]: !prev[sectionTitle] }));
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery) return displaySections;
    const query = searchQuery.toLowerCase();
    return displaySections.filter(
      sec =>
        sec.title.toLowerCase().includes(query) ||
        sec.content.toLowerCase().includes(query)
    );
  }, [displaySections, searchQuery]);

  if (!report) {
    return null;
  }

  // Headless elegant client-side PDF printer
  const handlePrintPDF = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!doc) return;

    const sectionsHtml = displaySections.map(sec => `
      <div class="section-container" style="page-break-inside: avoid; margin-bottom: 30px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 2px solid #18181b; padding-bottom: 6px; color: #18181b; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-family: system-ui, -apple-system, sans-serif;">${sec.title}</h2>
        <p style="font-size: 13px; line-height: 1.7; color: #27272a; white-space: pre-wrap; font-family: system-ui, -apple-system, sans-serif; margin-top: 0px;">${sec.content}</p>
      </div>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${report.title || 'Generated Report'}</title>
        <style>
          @page {
            size: letter;
            margin: 20mm;
          }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            color: #18181b;
            line-height: 1.5;
            margin: 0;
            padding: 0;
          }
          .cover-page {
            height: 90vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            page-break-after: always;
            box-sizing: border-box;
            padding: 40px 0;
          }
          .cover-header {
            border-bottom: 2px solid #18181b;
            padding-bottom: 15px;
          }
          .logo-text {
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: #6366f1;
          }
          .cover-body {
            margin-top: 100px;
          }
          .cover-title {
            font-size: 34px;
            font-weight: 900;
            line-height: 1.15;
            color: #18181b;
            margin: 0;
          }
          .cover-subtitle {
            font-size: 13px;
            color: #71717a;
            margin-top: 12px;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 1px;
          }
          .cover-meta {
            margin-top: auto;
            border-top: 1px solid #e4e4e7;
            padding-top: 18px;
            font-size: 11px;
            color: #71717a;
            display: flex;
            justify-content: space-between;
            font-weight: 550;
          }
          .content-page {
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="cover-page">
          <div class="cover-header">
            <div class="logo-text">Alti Assistant Workspace platform</div>
          </div>
          <div class="cover-body">
            <h1 class="cover-title">${report.title || 'Generated Report'}</h1>
            <div class="cover-subtitle">${report.metadata?.reportType?.replace(/_/g, ' ') || 'Executive Synthesis Analysis'}</div>
          </div>
          <div class="cover-meta">
            <span>Generated: ${new Date(report.metadata?.generatedAt || Date.now()).toLocaleDateString()}</span>
            <span>Security Classification: strictly Confidential</span>
          </div>
        </div>
        <div class="content-page">
          ${sectionsHtml}
        </div>
      </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    // Trigger printing/PDF saving
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };

  return (
    <div className="w-full max-w-[796px] overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm my-4 flex flex-col">
      {/* Header Info */}
      <div className="border-b border-zinc-150 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-800/10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div className="mt-1 shrink-0 text-indigo-500">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {report.title || 'Generated Report'}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <Badge
                  variant="secondary"
                  className="bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-100/10"
                >
                  {report.outputFormat?.toUpperCase() || 'PDF'}
                </Badge>
                {report.metadata?.reportType && (
                  <Badge
                    variant="secondary"
                    className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400"
                  >
                    {report.metadata.reportType.replace(/_/g, ' ')}
                  </Badge>
                )}
                {report.metadata?.generatedAt && (
                  <span className="text-[10px] text-zinc-400 ml-1">
                    {new Date(report.metadata.generatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full max-w-[150px] sm:w-[140px]">
              <Search className="absolute top-2 left-2.5 h-3.5 w-3.5 text-zinc-400" />
              <Input
                type="text"
                placeholder="Filter report..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-7 pl-7 pr-2.5 text-[11px] bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-400"
              />
            </div>

            <Button variant="outline" size="sm" onClick={handlePrintPDF} className="h-7 gap-1.5 text-xs font-semibold">
              <Printer className="h-3 w-3" />
              Print PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Sections Lists with Accordion toggle */}
      {filteredSections.length > 0 ? (
        <div className="space-y-2.5 p-4">
          {filteredSections.map((section, idx) => {
            const isSectionOpen = openSections[section.title] ?? false;
            return (
              <div
                key={`${section.title}-${idx}`}
                className="overflow-hidden rounded-xl border border-zinc-150 dark:border-zinc-800 bg-zinc-50/10 dark:bg-zinc-900/10"
              >
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      {section.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 text-zinc-400 transition-transform duration-200',
                      isSectionOpen ? 'rotate-180 text-zinc-700 dark:text-zinc-200' : ''
                    )}
                  />
                </button>

                {isSectionOpen && (
                  <div className="border-t border-zinc-150 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/10 p-4 transition-all duration-300">
                    <p className="font-sans text-xs leading-relaxed whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                      {section.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-xs text-zinc-450">
          No matching sections found.
        </div>
      )}
    </div>
  );
}
export default ReportData;
