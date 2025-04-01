import { Handle, Node, NodeProps, Position } from "@xyflow/react";

type StartNode = Node<{ label: string }, "label">;

function StartNode({ data }: NodeProps<StartNode>) {
  return (
    <>
      <div>{data.label} Hi</div>
      <Handle type="target" position={Position.Bottom} />
    </>
  );
}

export default StartNode;
