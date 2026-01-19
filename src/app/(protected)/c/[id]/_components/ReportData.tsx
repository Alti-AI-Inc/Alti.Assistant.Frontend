'use client';

import { useState } from 'react';
import { GeneratedReport, ReportSection } from '@/types/report-generation';
import { ChevronDown, FileText, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ReportDataProps {
  report: GeneratedReport;
  sections?: ReportSection[];
}

export function ReportData({ report, sections }: ReportDataProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev => ({ ...prev, [sectionTitle]: !prev[sectionTitle] }));
  };

  if (!report) {
    return null;
  }

  const displaySections = sections || report.sections || [];

  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3">
            <div className="mt-0.5 shrink-0 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900">
                {report.title || 'Generated Report'}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                >
                  {report.outputFormat?.toUpperCase()}
                </Badge>
                {report.metadata?.reportType && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                  >
                    {report.metadata.reportType.replace(/_/g, ' ')}
                  </Badge>
                )}
                {report.metadata?.generatedAt && (
                  <span className="text-xs text-gray-400">
                    {new Date(report.metadata.generatedAt).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          {report.publicUrl && (
            <a
              href={report.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
            </a>
          )}
        </div>
      </div>

      {/* Sections */}
      {displaySections.length > 0 && (
        <div className="space-y-2 p-4">
          {displaySections.map((section, idx) => (
            <div
              key={`${section.title}-${idx}`}
              className="overflow-hidden rounded-lg border border-gray-200"
            >
              <button
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center justify-between bg-white px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {section.title}
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-gray-400 transition-transform duration-200',
                    openSections[section.title] ? 'rotate-180' : '',
                  )}
                />
              </button>

              {openSections[section.title] && (
                <div className="border-t border-gray-200 bg-gray-50/50 p-4">
                  <div className="prose prose-sm max-w-none text-gray-600">
                    <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
