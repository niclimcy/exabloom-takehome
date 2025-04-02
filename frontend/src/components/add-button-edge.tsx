import { addActionNode, addIfElseNode } from "@/actions";
import { ButtonEdge } from "@/components/button-edge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconPlus, IconRouteAltLeft, IconUserEdit } from "@tabler/icons-react";
import { Edge, EdgeProps, ReactFlowInstance } from "@xyflow/react";

type AddButtonEdgeProps = Edge<
  { reactFlowInstance: ReactFlowInstance },
  "addButton"
>;

function AddButtonEdge(props: EdgeProps<AddButtonEdgeProps>) {
  return (
    <ButtonEdge {...props}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-primary-foreground">
            <IconPlus size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="space-y-2">
          <div className="text-sm">Add Node</div>
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => {
              if (!props.data?.reactFlowInstance) return;

              addActionNode(props.data.reactFlowInstance, props.id);
            }}
          >
            <div className="text-blue-600 bg-blue-200 rounded-md p-2">
              <IconUserEdit className="size-4" />
            </div>
            Add Action Node
          </Button>
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={() => {
              if (!props.data?.reactFlowInstance) return;

              addIfElseNode(props.data.reactFlowInstance, props.id);
            }}
          >
            <div className="text-yellow-500 bg-yellow-100 rounded-md p-2">
              <IconRouteAltLeft className="size-4" />
            </div>
            Add If Else Node
          </Button>
        </PopoverContent>
      </Popover>
    </ButtonEdge>
  );
}

export default AddButtonEdge;
