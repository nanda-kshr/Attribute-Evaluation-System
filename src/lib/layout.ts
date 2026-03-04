import dagre from 'dagre';
import { Node, Edge, Position } from '@xyflow/react';

export function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction, align: 'DL', ranker: 'longest-path' });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 120, height: 100 });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const newNode = { ...node };
        newNode.targetPosition = isHorizontal ? Position.Left : Position.Top;
        newNode.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

        // We are shifting the dagre node position to match React Flow's top-left anchor
        newNode.position = {
            x: nodeWithPosition.x - 60,
            y: nodeWithPosition.y - 50,
        };
        return newNode;
    });

    return { nodes: newNodes, edges };
}
