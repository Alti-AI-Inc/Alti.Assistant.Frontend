'use client';
import React from 'react';
import { BookOpen, User, Calendar, ExternalLink } from 'lucide-react';
import WidgetContainer from './WidgetContainer';

export interface AcademicPaper {
  title?: string;
  summary?: string;
  authors?: string;
  published?: string;
  url?: string;
  [key: string]: unknown;
}

export default function AcademicWidget({ academicData }: { academicData?: { papers?: AcademicPaper[] } }) {
  const papers = academicData?.papers || [
    { title: 'Sample Research Paper', summary: 'This is a sample summary of the academic paper detailing discoveries.', authors: 'John Doe, Jane Smith', published: '2026-05-12T00:00:00Z', url: 'https://arxiv.org' }
  ];

  return (
    <WidgetContainer 
      icon={BookOpen} 
      iconColorClass="text-blue-400" 
      iconBgClass="bg-blue-500/10" 
      title="Academic Research" 
      subtitle="arXiv API Integration"
    >
      <div className="space-y-4">
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
    </WidgetContainer>
  );
}
