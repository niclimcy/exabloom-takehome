import { ButtonEdge } from "@/components/button-edge";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { Edge, EdgeProps } from "@xyflow/react";

type AddButtonEdgeProps = Edge<{ onClick: () => void }, "addButton">;

function AddButtonEdge(props: EdgeProps<AddButtonEdgeProps>) {
  return (
    <ButtonEdge {...props}>
      <Button
        onClick={props.data?.onClick}
        variant="ghost"
        size="icon"
        className="bg-primary-foreground"
      >
        <IconPlus size={16} />
      </Button>
    </ButtonEdge>
  );
}

export default AddButtonEdge;
