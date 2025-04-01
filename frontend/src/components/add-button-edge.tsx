import { ButtonEdge } from "@/components/button-edge";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { EdgeProps } from "@xyflow/react";

function AddButtonEdge(props: EdgeProps) {
  const onEdgeClick = () => {
    window.alert(`Edge has been clicked!`);
  };

  return (
    <ButtonEdge {...props}>
      <Button
        onClick={onEdgeClick}
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
