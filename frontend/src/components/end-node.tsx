import { BaseNode } from "@/components/base-node";
import { Handle, NodeProps, Position } from "@xyflow/react";

function EndNode({ selected }: NodeProps) {
  return (
    <BaseNode
      selected={selected}
      className="w-xs bg-gray-100 text-center rounded-full"
    >
      <h2>END</h2>
      <Handle type="target" position={Position.Top} />
    </BaseNode>
  );
}

export default EndNode;
