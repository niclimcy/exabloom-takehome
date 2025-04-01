import {
  Background,
  Controls,
  Edge,
  Node,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { edgeTypes, nodeTypes } from "@/types";
import { useEffect } from "react";

const defaultNodes: Node[] = [
  {
    id: "start",
    position: { x: 300, y: 200 },
    data: { label: "Start" },
    type: "start",
  },
  {
    id: "end",
    position: { x: 300, y: 400 },
    data: {},
    type: "end",
  },
];

const defaultEdges: Edge[] = [];

function Flow() {
  const reactFlowInstance = useReactFlow();

  function addActionNode(edgeId: string) {
    const edges = reactFlowInstance.getEdges();

    // Find the edge that was clicked
    const edge = edges.find((e) => e.id === edgeId);
    if (!edge) return;

    // Find source and target nodes
    const nodes = reactFlowInstance.getNodes();
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) return;

    // Create new action node with 200px spacing
    const newNodeId = `action-${Date.now()}`;

    // Calculate new positions
    const updatedNodes = [...nodes];

    updatedNodes.forEach((node) => {
      // Move nodes that are below the source node down
      if (node.position.y > sourceNode.position.y) {
        node.position.y += 200;
      }
    });

    // Moving downward
    const newNodePosition = {
      x: sourceNode.position.x,
      y: sourceNode.position.y + 200,
    };

    // Create new action node
    const newNode: Node = {
      id: newNodeId,
      position: newNodePosition,
      data: { label: "Action Node" },
      type: "action",
    };

    // Add new node to nodes
    updatedNodes.push(newNode);

    // Create new edges
    const sourceToNewEdge: Edge = {
      id: `${edge.source}-${newNodeId}`,
      source: edge.source,
      target: newNodeId,
      type: "addButtonEdge",
      data: {
        onClick: () => addActionNode(`${edge.source}-${newNodeId}`),
      },
    };

    const newToTargetEdge: Edge = {
      id: `${newNodeId}-${edge.target}`,
      source: newNodeId,
      target: edge.target,
      type: "addButtonEdge",
      data: {
        onClick: () => addActionNode(`${newNodeId}-${edge.target}`),
      },
    };

    // Update states separately and only once
    reactFlowInstance.setNodes(updatedNodes);
    reactFlowInstance.setEdges([
      ...edges.filter((e) => e.id !== edgeId),
      sourceToNewEdge,
      newToTargetEdge,
    ]);
  }

  useEffect(() => {
    // Add a default edge
    const initialEdge: Edge = {
      id: "start-end",
      source: "start",
      target: "end",
      type: "addButtonEdge",
      data: {
        onClick: () => addActionNode("start-end"),
      },
    };
    reactFlowInstance.addEdges(initialEdge);
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        defaultNodes={defaultNodes}
        defaultEdges={defaultEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
