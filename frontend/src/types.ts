import EndNode from "@/components/end-node";
import StartNode from "@/components/start-node";
import { EdgeTypes, NodeTypes } from "@xyflow/react";
import AddButtonEdge from "./components/add-button-edge";

const nodeTypes: NodeTypes = { start: StartNode, end: EndNode };
const edgeTypes: EdgeTypes = { addButtonEdge: AddButtonEdge };

export { nodeTypes, edgeTypes };
