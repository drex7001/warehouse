import React, { useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
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


const warehouses = [
  {
    id: "warehouse-1",
    type: "custom",
    data: { 
      label: "Warehouse 1", 
      type: "warehouse",
      isDefault: true,
      cities: "New York, Boston"
    },
    position: { x: 100, y: 100 },
  },
  {
    id: "warehouse-2",
    type: "custom",
    data: { 
      label: "Warehouse 2", 
      type: "warehouse",
      cities: "Chicago, Detroit" 
    },
    position: { x: 100, y: 250 },
  },
  {
    id: "warehouse-3",
    type: "custom",
    data: { 
      label: "Warehouse 3", 
      type: "warehouse",
      cities: "Los Angeles, San Francisco" 
    },
    position: { x: 100, y: 400 },
  }
];

const storefronts = [
  {
    id: "storefront-1",
    type: "custom",
    data: { 
      label: "Storefront 1",
      type: "storefront" 
    },
    position: { x: 500, y: 50 },
  },
  // Update the remaining storefronts similarly
  {
    id: "storefront-2",
    type: "custom",
    data: { 
      label: "Storefront 2",
      type: "storefront" 
    },
    position: { x: 500, y: 200 },
  },
  {
    id: "storefront-3",
    type: "custom",
    data: { 
      label: "Storefront 3",
      type: "storefront" 
    },
    position: { x: 500, y: 350 },
  },
  {
    id: "storefront-4",
    type: "custom",
    data: { 
      label: "Storefront 4",
      type: "storefront" 
    },
    position: { x: 500, y: 500 },
  }
];


const initialNodes = [...warehouses, ...storefronts];
const initialEdges = warehouses
  .filter(warehouse => warehouse.data.isDefault)
  .flatMap(warehouse => 
    storefronts.map(storefront => ({
      id: `${warehouse.id}-${storefront.id}`,
      source: warehouse.id,
      target: storefront.id,
      type: 'floating'
    }))
  );

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

export default function Pool() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
      style={{ backgroundColor: "#F7F9FB" }}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineComponent={CustomConnectionLine}
      connectionLineStyle={connectionLineStyle}
    >
       <Controls />
       <Background />
    </ReactFlow>
  );
}
