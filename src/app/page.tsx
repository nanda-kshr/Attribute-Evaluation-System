"use client";

import { useCallback, useState, useEffect } from 'react';
import { Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import Link from 'next/link';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ModuleNode from '@/components/ModuleNode';

const nodeTypes = {
  custom: ModuleNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: {
      label: 'Lexical Analysis and Grammar Definition',
      step: 1,
      description: 'Tokenization, lexical errors, and defining language grammar.'
    },
    position: { x: 250, y: 50 },
  },
  {
    id: '2',
    type: 'custom',
    data: {
      label: 'Bottom-Up Parsing and Parse Tree Construction',
      step: 2,
      description: 'Shift-reduce parsing, LR parsers, and building the syntax tree.'
    },
    position: { x: 250, y: 250 },
  },
  {
    id: '3',
    type: 'custom',
    data: {
      label: 'Attribute Grammar and Rule Definition',
      step: 3,
      description: 'Defining semantic rules and associating attributes with grammar symbols.'
    },
    position: { x: 250, y: 450 },
  },
  {
    id: '4',
    type: 'custom',
    data: {
      label: 'Annotated Parse Tree Construction',
      step: 4,
      description: 'Evaluating attributes within the tree to create an annotated parse tree.'
    },
    position: { x: 250, y: 650 },
  },
  {
    id: '5',
    type: 'custom',
    data: {
      label: 'Semantic Evaluation and Translation Output',
      step: 5,
      description: 'Final execution of semantic rules and generating target code/output.'
    },
    position: { x: 250, y: 850 },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#8b5cf6', strokeWidth: 3 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#8b5cf6',
    },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    style: { stroke: '#10b981', strokeWidth: 3 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#10b981',
    },
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
    style: { stroke: '#f59e0b', strokeWidth: 3 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#f59e0b',
    },
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    animated: true,
    style: { stroke: '#f43f5e', strokeWidth: 3 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#f43f5e',
    },
  },
];

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [currentModule, setCurrentModule] = useState<number>(0);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const stepNum = node.data.step as number;
        // If currentModule is 0, nothing is dimmed and nothing is explicitly active
        // If currentModule > 0, the matching step is active, the rest are dimmed
        const isActive = currentModule > 0 && stepNum === currentModule;
        const isDimmed = currentModule > 0 && stepNum !== currentModule;

        return {
          ...node,
          data: {
            ...node.data,
            isActive,
            isDimmed
          }
        };
      })
    );

    setEdges((eds) =>
      eds.map((edge) => {
        // Find which step numbers this edge connects
        const sourceStep = parseInt(edge.source);
        const targetStep = parseInt(edge.target);

        // The edge is highlighted if currentModule is >= its target step
        // or if we want it completely highlighted when currentModule === 0
        const isEdgeActive = currentModule === 0 || currentModule >= targetStep;

        return {
          ...edge,
          animated: isEdgeActive,
          style: {
            ...edge.style,
            stroke: isEdgeActive ? edge.style?.color || edge.style?.stroke : '#334155', // Slate 700 if dimmed
            strokeWidth: isEdgeActive ? 3 : 2
          }
        };
      })
    );
  }, [currentModule, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  return (
    <main className="w-full h-screen bg-neutral-950 flex flex-col">
      <div className="absolute top-0 w-full p-8 z-10 flex justify-between items-start pointer-events-none">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 pointer-events-auto">
            Compiler Design Phases
          </h1>
          <p className="text-neutral-400 mt-2 font-medium pointer-events-auto">Interactive Module Visualization</p>
        </div>
        <Link
          href="/parse-tree"
          className="pointer-events-auto px-6 py-3 bg-neutral-900/80 hover:bg-neutral-800 text-white rounded-xl border border-neutral-700 shadow-xl backdrop-blur-md transition-all font-semibold hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          Try Parse Tree Visualizer
        </Link>
      </div>

      <div className="flex-1 w-full relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-800/30 via-neutral-950 to-neutral-950 pointer-events-none" />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.5 }}
          className="bg-transparent"
        >
          <Background color="#333" gap={24} size={2} />
          <Controls className="!bg-neutral-900 !border-neutral-800 !fill-white" />
        </ReactFlow>

        {/* Navigation Controls Overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur-xl p-4 rounded-2xl border border-neutral-700 shadow-2xl flex flex-col items-center gap-4 transition-all z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentModule(0)}
              className="p-3 hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentModule(c => Math.max(1, c - 1))}
              disabled={currentModule <= 1}
              className="p-3 hover:bg-neutral-800 disabled:opacity-30 rounded-xl text-neutral-400 hover:text-white transition-colors"
              title="Previous Module"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentModule(c => c === 0 ? 1 : Math.min(c + 1, 5))}
              disabled={currentModule >= 5}
              className="bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-500 hover:to-purple-400 disabled:opacity-50 disabled:grayscale text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
            >
              {currentModule === 0 ? <><Play className="w-5 h-5" /> Start Modules</> : 'Next Module'}
            </button>
          </div>
          {currentModule > 0 && (
            <div className="text-sm font-mono text-purple-400 min-h-[24px] text-center w-full min-w-[300px] bg-black/40 py-2 px-4 rounded-lg border border-neutral-800">
              Viewing Module {currentModule} of 5
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
