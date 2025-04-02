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

function handleAddBranch(
  reactFlowInstance: ReactFlowInstance,
  branchId: string,
  branchLabel: string,
  parentNodeId: string,
) {
  // Get current nodes and edges
  const currentNodes = reactFlowInstance.getNodes();
  const currentEdges = reactFlowInstance.getEdges();

  // Find the parent if-else node
  const parentNode = currentNodes.find((node) => node.id === parentNodeId);
  if (!parentNode) return;

  // Count existing branches and get the else node
  const branchCount = Object.keys(parentNode.data.branches || {}).length;
  const elseNodeId = (parentNode.data.elseNode as Node).id;

  // Get all current branches + else node
  const currentBranchIds = [
    ...Object.keys(parentNode.data.branches || {}),
    elseNodeId,
  ].filter(Boolean);

  // Calculate horizontal spacing
  const totalBranches = branchCount + 2;
  const branchSpacing = 400;
  const totalWidth = branchSpacing * (totalBranches - 1);
  const startX = parentNode.position.x - totalWidth / 2;

  // Reposition all existing branch nodes
  const updatedNodes = currentNodes.map((node) => {
    if (currentBranchIds.includes(node.id)) {
      const branchIndex = currentBranchIds.indexOf(node.id);
      return {
        ...node,
        position: {
          x: startX + branchIndex * branchSpacing,
          y: parentNode.position.y + 200,
        },
      };
    }
    return node;
  });

  // Calculate position for the new branch node
  const branchPosition = {
    x: startX + branchCount * branchSpacing,
    y: parentNode.position.y + 200,
  };

  // Create new branch node
  const newBranch: Node = {
    id: branchId,
    position: branchPosition,
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
    position: {
      x: branchPosition.x,
      y: branchPosition.y + 150,
    },
    data: {
      label: "End",
    },
    type: "end",
  };

  // Update all existing end nodes to align with their branches
  const branchToEndEdges = currentEdges.filter(
    (edge) =>
      currentBranchIds.includes(edge.source) &&
      currentNodes.find((n) => n.id === edge.target)?.type === "end",
  );

  branchToEndEdges.forEach((edge) => {
    const endNodeToUpdate = updatedNodes.find(
      (node) => node.id === edge.target,
    );
    const sourceNode = updatedNodes.find((node) => node.id === edge.source);
    if (endNodeToUpdate && sourceNode) {
      endNodeToUpdate.position = {
        x: sourceNode.position.x,
        y: sourceNode.position.y + 150,
      };
    }
  });

  // After adding the branch, reposition the else node to the end of the branch array
  if (elseNodeId) {
    const elseNode = updatedNodes.find((node) => node.id === elseNodeId);
    if (elseNode) {
      // After adding the new branch, else should be at position totalBranches-1
      elseNode.position = {
        x: startX + (totalBranches - 1) * branchSpacing,
        y: parentNode.position.y + 200,
      };

      // Also update any end nodes connected to the else branch
      const elseToEndEdge = currentEdges.find(
        (edge) => edge.source === elseNodeId,
      );
      if (elseToEndEdge) {
        const endNode = updatedNodes.find(
          (node) => node.id === elseToEndEdge.target,
        );
        if (endNode) {
          endNode.position = {
            x: elseNode.position.x,
            y: elseNode.position.y + 150,
          };
        }
      }
    }
  }

  // Add new branch to nodes
  reactFlowInstance.setNodes([...updatedNodes, newBranch, endNode]);

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

  // Calculate new positions
  const updatedNodes = [...nodes];
  const updatedEdges = edges.filter((e) => e.id !== edgeId);

  updatedNodes.forEach((node) => {
    // Move nodes that are below the source node down
    if (node.position.y > sourceNode.position.y) {
      node.position.y += 400;
    }
  });

  // Position for if-else node
  const newNodePosition = {
    x: sourceNode.position.x,
    y: sourceNode.position.y + 200,
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

  // Create new if-else node
  const newNode: Node = {
    id: ifElseNodeId,
    position: newNodePosition,
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

  // Add if-else node to nodes
  updatedNodes.push(newNode);
  updatedEdges.push(sourceToIfElseEdge);

  // Create a default branch
  const branchId = `branch-${Date.now()}`;
  const branchLabel = "Default Branch";

  // Create else node
  const elseId = `else-${Date.now()}`;
  const elseLabel = "Else";

  // Use same spacing as in handleAddBranch
  const branchSpacing = 400;
  const totalBranches = 2; // Default branch + else
  const totalWidth = branchSpacing * (totalBranches - 1);
  const startX = newNodePosition.x - totalWidth / 2;

  // reposition existing nodes below default branch
  updatedNodes.forEach((node) => {
    if (node.position.y > newNodePosition.y) {
      node.position.x = startX;
    }
  });

  // Calculate positions for default branch and else nodes
  const branchPosition = {
    x: startX,
    y: newNodePosition.y + 200,
  };

  const elsePosition = {
    x: startX + branchSpacing,
    y: newNodePosition.y + 200,
  };

  // Create branch node
  const branchNode: Node = {
    id: branchId,
    position: branchPosition,
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
    position: elsePosition,
    data: {
      label: elseLabel,
      onUpdateLabel: (newLabel: string) =>
        handleUpdateLabel(reactFlowInstance, elseId, newLabel),
    },
    type: "branch",
  };

  updatedNodes.push(branchNode);
  updatedNodes.push(elseNode);

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

  // Update if-else node with branch data
  const ifElseWithBranches = updatedNodes.find((n) => n.id === ifElseNodeId);
  if (ifElseWithBranches) {
    ifElseWithBranches.data.branches = {
      [branchId]: branchLabel,
    };
    ifElseWithBranches.data.elseNode = { id: elseId, label: elseLabel };
  }

  // Create end node for else branch
  const endNodeId = `end-${Date.now()}`;
  const endNode: Node = {
    id: endNodeId,
    position: {
      x: elsePosition.x,
      y: elsePosition.y + 200,
    },
    data: {
      label: "End",
    },
    type: "end",
  };

  updatedNodes.push(endNode);

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

  // Apply all updates at once
  reactFlowInstance.setNodes(updatedNodes);
  reactFlowInstance.setEdges(updatedEdges);
}

export { handleUpdateLabel, handleDeleteNode, addActionNode, addIfElseNode };
