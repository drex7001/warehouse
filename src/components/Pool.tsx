import React, { useState, useEffect } from 'react';
// shadcn/ui components
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// custom components
import { WarehouseDialog } from './warehouses/WarehouseDialog';
import { WarehouseTab } from './warehouses/WarehouseTab';
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

// Assuming WarehouseData and StoreData types are imported from a shared location or ../pages/PoolPage
// For example:
// import { WarehouseData, StoreData } from '../pages/PoolPage'; // Adjust path as needed

// If not importing, you might need minimal local type definitions for props:
interface WarehouseData {
  id: string;
  name: string;
  details?: string;
  isDefault?: boolean;
  pool_id?: string | null;
  sellable: boolean;
  // other fields used by transformWarehouseToNode & dialogs
}

interface StoreData {
  id: string;
  name: string;
  type: string;
  // other fields used by transformStoreToNode & dialogs
}

interface PoolProps {
  initialWarehousesData: WarehouseData[];
  initialStoresData: StoreData[];
  poolId: string; // Added poolId prop
}

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

function Pool({ initialWarehousesData, initialStoresData, poolId }: PoolProps) {
  // Warehouse State
  const [warehouses, setWarehouses] = useState<WarehouseData[]>(initialWarehousesData);
  // Store State
  const [stores, setStores] = useState<StoreData[]>(initialStoresData);

  // Effects to update state if props change (optional if key prop handles remounting)
  useEffect(() => {
    setWarehouses(initialWarehousesData);
  }, [initialWarehousesData]);

  useEffect(() => {
    setStores(initialStoresData);
  }, [initialStoresData]);
  
  // ...existing state for dialogs, diagram, edit mode ...
  const [isWarehouseDialogOpen, setIsWarehouseDialogOpen] = useState(false);
  const [warehouseDialogMode, setWarehouseDialogMode] = useState<'add' | 'edit'>('add');
  const [currentEditingWarehouse, setCurrentEditingWarehouse] = useState<WarehouseData | null>(null);

  const [isStoreDialogOpen, setIsStoreDialogOpen] = useState(false);
  const [storeDialogMode, setStoreDialogMode] = useState<'add' | 'edit'>('add');
  const [currentEditingStore, setCurrentEditingStore] = useState<StoreData | null>(null);

  const [diagramNodes, setdiagramNodes] = useState<any[]>([]);
  const [diagramEdges, setdiagramEdges] = useState<any[]>([]);
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

  const handleWarehouseDialogSubmit = (formData: Omit<WarehouseData, 'id'> & { id?: string }) => {
    if (warehouseDialogMode === 'add') {
      const newWarehouse: WarehouseData = {
        ...formData,
        id: `w${Date.now()}-${poolId}`, // Ensure unique ID
        isDefault: formData.isDefault || false,
        pool_id: poolId, // Assign current pool's ID
        // Ensure all required fields from WarehouseData are present
        sellable: formData.sellable !== undefined ? formData.sellable : true, // Default to true if not provided
      };
      setWarehouses(prev => [...prev, newWarehouse]);
    } else if (warehouseDialogMode === 'edit' && formData.id) {
      setWarehouses(
        prevWarehouses => prevWarehouses.map((wh) =>
          wh.id === formData.id ? { ...wh, ...formData, pool_id: poolId } : wh
        )
      );
    }
    // setIsWarehouseDialogOpen(false); // Dialog should handle its own closing
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

  const handleStoreDialogSubmit = (formData: Omit<StoreData, 'id'> & { id?: string }) => { // formData includes 'type' and all platform fields
    if (storeDialogMode === 'add') {
      const newStore: StoreData = {
        ...formData,
        id: `s${Date.now()}-${poolId}`, // Ensure unique ID
        // Ensure all required fields from StoreData are present
      };
      setStores(prevStores => [...prevStores, newStore]);
    } else if (storeDialogMode === 'edit' && formData.id) {
      setStores(
        prevStores => prevStores.map((st) => (st.id === formData.id ? { ...st, ...formData } : st))
      );
    }
    // setIsStoreDialogOpen(false); // Dialog should handle its own closing
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
            <WarehouseTab
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