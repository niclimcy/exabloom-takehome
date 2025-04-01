import { Background, Controls, Edge, Node, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes, edgeTypes } from "@/types";

const initialNodes: Node[] = [
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
const initialEdges: Edge[] = [
  { id: "start-end", source: "start", target: "end", type: "addButtonEdge" },
];

function Flow() {
  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
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
