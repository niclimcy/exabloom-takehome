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
import { IconPlus, IconRouteAltLeft, IconX } from "@tabler/icons-react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type IfElseNodeProps = Node<
  {
    label: string;
    branches: Record<string, string>;
    elseNode: { id: string; label: string } | null;
    onDelete: () => void;
    onAddBranch: (branchId: string, label: string) => void;
    onRemoveBranch: (branchId: string) => void;
    onUpdateLabel: (label: string) => void;
    onUpdateBranchLabel: (branchId: string, label: string) => void;
    onUpdateElseLabel: (elseId: string, label: string) => void;
  },
  "ifElse"
>;

function IfElseNode({ data, selected }: NodeProps<IfElseNodeProps>) {
  const [label, setLabel] = useState(data.label);
  const [elseLabel, setElseLabel] = useState(data.elseNode?.label || "Else");
  const [branches, setBranches] = useState<Record<string, string>>(
    data.branches || {},
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <BaseNode selected={selected} className="w-xs flex gap-2">
          <Handle type="target" position={Position.Top} />
          <div className="text-yellow-500 bg-yellow-100 rounded-md p-2">
            <IconRouteAltLeft className="size-8" />
          </div>
          <div className="flex flex-col justify-center">
            <h2>{data.label}</h2>
          </div>
          <Handle type="source" position={Position.Bottom} />
        </BaseNode>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Branches</SheetTitle>
          <SheetDescription>{data.label}</SheetDescription>
        </SheetHeader>
        <div className="px-4 space-y-4">
          <Label>Branch Name</Label>
          <Input
            defaultValue={data.label}
            onChange={(e) => setLabel(e.target.value)}
          />

          <h3 className="font-bold">Branches</h3>
          {Object.entries(branches).map(([branchId, branchLabel]) => (
            <Card key={branchId} className="mb-4">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="flex-1">
                  <Input
                    defaultValue={branchLabel}
                    onChange={(e) => {
                      setBranches((prev) => ({
                        ...prev,
                        [branchId]: e.target.value,
                      }));
                      data.onUpdateBranchLabel(branchId, e.target.value);
                    }}
                    placeholder="Branch name"
                    className="h-8"
                  />
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const newBranches = { ...branches };
                    delete newBranches[branchId];
                    setBranches(newBranches);
                    data.onRemoveBranch(branchId);
                  }}
                >
                  <IconX size={16} />
                </Button>
              </CardHeader>
              <CardContent className="pt-2">
                {/* Empty card body */}
              </CardContent>
            </Card>
          ))}

          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              className="self-end"
              onClick={() => {
                const branchId = `branch-${Date.now()}`;
                const branchLabel = "New Branch";
                setBranches({
                  ...branches,
                  [branchId]: branchLabel,
                });
                data.onAddBranch(branchId, branchLabel);
              }}
            >
              <IconPlus size={16} />
              Add Branch
            </Button>
          </div>

          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle>
                <Label>Else</Label>
                <Input
                  defaultValue={elseLabel}
                  onChange={(e) => setElseLabel(e.target.value)}
                  placeholder="Else"
                  className="mt-2"
                />
              </CardTitle>
            </CardHeader>
          </Card>

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
                <Button
                  onClick={() => {
                    data.onUpdateLabel(label);
                    if (data.elseNode) {
                      data.onUpdateElseLabel(data.elseNode.id, elseLabel);
                    }
                  }}
                >
                  Save
                </Button>
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default IfElseNode;
