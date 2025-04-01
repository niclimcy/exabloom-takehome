import { BaseNode } from "@/components/base-node";
import { IconMessage2Share } from "@tabler/icons-react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

type StartNodeProps = Node<{ label: string }, "label">;

function StartNode({ data, selected }: NodeProps<StartNodeProps>) {
  return (
    <BaseNode selected={selected} className="w-xs flex gap-2">
      <div className="text-green-600 bg-green-200 rounded-md p-2">
        <IconMessage2Share className="size-8" />
      </div>
      <div>
        <h2 className="text-green-600">Start Node</h2>
        <p>{data.label}</p>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </BaseNode>
  );
}

export default StartNode;
