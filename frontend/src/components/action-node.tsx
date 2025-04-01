import { BaseNode } from "@/components/base-node";
import { IconUserEdit } from "@tabler/icons-react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

type ActionNodeProps = Node<{ label: string }, "label">;

function ActionNode({ data, selected }: NodeProps<ActionNodeProps>) {
  return (
    <BaseNode selected={selected} className="w-xs flex gap-2">
      <Handle type="target" position={Position.Top} />
      <div className="text-blue-600 bg-blue-200 rounded-md p-2">
        <IconUserEdit className="size-8" />
      </div>
      <div className="flex flex-col justify-center">
        <h2>{data.label}</h2>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </BaseNode>
  );
}

export default ActionNode;
