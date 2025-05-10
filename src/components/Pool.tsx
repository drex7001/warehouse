import React, { useState, useEffect } from 'react';
// shadcn/ui components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// custom components
import { WarehouseDialog } from './warehouses/WarehouseDialog';
import { WarehouseTabContent } from './warehouses/WarehouseTabContent';
import { StoreDialog } from './storefronts/StoreDialog'; // Import StoreDialog
import { StoreTabContent } from './storefronts/StoreTabContent';
import PoolDiagram from './diagram/PoolDiagram';
import { Button } from '@/components/ui/button'; // Ensure Button component is imported

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'; // Ensure Dialog components are imported

// Dummy data
const initialWarehouses = [
  { id: 'w1', name: 'Warehouse A', details: 'Serves New York, Boston', isDefault: true },
  { id: 'w2', name: 'Warehouse B', details: 'Serves Chicago, Detroit', isDefault: false },
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
  id: `warehouse-${warehouse.id}`, // Ensure unique ID prefix for diagram
  type: 'custom', // As per Pool.js
  data: {
    label: warehouse.name,
    type: 'warehouse', // Type for CustomNode logic
    isDefault: !!warehouse.isDefault, // Ensure this is correctly derived
    cities: warehouse.details || '', // Or however you store city list
    // ... any other data CustomNode needs from the warehouse object
  },
  position: { x: WAREHOUSE_NODE_X, y: 100 + index * NODE_Y_SPACING },
});

const transformStoreToNode = (store, index) => ({
  id: `store-${store.id}`, // Ensure unique ID prefix for diagram
  type: 'custom', // As per Pool.js
  data: {
    label: store.name,
    type: 'storefront', // Type for CustomNode logic
    platform: store.type, // e.g., 'shopify', 'woocommerce' - for CustomNode styling/info
    // ... any other data CustomNode needs from the store object
  },
  position: { x: STORE_NODE_X, y: 50 + index * NODE_Y_SPACING },
});

const generatediagramEdges = (appWarehouses, appStores) => {
  const edges = [];
  // Ensure appWarehouses have the isDefault property correctly set
  const defaultWarehouses = appWarehouses.filter(wh => wh.isDefault);

  defaultWarehouses.forEach(warehouse => {
    appStores.forEach(store => {
      edges.push({
        id: `edge-${warehouse.id}-${store.id}`,
        source: `warehouse-${warehouse.id}`, // Match transformed node ID
        target: `store-${store.id}`,       // Match transformed node ID
        type: 'floating', // As per Pool.js
        // animated: true, // Optional
      });
    });
  });
  return edges;
};

function Pool() {
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

  // diagram State
  const [diagramNodes, setdiagramNodes] = useState([]);
  const [diagramEdges, setdiagramEdges] = useState([]);

  // Edit mode for PoolDiagram
  const [isPoolEditable, setIsPoolEditable] = useState(false);
  const [isConfirmSaveDialogOpen, setIsConfirmSaveDialogOpen] = useState(false);

  useEffect(() => {
    const transformedWarehouses = warehouses.map((wh, index) => transformWarehouseToNode(wh, index));
    const transformedStores = stores.map((st, index) => transformStoreToNode(st, index));
    setdiagramNodes([...transformedWarehouses, ...transformedStores]);
    setdiagramEdges(generatediagramEdges(warehouses, stores));
  }, [warehouses, stores]);


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
      // Assuming isDefault might come from formData or defaults to false
      // For now, new warehouses are not set as default unless formData includes `isDefault: true`
      const newWarehouse = { ...formData, id: `w${Date.now()}`, isDefault: formData.isDefault || false };
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

  // Pool Diagram Edit Handlers
  const handleModifyPoolClick = () => {
    setIsPoolEditable(true);
  };

  const handleSaveChangesPoolClick = () => {
    setIsConfirmSaveDialogOpen(true);
  };

  const handleConfirmSavePool = () => {
    // Placeholder for actual save logic (e.g., API call)
    console.log('Saving pool changes:', { diagramNodes, diagramEdges });
    setIsConfirmSaveDialogOpen(false);
    setIsPoolEditable(false); // Disable editing mode after saving
    // Potentially refetch or update data here
  };

  const handleCancelSavePool = () => {
    setIsConfirmSaveDialogOpen(false);
  };


  return (
    <div className="text-foreground font-sans rounded-2xl bg-background">
      <div className="flex gap-8 w-full item-start">
        <Tabs defaultValue="warehouse" className="w-1/2">
          <TabsList className="grid w-full grid-cols-2 p-1">
            {/* Removed hardcoded bg and border colors, relying on default TabsList styling */}
            <TabsTrigger
              value="warehouse"
              // Removed hardcoded active/inactive text and bg colors, relying on default TabsTrigger styling
            >
              Warehouse
            </TabsTrigger>
            <TabsTrigger
              value="store"
              // Removed hardcoded active/inactive text and bg colors, relying on default TabsTrigger styling
            >
              Store
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="warehouse"
            className="mt-0 p-5 border border-t-0 rounded-b-md bg-card" // Use bg-card and theme border
          >
            <WarehouseTabContent
              warehouses={warehouses}
              onAdd={openAddWarehouseDialog}
              onEdit={openEditWarehouseDialog}
            />
          </TabsContent>

          <TabsContent
            value="store"
            className="mt-0 p-5 border border-t-0 rounded-b-md bg-card" // Use bg-card and theme border
          >
            <StoreTabContent
              stores={stores}
              onAdd={openAddStoreDialog}
              onEdit={openEditStoreDialog}
            />
          </TabsContent>
        </Tabs>

        <div className="border rounded-md" style={{ height: '600px', width: '100%' }}> {/* Use theme border */}
          <PoolDiagram nodes={diagramNodes} edges={diagramEdges} isEditable={isPoolEditable} />
        </div>
      </div>

      <div className="flex justify-end mt-6 space-x-3">
        <Button
          onClick={handleModifyPoolClick}
          disabled={isPoolEditable}
          variant="outline"
          // Removed hardcoded border, text, and hover colors
        >
          Modify Connections
        </Button>
        <Button
          onClick={handleSaveChangesPoolClick}
          disabled={!isPoolEditable}
          // Using default Button variant styling (primary)
        >
          Save Changes
        </Button>
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

      {/* Confirmation Dialog for Saving Pool Changes */}
      <Dialog open={isConfirmSaveDialogOpen} onOpenChange={setIsConfirmSaveDialogOpen}>
        <DialogContent className="sm:max-w-md"> {/* Rely on default DialogContent styling */}
          <DialogHeader>
            <DialogTitle>Confirm Save Changes</DialogTitle> {/* Rely on default DialogTitle styling */}
            <DialogDescription className="pt-2"> {/* Rely on default DialogDescription styling */}
              Are you sure you want to save the changes made to the pool diagram?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelSavePool}
              // Removed hardcoded border, text, and hover colors
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSavePool}
              // Using default Button variant styling (primary) for confirm
            >
              Confirm Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
}

export default Pool;