import { Handle, Node, NodeProps, Position } from "@xyflow/react";

type EndNode = Node<{ label: string }, "label">;

function EndNode({ data }: NodeProps<EndNode>) {
  return (
    <>
      <div>{data.label}</div>
      <Handle type="target" position={Position.Bottom} />
    </>
  );
}

export default EndNode;
