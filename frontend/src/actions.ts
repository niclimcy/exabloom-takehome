import { Edge, Node, ReactFlowInstance } from "@xyflow/react";

function handleUpdateLabel(
  reactFlowInstance: ReactFlowInstance,
  nodeId: string,
  newLabel: string,
) {
  reactFlowInstance.setNodes((nodes) =>
    nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            label: newLabel,
          },
        };
      }
      return node;
    }),
  );
}

function handleDeleteNode(
  reactFlowInstance: ReactFlowInstance,
  nodeId: string,
) {
  // Get current nodes and edges
  const currentNodes = reactFlowInstance.getNodes();
  const currentEdges = reactFlowInstance.getEdges();

  // Find the node to delete
  const nodeToDelete = currentNodes.find((node) => node.id === nodeId);
  if (!nodeToDelete) return;

  // Find incoming and outgoing edges
  const incomingEdge = currentEdges.find((edge) => edge.target === nodeId);
  const outgoingEdge = currentEdges.find((edge) => edge.source === nodeId);

  if (!incomingEdge || !outgoingEdge) return;

  // Create a new edge connecting the nodes before and after the deleted node
  const newEdge: Edge = {
    id: `${incomingEdge.source}-${outgoingEdge.target}`,
    source: incomingEdge.source,
    target: outgoingEdge.target,
    type: "addButtonEdge",
    data: {
      onClick: () =>
        addActionNode(
          reactFlowInstance,
          `${incomingEdge.source}-${outgoingEdge.target}`,
        ),
    },
  };

  // Remove the node and its connected edges
  reactFlowInstance.setNodes(currentNodes.filter((node) => node.id !== nodeId));
  reactFlowInstance.setEdges([
    ...currentEdges.filter(
      (edge) => edge.id !== incomingEdge.id && edge.id !== outgoingEdge.id,
    ),
    newEdge,
  ]);
}

function addActionNode(reactFlowInstance: ReactFlowInstance, edgeId: string) {
  const edges = reactFlowInstance.getEdges();

  // Find the edge that was clicked
  const edge = edges.find((e) => e.id === edgeId);
  if (!edge) return;

  // Find source and target nodes
  const nodes = reactFlowInstance.getNodes();
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);
  if (!sourceNode || !targetNode) return;

  // Create new action node with 200px spacing
  const newNodeId = `action-${Date.now()}`;

  // Calculate new positions
  const updatedNodes = [...nodes];

  updatedNodes.forEach((node) => {
    // Move nodes that are below the source node down
    if (node.position.y > sourceNode.position.y) {
      node.position.y += 200;
    }
  });

  // Moving downward
  const newNodePosition = {
    x: sourceNode.position.x,
    y: sourceNode.position.y + 200,
  };

  // Create new action node
  const newNode: Node = {
    id: newNodeId,
    position: newNodePosition,
    data: {
      label: "Action Node",
      onUpdateLabel: (newLabel: string) =>
        handleUpdateLabel(reactFlowInstance, newNodeId, newLabel),
      onDelete: () => handleDeleteNode(reactFlowInstance, newNodeId),
    },
    type: "action",
  };

  // Add new node to nodes
  updatedNodes.push(newNode);

  // Create new edges
  const sourceToNewEdge: Edge = {
    id: `${edge.source}-${newNodeId}`,
    source: edge.source,
    target: newNodeId,
    type: "addButtonEdge",
    data: {
      reactFlowInstance: reactFlowInstance,
    },
  };

  const newToTargetEdge: Edge = {
    id: `${newNodeId}-${edge.target}`,
    source: newNodeId,
    target: edge.target,
    type: "addButtonEdge",
    data: {
      reactFlowInstance: reactFlowInstance,
    },
  };

  // Update states
  reactFlowInstance.setNodes(updatedNodes);
  reactFlowInstance.setEdges([
    ...edges.filter((e) => e.id !== edgeId),
    sourceToNewEdge,
    newToTargetEdge,
  ]);
}

function addIfElseNode(reactFlowInstance: ReactFlowInstance, edgeId: string) {
  const edges = reactFlowInstance.getEdges();

  // Find the edge that was clicked
  const edge = edges.find((e) => e.id === edgeId);
  if (!edge) return;

  // Find source and target nodes
  const nodes = reactFlowInstance.getNodes();
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);
  if (!sourceNode || !targetNode) return;

  // Create new action node with 200px spacing
  const newNodeId = `action-${Date.now()}`;

  // Calculate new positions
  const updatedNodes = [...nodes];

  updatedNodes.forEach((node) => {
    // Move nodes that are below the source node down
    if (node.position.y > sourceNode.position.y) {
      node.position.y += 200;
    }
  });

  // Moving downward
  const newNodePosition = {
    x: sourceNode.position.x,
    y: sourceNode.position.y + 200,
  };

  // Create new action node
  const newNode: Node = {
    id: newNodeId,
    position: newNodePosition,
    data: {
      label: "If Else",
      elseLabel: "Else",
      branches: [],
      onDelete: () => handleDeleteNode(reactFlowInstance, newNodeId),
      onUpdateBranches: (branches: Node[]) => {},
      onUpdateLabel: (newLabel: string) =>
        handleUpdateLabel(reactFlowInstance, newNodeId, newLabel),
      onUpdateBranchesLabel: (branchId: string, newLabel: string) =>
        handleUpdateLabel(reactFlowInstance, branchId, newLabel),
      onUpdateElseLabel: (newLabel: string) =>
        handleUpdateLabel(reactFlowInstance, newNodeId, newLabel),
    },
    type: "ifElse",
  };

  // Add new node to nodes
  updatedNodes.push(newNode);

  // Create new edges
  const sourceToNewEdge: Edge = {
    id: `${edge.source}-${newNodeId}`,
    source: edge.source,
    target: newNodeId,
    type: "addButtonEdge",
    data: {
      reactFlowInstance: reactFlowInstance,
    },
  };

  const newToTargetEdge: Edge = {
    id: `${newNodeId}-${edge.target}`,
    source: newNodeId,
    target: edge.target,
    type: "addButtonEdge",
    data: {
      reactFlowInstance: reactFlowInstance,
    },
  };

  // Update states
  reactFlowInstance.setNodes(updatedNodes);
  reactFlowInstance.setEdges([
    ...edges.filter((e) => e.id !== edgeId),
    sourceToNewEdge,
    newToTargetEdge,
  ]);
}

export { handleUpdateLabel, handleDeleteNode, addActionNode, addIfElseNode };
