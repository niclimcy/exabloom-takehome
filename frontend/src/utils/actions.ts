import { Edge, Node, ReactFlowInstance } from "@xyflow/react";
import { applyLayout } from "./layout";

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

  // Apply layout after node deletion
  setTimeout(() => applyLayout(reactFlowInstance), 10);
}

function addActionNode(reactFlowInstance: ReactFlowInstance, edgeId: string) {
  const edges = reactFlowInstance.getEdges();

  // Find the edge that was clicked
  const edge = edges.find((e) => e.id === edgeId);
  if (!edge) return;

  // Create new action node
  const newNodeId = `action-${Date.now()}`;

  // Create new action node without position (will be set by layout engine)
  const newNode: Node = {
    id: newNodeId,
    position: { x: 0, y: 0 }, // Default position, will be set by layout
    data: {
      label: "Action Node",
      onUpdateLabel: (newLabel: string) =>
        handleUpdateLabel(reactFlowInstance, newNodeId, newLabel),
      onDelete: () => handleDeleteNode(reactFlowInstance, newNodeId),
    },
    type: "action",
  };

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
  reactFlowInstance.setNodes((nodes) => [...nodes, newNode]);
  reactFlowInstance.setEdges([
    ...edges.filter((e) => e.id !== edgeId),
    sourceToNewEdge,
    newToTargetEdge,
  ]);

  // Apply layout after adding node
  setTimeout(() => applyLayout(reactFlowInstance), 10);
}

function handleAddBranch(
  reactFlowInstance: ReactFlowInstance,
  branchId: string,
  branchLabel: string,
  parentNodeId: string,
) {
  // Get current nodes and edges
  const currentNodes = reactFlowInstance.getNodes();

  // Find the parent if-else node
  const parentNode = currentNodes.find((node) => node.id === parentNodeId);
  if (!parentNode) return;

  const newBranch: Node = {
    id: branchId,
    position: { x: 0, y: 0 },
    data: {
      label: branchLabel,
      onUpdateLabel: (newLabel: string) =>
        handleUpdateLabel(reactFlowInstance, branchId, newLabel),
    },
    type: "branch",
  };

  // Add end node for the new branch
  const endNodeId = `end-${Date.now()}`;
  const endNode: Node = {
    id: endNodeId,
    position: { x: 0, y: 0 },
    data: {
      label: "End",
    },
    type: "end",
  };

  // Add new branch and end node
  reactFlowInstance.setNodes([...currentNodes, newBranch, endNode]);

  // Create edge connecting the if-else node to the branch
  const newEdge: Edge = {
    id: `${parentNodeId}-${branchId}`,
    source: parentNodeId,
    target: branchId,
    type: "step",
  };

  // Create edge connecting the branch to the end node
  const branchToEndEdge: Edge = {
    id: `${branchId}-${endNodeId}`,
    source: branchId,
    target: endNodeId,
    type: "addButtonEdge",
    data: {
      reactFlowInstance: reactFlowInstance,
    },
  };

  // Update edges
  reactFlowInstance.setEdges((edges) => [...edges, newEdge, branchToEndEdge]);

  // Update the parent node's branches data
  reactFlowInstance.setNodes((nodes) =>
    nodes.map((node) => {
      if (node.id === parentNodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            branches: {
              ...(node.data.branches as Record<string, string>),
              [branchId]: branchLabel,
            },
          },
        };
      }
      return node;
    }),
  );

  // Apply layout after adding branch
  setTimeout(() => applyLayout(reactFlowInstance), 10);

  return newBranch;
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

  // Create new if-else node
  const ifElseNodeId = `ifelse-${Date.now()}`;
  const updatedEdges = edges.filter((e) => e.id !== edgeId);

  // Create if-else node (position will be set by layout engine)
  const newNode: Node = {
    id: ifElseNodeId,
    position: { x: 0, y: 0 },
    data: {
      label: "If / Else",
      branches: {},
      elseNode: null,
      onDelete: () => handleDeleteNode(reactFlowInstance, ifElseNodeId),
      onAddBranch: (branchId: string, label: string) =>
        handleAddBranch(reactFlowInstance, branchId, label, ifElseNodeId),
      onRemoveBranch: (branchId: string) => {
        handleDeleteNode(reactFlowInstance, branchId);
      },
      onUpdateLabel: (newLabel: string) =>
        handleUpdateLabel(reactFlowInstance, ifElseNodeId, newLabel),
      onUpdateBranchLabel: (branchId: string, newLabel: string) =>
        handleUpdateLabel(reactFlowInstance, branchId, newLabel),
      onUpdateElseLabel: (elseId: string, newLabel: string) =>
        handleUpdateLabel(reactFlowInstance, elseId, newLabel),
    },
    type: "ifElse",
  };

  // Create edge from source to if-else
  const sourceToIfElseEdge: Edge = {
    id: `${edge.source}-${ifElseNodeId}`,
    source: edge.source,
    target: ifElseNodeId,
    type: "addButtonEdge",
    data: {
      reactFlowInstance: reactFlowInstance,
    },
  };

  updatedEdges.push(sourceToIfElseEdge);

  // Create a default branch
  const branchId = `branch-${Date.now()}`;
  const branchLabel = "Default Branch";

  // Create else node
  const elseId = `else-${Date.now()}`;
  const elseLabel = "Else";

  // Create branch node
  const branchNode: Node = {
    id: branchId,
    position: { x: 0, y: 0 },
    data: {
      label: branchLabel,
      onUpdateLabel: (newLabel: string) =>
        handleUpdateLabel(reactFlowInstance, branchId, newLabel),
    },
    type: "branch",
  };

  // Create else node
  const elseNode: Node = {
    id: elseId,
    position: { x: 0, y: 0 },
    data: {
      label: elseLabel,
      onUpdateLabel: (newLabel: string) =>
        handleUpdateLabel(reactFlowInstance, elseId, newLabel),
    },
    type: "branch",
  };

  // Create end node for else branch
  const endNodeId = `end-${Date.now()}`;
  const endNode: Node = {
    id: endNodeId,
    position: { x: 0, y: 0 },
    data: {
      label: "End",
    },
    type: "end",
  };

  // Create edge connecting if-else to branch
  const ifElseToBranchEdge: Edge = {
    id: `${ifElseNodeId}-${branchId}`,
    source: ifElseNodeId,
    target: branchId,
    type: "step",
  };

  // Create edge connecting if-else to else
  const ifElseToElseEdge: Edge = {
    id: `${ifElseNodeId}-${elseId}`,
    source: ifElseNodeId,
    target: elseId,
    type: "step",
  };

  updatedEdges.push(ifElseToBranchEdge);
  updatedEdges.push(ifElseToElseEdge);

  // Connect branch to target node
  const branchToTargetEdge: Edge = {
    id: `${branchId}-${targetNode.id}`,
    source: branchId,
    target: targetNode.id,
    type: "addButtonEdge",
    data: {
      reactFlowInstance: reactFlowInstance,
    },
  };

  updatedEdges.push(branchToTargetEdge);

  // Create edge to connect else to end node
  const elseToEndEdge: Edge = {
    id: `${elseId}-${endNodeId}`,
    source: elseId,
    target: endNodeId,
    type: "addButtonEdge",
    data: {
      reactFlowInstance: reactFlowInstance,
    },
  };

  updatedEdges.push(elseToEndEdge);

  // Apply all nodes at once
  reactFlowInstance.setNodes([
    ...nodes,
    newNode,
    branchNode,
    elseNode,
    endNode,
  ]);

  // Update if-else node with branch data
  reactFlowInstance.setNodes((nodes) =>
    nodes.map((node) => {
      if (node.id === ifElseNodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            branches: {
              [branchId]: branchLabel,
            },
            elseNode: { id: elseId, label: elseLabel },
          },
        };
      }
      return node;
    }),
  );

  reactFlowInstance.setEdges(updatedEdges);

  // Apply layout after adding if-else structure
  setTimeout(() => applyLayout(reactFlowInstance), 10);
}

export { handleUpdateLabel, handleDeleteNode, addActionNode, addIfElseNode };
