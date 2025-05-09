import React, { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
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
    color: "#b1b1b7",
  },
};

export default function PoolDiagram({ nodes: nodesFromProps, edges: edgesFromProps }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(nodesFromProps || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesFromProps || []);

  useEffect(() => {
    setNodes(nodesFromProps || []);
  }, [nodesFromProps, setNodes]);

  useEffect(() => {
    setEdges(edgesFromProps || []);
  }, [edgesFromProps, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      colorMode="dark"
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      style={{ backgroundColor: "#111827" }} // Updated to a dark background color (Tailwind gray-900)
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineComponent={CustomConnectionLine}
      connectionLineStyle={connectionLineStyle}
    >
       <Controls />
       <Background />
    </ReactFlow>
  );
}
