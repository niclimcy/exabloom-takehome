import { Background, Controls, Node, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "../types";

const initialNodes: Node[] = [
  {
    id: "start",
    position: { x: 0, y: 0 },
    data: { label: "Start" },
    type: "start",
  },
  {
    id: "end",
    position: { x: 0, y: 100 },
    data: { label: "End" },
    type: "end",
  },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

function Flow() {
  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
