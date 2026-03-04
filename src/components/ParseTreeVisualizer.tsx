"use client";

import { useCallback, useEffect, useState } from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    Background,
    Controls,
    Node,
    Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import ParseNode from '@/components/ParseNode';
import { getLayoutedElements } from '@/lib/layout';
import { parseAndEvaluate, EvalStep, TreeNode } from '@/lib/parser';
import { Play, RotateCcw, SkipForward } from 'lucide-react';

const nodeTypes = {
    parseNode: ParseNode,
};

export default function ParseTreeVisualizer() {
    const [inputExp, setInputExp] = useState('3 + 4 * 5');
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    const [steps, setSteps] = useState<EvalStep[]>([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [error, setError] = useState('');

    const handleParse = useCallback(() => {
        try {
            setError('');
            const { tree, steps: evalSteps } = parseAndEvaluate(inputExp);

            const newNodes: Node[] = [];
            const newEdges: Edge[] = [];

            function traverse(n: TreeNode) {
                newNodes.push({
                    id: n.id,
                    type: 'parseNode',
                    data: { label: n.name, value: n.value, isEvaluated: false, isActive: false },
                    position: { x: 0, y: 0 },
                });

                n.children.forEach(child => {
                    newEdges.push({
                        id: `e-${n.id}-${child.id}`,
                        source: n.id,
                        target: child.id,
                        type: 'smoothstep',
                        animated: false,
                        style: { stroke: '#525252', strokeWidth: 2 },
                    });
                    traverse(child);
                });
            }

            traverse(tree);
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);

            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
            setSteps(evalSteps);
            setCurrentStep(-1);
        } catch (e: any) {
            setError(e.message);
            setNodes([]);
            setEdges([]);
            setSteps([]);
        }
    }, [inputExp, setNodes, setEdges]);

    // Initial load
    useEffect(() => {
        handleParse();
    }, [handleParse]);

    // Evaluate step
    useEffect(() => {
        setNodes(nds => nds.map(node => {
            const evalStepIdx = steps.findIndex(s => s.nodeId === node.id);
            const isEvaluated = evalStepIdx !== -1 && evalStepIdx <= currentStep;
            const isActive = evalStepIdx === currentStep;

            return {
                ...node,
                data: {
                    ...node.data,
                    isEvaluated,
                    isActive
                }
            };
        }));

        // Animate edges involved
        setEdges(eds => eds.map(edge => {
            // If the target node is evaluated or active, highlight the edge
            const targetStepIdx = steps.findIndex(s => s.nodeId === edge.target);
            const isRecent = targetStepIdx !== -1 && targetStepIdx <= currentStep;
            return {
                ...edge,
                animated: isRecent,
                style: {
                    stroke: isRecent ? '#10b981' : '#525252',
                    strokeWidth: isRecent ? 3 : 2
                }
            }
        }));
    }, [currentStep, steps, setNodes, setEdges]);

    return (
        <div className="w-full h-full flex flex-col px-8 pb-8 pt-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4 z-20 relative">
                <input
                    type="text"
                    value={inputExp}
                    onChange={(e) => setInputExp(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-96 text-lg font-mono shadow-inner"
                    placeholder="e.g. 2 + 3 * 4"
                />
                <button
                    onClick={handleParse}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 whitespace-nowrap"
                >
                    Parse & Build Tree
                </button>
            </div>

            {error && (
                <p className="text-red-400 mb-4 bg-red-950/50 p-4 rounded-xl z-20 relative border border-red-900/50 font-mono shadow-lg">
                    {error}
                </p>
            )}

            <div className="flex-1 w-full relative bg-neutral-900/30 rounded-3xl border border-neutral-800 overflow-hidden shadow-2xl backdrop-blur-sm">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView
                    minZoom={0.5}
                    maxZoom={2}
                    className="bg-transparent"
                >
                    <Background color="#333" gap={24} size={2} />
                    <Controls className="!bg-neutral-800 !border-neutral-700 !fill-neutral-300" />
                </ReactFlow>

                {/* Evaluation Controls Overlay */}
                {steps.length > 0 && !error && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900/90 backdrop-blur-xl p-4 rounded-2xl border border-neutral-700 shadow-2xl flex flex-col items-center gap-4 transition-all">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentStep(-1)}
                                className="p-3 hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors"
                                title="Reset Evaluation"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCurrentStep(c => Math.min(c + 1, steps.length - 1))}
                                disabled={currentStep >= steps.length - 1}
                                className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 disabled:grayscale text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
                            >
                                <Play className="w-5 h-5" /> Next Step
                            </button>
                            <button
                                onClick={() => setCurrentStep(steps.length - 1)}
                                disabled={currentStep >= steps.length - 1}
                                className="p-3 hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors"
                                title="Skip to End"
                            >
                                <SkipForward className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="text-sm font-mono text-emerald-400 min-h-[24px] text-center w-full min-w-[350px] bg-black/40 py-2 px-4 rounded-lg border border-neutral-800">
                            {currentStep >= 0 ? steps[currentStep].description : "Ready to evaluate bottom-up"}
                            <span className="ml-3 text-neutral-500">
                                ({Math.max(0, currentStep + 1)} / {steps.length})
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
