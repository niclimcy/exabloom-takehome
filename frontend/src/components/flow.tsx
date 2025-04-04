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
import { getLayoutedElements } from "@/utils/layout";
import { useCallback, useEffect } from "react";

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

const defaultEdges: Edge[] = [
  {
    id: "start-end",
    source: "start",
    target: "end",
    type: "addButtonEdge",
  },
];

function Flow() {
  const reactFlowInstance = useReactFlow();
  const { fitView } = reactFlowInstance;

  useEffect(() => {
    reactFlowInstance.setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        data: { ...edge.data, reactFlowInstance: reactFlowInstance },
      })),
    );
  }, []);

  const onLayout = useCallback(() => {
    const nodes = reactFlowInstance.getNodes();
    const edges = reactFlowInstance.getEdges();
    const layouted = getLayoutedElements(nodes, edges);

    reactFlowInstance.setNodes([...layouted.nodes]);
    reactFlowInstance.setEdges([...layouted.edges]);

    fitView();
  }, [fitView, reactFlowInstance]);

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        defaultNodes={defaultNodes}
        defaultEdges={defaultEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={() => {
          onLayout();
        }}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;
