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

  useEffect(() => {
    // Add a default edge
    const initialEdge: Edge = {
      id: "start-end",
      source: "start",
      target: "end",
      type: "addButtonEdge",
      data: {
        reactFlowInstance: reactFlowInstance,
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
