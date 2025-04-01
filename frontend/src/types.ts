import ActionNode from "@/components/action-node";
import AddButtonEdge from "@/components/add-button-edge";
import BranchNode from "@/components/branch-node";
import EndNode from "@/components/end-node";
import IfElseNode from "@/components/if-else-node";
import StartNode from "@/components/start-node";
import { EdgeTypes, NodeTypes } from "@xyflow/react";

const nodeTypes: NodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  ifElse: IfElseNode,
  branch: BranchNode,
};

const edgeTypes: EdgeTypes = {
  addButtonEdge: AddButtonEdge,
};

export { nodeTypes, edgeTypes };
