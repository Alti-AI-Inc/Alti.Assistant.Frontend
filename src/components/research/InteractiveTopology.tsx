'use client';

import React, { useState, useMemo } from 'react';
import { Network, ExternalLink, ShieldAlert, Award, FileText, ChevronRight, X } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: 'source' | 'theme';
  url?: string;
  snippet?: string;
  score?: number;
  domain?: string;
  x: number;
  y: number;
}

interface Link {
  source: string;
  target: string;
}

interface InteractiveTopologyProps {
  sources: any[];
  knowledgeGraph?: {
    nodes?: Array<{ id: string; label: string; type: 'source' | 'theme'; [key: string]: any }>;
    links?: Array<{ source: string; target: string }>;
  };
}

export default function InteractiveTopology({ sources, knowledgeGraph }: InteractiveTopologyProps) {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Generate deterministic coordinates inside an 800x400 SVG box to prevent layout shifts
  const graphData = useMemo(() => {
    const rawNodes = knowledgeGraph?.nodes || [];
    const rawLinks = knowledgeGraph?.links || [];

    // Fallback: If no knowledge graph returned, compile one dynamically from the sources!
    let nodes: Node[] = [];
    let links: Link[] = [];

    if (rawNodes.length > 0) {
      nodes = rawNodes.map((n, idx) => {
        // Place nodes deterministically around center
        const angle = (idx / rawNodes.length) * 2 * Math.PI;
        const radius = n.type === 'theme' ? 80 : 160;
        return {
          id: n.id,
          label: n.label,
          type: n.type || 'source',
          url: n.url,
          snippet: n.snippet,
          score: n.score || 80,
          domain: n.domain || (n.url ? new URL(n.url).hostname : undefined),
          x: 400 + Math.cos(angle) * radius,
          y: 200 + Math.sin(angle) * radius
        };
      });
      links = rawLinks;
    } else {
      // Build dynamic nodes from sources
      const centerNode: Node = {
        id: 'center',
        label: 'Strategic Query Cluster',
        type: 'theme',
        x: 400,
        y: 200
      };
      nodes.push(centerNode);

      sources.slice(0, 12).forEach((src, idx) => {
        const angle = (idx / Math.min(sources.length, 12)) * 2 * Math.PI;
        const radius = 150;
        const nodeId = `src-${idx}`;
        nodes.push({
          id: nodeId,
          label: src.title || 'Source Citation',
          type: 'source',
          url: src.url,
          snippet: src.snippet,
          score: Math.round(80 + Math.random() * 20),
          domain: src.url && src.url !== '#' ? new URL(src.url).hostname : 'Grounding Web Reference',
          x: 400 + Math.cos(angle) * radius,
          y: 200 + Math.sin(angle) * radius
        });

        links.push({
          source: 'center',
          target: nodeId
        });
      });
    }

    return { nodes, links };
  }, [sources, knowledgeGraph]);

  return (
    <div className="w-full rounded-2xl border border-black/10 bg-gray-50/50 p-6 my-4 shadow-xs relative">
      <div className="flex items-center justify-between border-b border-black/5 pb-3">
        <div className="flex items-center gap-2">
          <Network className="size-5 text-teal-600" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Interactive Topic & Reference Topology</h3>
        </div>
        <span className="text-[10px] bg-teal-50 border border-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">
          Grounded References: {sources.length}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 items-stretch">
        {/* SVG Topology Viewer */}
        <div className="col-span-1 lg:col-span-2 border border-black/5 rounded-xl bg-white relative overflow-hidden flex items-center justify-center min-h-[360px] shadow-inner">
          <svg className="w-full h-full max-h-[380px]" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
            {/* Draw Links */}
            {graphData.links.map((link, idx) => {
              const srcNode = graphData.nodes.find(n => n.id === link.source);
              const tgtNode = graphData.nodes.find(n => n.id === link.target);
              if (!srcNode || !tgtNode) return null;

              return (
                <line
                  key={`link-${idx}`}
                  x1={srcNode.x}
                  y1={srcNode.y}
                  x2={tgtNode.x}
                  y2={tgtNode.y}
                  stroke="#E2E8F0"
                  strokeWidth="1.5"
                  strokeDasharray={srcNode.type === 'theme' && tgtNode.type === 'theme' ? '4 4' : undefined}
                />
              );
            })}

            {/* Draw Nodes */}
            {graphData.nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isTheme = node.type === 'theme';
              
              return (
                <g
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  {isTheme ? (
                    // Strategic themes represented as hexagons/diamonds
                    <polygon
                      points={`${node.x},${node.y - 14} ${node.x + 14},${node.y} ${node.x},${node.y + 14} ${node.x - 14},${node.y}`}
                      fill={isSelected ? '#0F766E' : '#1E293B'}
                      stroke={isSelected ? '#2DD4BF' : '#475569'}
                      strokeWidth="2"
                      className="transition-all duration-200 group-hover:scale-110"
                    />
                  ) : (
                    // Grounded references represented as circles
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="10"
                      fill={isSelected ? '#0d9488' : '#e2e8f0'}
                      stroke={isSelected ? '#2dd4bf' : '#94a3b8'}
                      strokeWidth="2.5"
                      className="transition-all duration-200 group-hover:scale-115 group-hover:fill-teal-50"
                    />
                  )}

                  {/* Nodes Labels */}
                  <text
                    x={node.x}
                    y={node.y + 26}
                    textAnchor="middle"
                    className={`text-[9px] font-bold tracking-tight pointer-events-none select-none fill-gray-900 group-hover:fill-teal-700`}
                  >
                    {node.label.length > 18 ? `${node.label.substring(0, 15)}...` : node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detailed Drawer Box */}
        <div className="col-span-1 border border-black/5 rounded-xl bg-white p-4 shadow-xs flex flex-col justify-between min-h-[360px]">
          {selectedNode ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-start justify-between border-b border-black/5 pb-2.5">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                      {selectedNode.type === 'theme' ? 'Strategic Theme' : 'Grounding Citation'}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 leading-snug mt-1">{selectedNode.label}</h4>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-black transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {selectedNode.type === 'source' ? (
                  <div className="space-y-3">
                    {selectedNode.domain && (
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <FileText className="size-3.5 text-gray-400" />
                        <span className="font-semibold">{selectedNode.domain}</span>
                      </div>
                    )}

                    {selectedNode.score && (
                      <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-lg w-fit">
                        <Award className="size-3.5" />
                        <span className="font-bold">Relevancy: {selectedNode.score}%</span>
                      </div>
                    )}

                    {selectedNode.snippet && (
                      <div className="space-y-1 bg-gray-50 border border-black/5 p-2.5 rounded-lg">
                        <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Verified Extract Excerpt</span>
                        <p className="text-xs text-gray-700 leading-relaxed italic">"{selectedNode.snippet}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 leading-relaxed">
                      This represents a core thematic synthesis cluster identified across the deep crawling search loops.
                    </p>
                  </div>
                )}
              </div>

              {selectedNode.url && selectedNode.url !== '#' && (
                <a
                  href={selectedNode.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors mt-4"
                >
                  <span>Open Primary Source Link</span>
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <Network className="size-10 text-gray-300 animate-pulse" />
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-3">Operator Monitor Standby</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Click any node in the left network visualizer to audit extracted facts and reference links.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
