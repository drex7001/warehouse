import React, { useState } from 'react';
// shadcn/ui components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Your custom components
import { WarehouseDialog } from './warehouses/WarehouseDialog';
import { WarehouseTabContent } from './warehouses/WarehouseTabContent';
import { StoreDialog } from './storefronts/StoreDialog'; // Import StoreDialog
import { StoreTabContent } from './storefronts/StoreTabContent';
import Pool from './flow/Pool';


// Dummy data
const initialWarehouses = [
  { id: 'w1', name: 'Warehouse A', details: '(Default)' },
  { id: 'w2', name: 'Warehouse B', details: '(* if this has city list)' },
];
const initialStores = [
  { id: 's1', name: 'My Shopify Store', type: 'shopify', apiKey: 'shpat_123', storeUrl: 'https://s1.myshopify.com' },
  { id: 's2', name: 'My WooCommerce Site', type: 'woocommerce', consumerKey: 'ck_abc', consumerSecret: 'cs_def', siteUrl: 'https://mywoosite.com' },
  { id: 's3', name: 'My Daraz Shop', type: 'daraz', sellerId: 'daraz_seller_789' },
];

const WAREHOUSE_NODE_X = 100;
const STORE_NODE_X = 500;
const NODE_Y_SPACING = 150;

const transformWarehouseToNode = (warehouse, index) => ({
  id: `warehouse-${warehouse.id}`, // Ensure unique ID prefix for flow
  type: 'custom', // As per your Pool.js
  data: {
    label: warehouse.name,
    type: 'warehouse', // Type for CustomNode logic
    isDefault: !!warehouse.isDefault,
    cities: warehouse.details || '', // Or however you store city list
    // ... any other data your CustomNode needs from the warehouse object
  },
  position: { x: WAREHOUSE_NODE_X, y: 100 + index * NODE_Y_SPACING },
});

const transformStoreToNode = (store, index) => ({
  id: `store-${store.id}`, // Ensure unique ID prefix for flow
  type: 'custom', // As per your Pool.js
  data: {
    label: store.name,
    type: 'storefront', // Type for CustomNode logic
    platform: store.type, // e.g., 'shopify', 'woocommerce' - for CustomNode styling/info
    // ... any other data your CustomNode needs from the store object
  },
  position: { x: STORE_NODE_X, y: 50 + index * NODE_Y_SPACING },
});

const generateFlowEdges = (appWarehouses, appStores) => {
  const edges = [];
  const defaultWarehouses = appWarehouses.filter(wh => wh.isDefault);

  defaultWarehouses.forEach(warehouse => {
    appStores.forEach(store => {
      edges.push({
        id: `edge-${warehouse.id}-${store.id}`,
        source: `warehouse-${warehouse.id}`, // Match transformed node ID
        target: `store-${store.id}`,       // Match transformed node ID
        type: 'floating', // As per your Pool.js
        // animated: true, // Optional
      });
    });
  });
  return edges;
};

function Main() {
  // Warehouse State
  const [warehouses, setWarehouses] = useState(initialWarehouses);
  const [isWarehouseDialogOpen, setIsWarehouseDialogOpen] = useState(false);
  const [warehouseDialogMode, setWarehouseDialogMode] = useState('add');
  const [currentEditingWarehouse, setCurrentEditingWarehouse] = useState(null);

  // Store State
  const [stores, setStores] = useState(initialStores);
  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const [storeDialogMode, setStoreDialogMode] = useState('add');
  const [currentEditingStore, setCurrentEditingStore] = useState(null);


  // Warehouse Dialog Handlers
  const openAddWarehouseDialog = () => {
    setWarehouseDialogMode('add');
    setCurrentEditingWarehouse(null);
    setIsWarehouseDialogOpen(true);
  };

  const openEditWarehouseDialog = (warehouse) => {
    setWarehouseDialogMode('edit');
    setCurrentEditingWarehouse(warehouse);
    setIsWarehouseDialogOpen(true);
  };

  const handleWarehouseDialogSubmit = (formData) => {
    if (warehouseDialogMode === 'add') {
      const newWarehouse = { ...formData, id: `w${Date.now()}` };
      setWarehouses([...warehouses, newWarehouse]);
    } else if (warehouseDialogMode === 'edit' && formData.id) {
      setWarehouses(
        warehouses.map((wh) => (wh.id === formData.id ? { ...wh, ...formData } : wh))
      );
    }
  };

  // Store Dialog Handlers
  const openAddStoreDialog = () => {
    setStoreDialogMode('add');
    setCurrentEditingStore(null);
    setIsStoreDialogOpen(true);
  };

  const openEditStoreDialog = (store) => {
    setStoreDialogMode('edit');
    setCurrentEditingStore(store);
    setIsStoreDialogOpen(true);
  };

  const handleStoreDialogSubmit = (formData) => { // formData includes 'type' and all platform fields
    if (storeDialogMode === 'add') {
      // formData already has 'type' and platform specific fields from the specific form
      const newStore = { ...formData, id: `s${Date.now()}` };
      setStores([...stores, newStore]);
    } else if (storeDialogMode === 'edit' && formData.id) {
      setStores(
        stores.map((st) => (st.id === formData.id ? formData : st)) // Replace with new formData
      );
    }
    // StoreDialog will call onOpenChange(false) internally now
  };

  return (
    <div className="bg-gray-900 text-white p-4 font-sans rounded-2xl">
      <div className="w-full">
        <Tabs defaultValue="warehouse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700 p-1">
            <TabsTrigger
              value="warehouse"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
            >
              Warehouse
            </TabsTrigger>
            <TabsTrigger
              value="store"
              className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400"
            >
              Store
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="warehouse"
            className="mt-0 p-5 border border-t-0 border-gray-600 rounded-b-md bg-gray-700"
          >
            <WarehouseTabContent
              warehouses={warehouses}
              onAdd={openAddWarehouseDialog}
              onEdit={openEditWarehouseDialog}
            />
          </TabsContent>

          <TabsContent
            value="store"
            className="mt-0 p-5 border border-t-0 border-gray-600 rounded-b-md bg-gray-700"
          >
            <StoreTabContent
              stores={stores}
              onAdd={openAddStoreDialog}
              onEdit={openEditStoreDialog}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <WarehouseDialog
        open={isWarehouseDialogOpen}
        onOpenChange={setIsWarehouseDialogOpen}
        onSubmit={handleWarehouseDialogSubmit}
        mode={warehouseDialogMode}
        initialData={currentEditingWarehouse}
      />
      <StoreDialog
        open={isStoreDialogOpen}
        onOpenChange={setIsStoreDialogOpen}
        onSubmit={handleStoreDialogSubmit}
        mode={storeDialogMode}
        initialData={currentEditingStore}
      />
    </div>
  );
}

export default Main;