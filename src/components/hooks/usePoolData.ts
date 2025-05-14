// filepath: src/components/hooks/usePoolData.ts
import { useState, useEffect } from 'react';

// Define or import initial data and transformation functions here
// For example:
// const initialWarehousesData = [
//   { id: 'w1', name: 'Warehouse A', details: 'Serves New York, Boston', isDefault: true },
//   { id: 'w2', name: 'Warehouse B', details: 'Serves Chicago, Detroit', isDefault: false },
// ];
// const initialStoresData = [
//   { id: 's1', name: 'My Shopify Store', type: 'shopify', apiKey: 'shpat_123', storeUrl: 'https://s1.myshopify.com' },
//   { id: 's2', name: 'My WooCommerce Site', type: 'woocommerce', consumerKey: 'ck_abc', consumerSecret: 'cs_def', siteUrl: 'https://mywoosite.com' },
//   { id: 's3', name: 'My Daraz Shop', type: 'daraz', sellerId: 'daraz_seller_789' },
// ];
const WAREHOUSE_NODE_X = 100;
const STORE_NODE_X = 500;
const NODE_Y_SPACING = 150;

// const transformWarehouseToNode = (warehouse, index) => ({ /* ... as in Pool.tsx ... */ });
// const transformStoreToNode = (store, index) => ({ /* ... as in Pool.tsx ... */ });
// const generatediagramEdges = (appWarehouses, appStores) => { /* ... as in Pool.tsx ... */ };


// Placeholder for actual initial data and functions:
// You would move the definitions of initialWarehouses, initialStores,
// WAREHOUSE_NODE_X, STORE_NODE_X, NODE_Y_SPACING,
// transformWarehouseToNode, transformStoreToNode, and generatediagramEdges
// from Pool.tsx to this file or a shared utils file.

const initialWarehousesData = []; // Replace with actual data from Pool.tsx
const initialStoresData = []; // Replace with actual data from Pool.tsx
const transformWarehouseToNode = (warehouse: any, index: number) => ({ id: `warehouse-${warehouse.id}`, type: 'custom', data: { label: warehouse.name, type: 'warehouse' }, position: { x: 100, y: 100 + index * 150 } });
const transformStoreToNode = (store: any, index: number) => ({ id: `store-${store.id}`, type: 'custom', data: { label: store.name, type: 'storefront' }, position: { x: 500, y: 50 + index * 150 } });
const generatediagramEdges = (appWarehouses: any[], appStores: any[]) => {
    const edges: any[] = [];
    const defaultWarehouses = appWarehouses.filter(wh => wh.isDefault);
    defaultWarehouses.forEach(warehouse => {
        appStores.forEach(store => {
        edges.push({
            id: `edge-${warehouse.id}-${store.id}`,
            source: `warehouse-${warehouse.id}`,
            target: `store-${store.id}`,
            type: 'floating',
        });
        });
    });
    return edges;
};


export function usePoolData() {
  const [warehouses, setWarehouses] = useState<any[]>(initialWarehousesData);
  const [stores, setStores] = useState<any[]>(initialStoresData);
  const [diagramNodes, setDiagramNodes] = useState<any[]>([]);
  const [diagramEdges, setDiagramEdges] = useState<any[]>([]);

  useEffect(() => {
    const transformedWarehouses = warehouses.map((wh, index) => transformWarehouseToNode(wh, index));
    const transformedStores = stores.map((st, index) => transformStoreToNode(st, index));
    setDiagramNodes([...transformedWarehouses, ...transformedStores]);
    setDiagramEdges(generatediagramEdges(warehouses, stores));
  }, [warehouses, stores]);

  return {
    warehouses,
    setWarehouses,
    stores,
    setStores,
    diagramNodes,
    diagramEdges,
  };
}