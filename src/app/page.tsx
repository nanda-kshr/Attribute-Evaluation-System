"use client";

import { useCallback } from 'react';
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

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges],
  );

  return (
    <main className="w-full h-screen bg-neutral-950 flex flex-col">
      <div className="absolute top-0 w-full p-8 z-10 pointer-events-none">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
          Compiler Design Phases
        </h1>
        <p className="text-neutral-400 mt-2 font-medium">Interactive Module Visualization</p>
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
      </div>
    </main>
  );
}
