'use client';

import React from 'react';
import { BookOpen, User, Calendar, ExternalLink } from 'lucide-react';

export interface AcademicPaper {
  title?: string;
  summary?: string;
  authors?: string;
  published?: string;
  url?: string;
  [key: string]: unknown;
}

interface AcademicWidgetProps {
  academicData?: { papers?: AcademicPaper[] };
}

export default function AcademicWidget({ academicData }: AcademicWidgetProps) {
  const papers = academicData?.papers || [
    { title: 'Sample Research Paper', summary: 'This is a sample summary of the academic paper detailing discoveries.', authors: 'John Doe, Jane Smith', published: '2026-05-12T00:00:00Z', url: 'https://arxiv.org' }
  ];

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl border border-[#2b2f3a] bg-[#11141c] text-[#d1d4dc] shadow-2xl transition-all duration-300 hover:border-primary/40">
      <div className="flex items-center space-x-3 border-b border-[#2b2f3a] bg-[#171b26] px-6 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          <BookOpen className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-wide text-white">Academic Research</h3>
          <p className="text-xs text-zinc-400">arXiv API Integration</p>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {papers.map((paper, idx) => (
          <div key={idx} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]">
            <h4 className="text-md font-semibold text-white mb-2">{paper.title}</h4>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mb-3">
              <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {paper.authors}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {paper.published ? new Date(paper.published).toLocaleDateString() : 'Unknown date'}</span>
            </div>
            <p className="text-sm text-zinc-300 line-clamp-3 mb-3">{paper.summary}</p>
            {paper.url && (
              <a href={paper.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300">
                Read Full Paper <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
