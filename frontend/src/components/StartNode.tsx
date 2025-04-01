import { IconMessage2Share } from "@tabler/icons-react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";

type StartNode = Node<{ label: string }, "label">;

function StartNode({ data }: NodeProps<StartNode>) {
  return (
    <>
      <div className="px-4 py-6 rounded-md flex bg-white shadow-md border border-gray-300 gap-4 w-xs">
        <div className="text-green-600 bg-green-200 rounded-md p-2">
          <IconMessage2Share className="size-8" />
        </div>
        <div>
          <h2 className="text-green-600">Start Node</h2>
          <p>{data.label}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default StartNode;
