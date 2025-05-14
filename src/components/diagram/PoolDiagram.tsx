import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  reconnectEdge, // Import reconnectEdge
  applyEdgeChanges, // Import applyEdgeChanges
  applyNodeChanges,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import "./xy-theme.css";

import CustomNode from "./CustomNode";
import FloatingEdge from "./FloatingEdge";
import CustomConnectionLine from "./CustomConnectionLine";

const connectionLineStyle = {
  stroke: "#b1b1b7",
};

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions = {
  type: "floating",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "var(--edge-marker-color-actual, #b1b1b7)", // Use CSS variable
  },
};

export default function PoolDiagram({ nodes: nodesFromProps, edges: edgesFromProps, isEditable }) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(nodesFromProps || []);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(edgesFromProps || []);
  const [flowColorMode, setFlowColorMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    setNodes(nodesFromProps || []);
  }, [nodesFromProps, setNodes]);

  useEffect(() => {
    setEdges(edgesFromProps || []);
  }, [edgesFromProps, setEdges]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "theme") {
        setFlowColorMode(event.newValue === "dark" ? "dark" : "light");
      }
    };

    // Set initial theme based on localStorage
    const currentTheme = localStorage.getItem("theme");
    setFlowColorMode(currentTheme === "dark" ? "dark" : "light");

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const onNodesChange = useCallback(
    (changes) => {
      if (!isEditable) return;
      onNodesChangeInternal(changes);
    },
    [isEditable, onNodesChangeInternal]
  );

  const onEdgesChange = useCallback(
    (changes) => {
      if (!isEditable) return;

      const nextChanges = changes.filter(change => {
        if (change.type === 'remove') {
          const edgeToRemove = edges.find(edge => edge.id === change.id);
          if (edgeToRemove) {
            const sourceNode = nodes.find(node => node.id === edgeToRemove.source);
            const targetNode = nodes.find(node => node.id === edgeToRemove.target);

            // Prevent deletion if connected to a default warehouse node
            // Assuming 'isDefault' is in node.data and type 'warehouse' indicates a warehouse
            if ((sourceNode?.data?.isDefault && sourceNode?.data?.type === 'warehouse') || 
                (targetNode?.data?.isDefault && targetNode?.data?.type === 'warehouse')) {
              // Optionally, provide feedback to the user that this edge cannot be deleted
              console.log("Cannot delete connections to/from a default warehouse.");
              return false; // Prevent this change
            }
          }
        }
        return true; // Allow other changes
      });

      onEdgesChangeInternal(nextChanges);
    },
    [isEditable, onEdgesChangeInternal, edges, nodes]
  );

  const onConnect = useCallback(
    (params) => {
      if (!isEditable) return;
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, isEditable]
  );

  // Ref to track if a reconnection attempt was successful
  const edgeReconnectSuccessful = useRef(true);

  const onReconnectStart = useCallback(() => {
    if (!isEditable) return;
    edgeReconnectSuccessful.current = false;
  }, [isEditable]);

  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      if (!isEditable) return;
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges, isEditable]
  );

  const onReconnectEnd = useCallback(
    (_, edge) => {
      if (!isEditable) return;
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeReconnectSuccessful.current = true; // Reset for the next operation
    },
    [setEdges, isEditable]
  );


  return (
    <ReactFlow
      colorMode={flowColorMode}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onReconnect={onReconnect}
      onReconnectStart={onReconnectStart}
      onReconnectEnd={onReconnectEnd}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      style={{ backgroundColor: "#111827" }} // Updated to a dark background color (Tailwind gray-900)
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineComponent={CustomConnectionLine}
      connectionLineStyle={connectionLineStyle}
      nodesDraggable={isEditable}
      nodesConnectable={isEditable}
      elementsSelectable={isEditable} // Controls if nodes and edges can be selected
      panOnDrag={isEditable} // Example: disable panning when editable, or keep it enabled
      zoomOnScroll={isEditable} // Example: disable zoom when editable
      zoomOnDoubleClick={isEditable} // Example: disable zoom on double click when editable
      // Consider if controls should be hidden or disabled when not editable
    >
       <Controls style={{ display: isEditable ? 'flex' : 'none' }} /> {/* Optionally hide controls */}
       <Background />
    </ReactFlow>
  );
}
