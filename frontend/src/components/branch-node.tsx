import { BaseNode } from "@/components/base-node";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

type BranchNodeProps = Node<{ label: string }, "branch">;

function BranchNode({ data, selected }: NodeProps<BranchNodeProps>) {
  return (
    <BaseNode
      selected={selected}
      className="w-xs bg-gray-100 text-center rounded-full"
    >
      <Handle type="target" position={Position.Top} />
      <h2>{data.label}</h2>
      <Handle type="source" position={Position.Bottom} />
    </BaseNode>
  );
}

export default BranchNode;
