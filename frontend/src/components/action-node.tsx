import { BaseNode } from "@/components/base-node";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IconUserEdit } from "@tabler/icons-react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { useState } from "react";
import { Button } from "./ui/button";

type ActionNodeProps = Node<
  {
    label: string;
    onUpdateLabel: (label: string) => void;
    onDelete: () => void;
  },
  "label"
>;

function ActionNode({ data, selected }: NodeProps<ActionNodeProps>) {
  const [label, setLabel] = useState(data.label);

  return (
    <Sheet>
      <SheetTrigger asChild>
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
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Action</SheetTitle>
          <SheetDescription>{data.label}</SheetDescription>
        </SheetHeader>
        <div className="px-4 space-y-4">
          <Label>Action Name</Label>
          <Input
            defaultValue={data.label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <div className="flex justify-between">
            <SheetClose asChild>
              <Button variant="destructive" onClick={() => data.onDelete()}>
                Delete
              </Button>
            </SheetClose>
            <div className="flex gap-2">
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <SheetClose asChild>
                <Button onClick={() => data.onUpdateLabel(label)}>Save</Button>
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default ActionNode;
