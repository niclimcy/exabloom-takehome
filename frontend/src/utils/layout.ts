import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { stratify, tree } from "d3-hierarchy";

const g = tree<Node>();

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  if (nodes.length === 0) return { nodes, edges };

  const nodeWidth = 200;
  const nodeHeight = 100;

  const hierarchy = stratify<Node>()
    .id((node) => node.id)
    .parentId((node) => {
      const edge = edges.find((edge) => edge.target === node.id);
      return edge ? edge.source : null;
    });

  try {
    const root = hierarchy(nodes);
    const layout = g.nodeSize([nodeWidth * 2, nodeHeight * 2])(root);

    return {
      nodes: layout
        .descendants()
        .map((node) => ({ ...node.data, position: { x: node.x, y: node.y } })),
      edges,
    };
  } catch (error) {
    console.error("Layout calculation failed:", error);
    return { nodes, edges };
  }
};

export const applyLayout = (reactFlowInstance: ReactFlowInstance) => {
  const nodes = reactFlowInstance.getNodes();
  const edges = reactFlowInstance.getEdges();

  const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges);

  reactFlowInstance.setNodes(layoutedNodes);
  setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 50);
};
