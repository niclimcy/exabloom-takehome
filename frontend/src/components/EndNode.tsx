import { Handle, Position } from "@xyflow/react";

function EndNode() {
  return (
    <>
      <div className="px-4 py-6 rounded-full bg-gray-100 shadow-md border border-gray-300 gap-4 w-xs text-center">
        <h2>END</h2>
      </div>
      <Handle type="target" position={Position.Top} />
    </>
  );
}

export default EndNode;
