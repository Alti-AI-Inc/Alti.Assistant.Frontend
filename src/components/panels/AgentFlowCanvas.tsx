import React, { useState, useCallback } from 'react';
// import ReactFlow, { Background, Controls, applyNodeChanges, applyEdgeChanges } from 'reactflow';
// 'reactflow' would be installed in package.json

export default function AgentFlowCanvas() {
  const [nodes, setNodes] = useState([
    { id: '1', position: { x: 250, y: 50 }, data: { label: 'Planner Agent' } },
    { id: '2', position: { x: 100, y: 200 }, data: { label: 'Exa Web Researcher' } },
    { id: '3', position: { x: 400, y: 200 }, data: { label: 'Evaluator Agent' } },
  ]);
  const [edges, setEdges] = useState([
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '1', target: '3' },
  ]);

  return (
    <div className="w-full h-full bg-zinc-900 border border-zinc-800 rounded-lg flex flex-col items-center justify-center p-8 text-zinc-400">
      <h3 className="text-xl font-bold text-white mb-2">Aphura Agent Orchestration Canvas</h3>
      <p className="text-center mb-6 max-w-md">
        Visually connect LangGraph agents, designate Tools, and build autonomous swarms.
        (Requires ReactFlow installation)
      </p>
      
      {/* Mock Visual Representation */}
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <div className="px-6 py-3 bg-indigo-500/20 border border-indigo-500 text-indigo-300 rounded-xl shadow-lg shadow-indigo-500/10">
          Planner Agent (Together Inference)
        </div>
        
        <div className="flex w-full justify-around relative">
          <div className="absolute top-[-30px] left-1/4 w-[2px] h-[30px] bg-zinc-700" />
          <div className="absolute top-[-30px] right-1/4 w-[2px] h-[30px] bg-zinc-700" />
          <div className="absolute top-[-30px] left-1/4 right-1/4 h-[2px] bg-zinc-700" />
          
          <div className="px-6 py-3 bg-emerald-500/20 border border-emerald-500 text-emerald-300 rounded-xl">
            Exa Researcher
          </div>
          <div className="px-6 py-3 bg-amber-500/20 border border-amber-500 text-amber-300 rounded-xl">
            O1-Evaluator
          </div>
        </div>
      

      <div className="mt-8 flex flex-col items-center">
        <button 
          onClick={() => {
            const graphPayload = { nodes, edges };
            console.log("Serializing LangGraph payload to Liberty Center One:", JSON.stringify(graphPayload));
            alert("Swarm spawned on Liberty Center One bare-metal.");
          }}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
          Deploy Swarm to Backend
        </button>
      </div>

      </div>
    </div>
  );
}