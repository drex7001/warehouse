import React, { useState, useEffect } from 'react';
import Pool from "../components/Pool";
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PoolExplanationDialog from '../components/PoolExplanationDialog'; // Adjust path if necessary
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WarehouseDialog } from '@/components/warehouses/WarehouseDialog';
import NonSellableWarehouse from '../components/warehouses/NonSellableWarehouse'; // Corrected import path

// Interface for Pool data
interface PoolData {
  id: string;
  name: string;
  description: string;
  warehouses: WarehouseData[]; // <-- Modified line
  stores: StoreData[];       // <-- Add this line
}

// Interface for Warehouse data (can be expanded)
interface WarehouseData {
  id: string;
  name: string;
  details?: string;
  street_addr?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  region?: string;
  telephone_1?: string;
  telephone_2?: string;
  suppliers_id?: string;
  sellable: boolean;
  fulfilable_cities?: string;
  pool_id?: string | null;
  isDefault?: boolean; // <-- Add this line
}

// Interface for Store data (can be expanded)
interface StoreData {
  id: string;
  name: string;
  type: string; // e.g., 'shopify', 'woocommerce', 'daraz'
  apiKey?: string;
  storeUrl?: string;
  consumerKey?: string;
  consumerSecret?: string;
  siteUrl?: string;
  sellerId?: string;
  // Add other common or specific fields as necessary
}

// Initial data for the default pool (previously in Pool.tsx)
const pageInitialWarehouses: WarehouseData[] = [
  { id: 'w1', name: 'Warehouse A', details: 'Serves New York, Boston', sellable: true, pool_id: 'pool-initial-1', isDefault: true },
  { id: 'w2', name: 'Warehouse B', details: 'Serves Chicago, Detroit', sellable: true, pool_id: 'pool-initial-1', isDefault: false },
];

const pageInitialStores: StoreData[] = [
  { id: 's1', name: 'My Shopify Store', type: 'shopify', apiKey: 'shpat_123', storeUrl: 'https://s1.myshopify.com' },
  { id: 's2', name: 'My WooCommerce Site', type: 'woocommerce', consumerKey: 'ck_abc', consumerSecret: 'cs_def', siteUrl: 'https://mywoosite.com' },
  { id: 's3', name: 'My Daraz Shop', type: 'daraz', sellerId: 'daraz_seller_789' },
];

const PoolPage = () => {
  const [pools, setPools] = useState<PoolData[]>([
    {
      id: 'pool-initial-1',
      name: 'Default Operations Pool',
      description: 'Main operational pool for warehouses and stores.',
      warehouses: pageInitialWarehouses, // Use the defined initial data
      stores: pageInitialStores,         // Use the defined initial data
    }
  ]);
  const [isAddPoolModalOpen, setIsAddPoolModalOpen] = useState(false);
  const [newPoolName, setNewPoolName] = useState('');
  const [newPoolDescription, setNewPoolDescription] = useState('');

  const [isEditPoolModalOpen, setIsEditPoolModalOpen] = useState(false);
  const [editingPool, setEditingPool] = useState<PoolData | null>(null);
  const [editPoolName, setEditPoolName] = useState('');
  const [editPoolDescription, setEditPoolDescription] = useState('');

  const [scrollToPoolId, setScrollToPoolId] = useState<string | null>(null);

  // State for Non-sellable Warehouses
  const [nonSellableWarehouses, setNonSellableWarehouses] = useState<WarehouseData[]>([]);
  const [isCreateNonSellableWarehouseModalOpen, setIsCreateNonSellableWarehouseModalOpen] = useState(false);
  const [editingNonSellableWarehouse, setEditingNonSellableWarehouse] = useState<WarehouseData | null>(null);
  const [nonSellableWarehouseDialogMode, setNonSellableWarehouseDialogMode] = useState<'add' | 'edit'>('add');
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false); // New state for delete confirmation
  const [deletingWarehouseId, setDeletingWarehouseId] = useState<string | null>(null); // New state for warehouse ID to delete

  useEffect(() => {
    if (scrollToPoolId) {
      requestAnimationFrame(() => {
        const element = document.getElementById(`pool-item-${scrollToPoolId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setScrollToPoolId(null); 
        } else {
          setScrollToPoolId(null);
        }
      });
    }
  }, [scrollToPoolId]); 

  const handleAddNewPool = () => {
    if (!newPoolName.trim()) {
      alert('Pool name cannot be empty.');
      return;
    }
    const newPoolId = `pool-${Date.now()}`;
    const trimmedPoolName = newPoolName.trim();

    const defaultWarehouse: WarehouseData = {
      id: `wh-${Date.now()}-${newPoolId}`, // Ensure unique warehouse ID
      name: `${trimmedPoolName} default`,
      details: `Default warehouse for ${trimmedPoolName}`,
      street_addr: '',
      city: '',
      province: '',
      postal_code: '',
      region: '',
      telephone_1: '',
      telephone_2: '',
      suppliers_id: '',
      sellable: true,
      fulfilable_cities: '',
      pool_id: newPoolId,
      isDefault: true,
    };

    const newPool: PoolData = {
      id: newPoolId,
      name: trimmedPoolName,
      description: newPoolDescription.trim(),
      warehouses: [defaultWarehouse], // Initialize with the default warehouse
      stores: [],                    // No stores initially
    };
    setPools(prevPools => [...prevPools, newPool]);
    setNewPoolName('');
    setNewPoolDescription('');
    setIsAddPoolModalOpen(false);
    setScrollToPoolId(newPoolId); 
  };

  const handleDeletePool = (poolId: string) => {
    if (window.confirm('Are you sure you want to delete this pool?')) {
      setPools(prevPools => prevPools.filter(pool => pool.id !== poolId));
    }
  };

  const handleOpenEditModal = (pool: PoolData) => {
    setEditingPool(pool);
    setEditPoolName(pool.name);
    setEditPoolDescription(pool.description);
    setIsEditPoolModalOpen(true);
  };

  const handleSaveChanges = () => {
    if (!editingPool || !editPoolName.trim()) {
      alert('Pool name cannot be empty.');
      return;
    }
    setPools(prevPools =>
      prevPools.map(pool =>
        pool.id === editingPool.id
          ? { ...pool, name: editPoolName.trim(), description: editPoolDescription.trim() }
          : pool
      )
    );
    setIsEditPoolModalOpen(false);
    setEditingPool(null);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleOpenCreateNonSellableWarehouseModal = () => {
    setNonSellableWarehouseDialogMode('add');
    setEditingNonSellableWarehouse(null);
    setIsCreateNonSellableWarehouseModalOpen(true);
  };

  const handleEditNonSellableWarehouse = (warehouse: WarehouseData) => {
    setNonSellableWarehouseDialogMode('edit');
    setEditingNonSellableWarehouse(warehouse);
    setIsCreateNonSellableWarehouseModalOpen(true);
  };

  const handleDeleteNonSellableWarehouse = (warehouseId: string) => {
    setDeletingWarehouseId(warehouseId);
    setIsDeleteConfirmModalOpen(true);
  };

  const confirmDeleteNonSellableWarehouse = () => {
    if (deletingWarehouseId) {
      setNonSellableWarehouses(prev => prev.filter(wh => wh.id !== deletingWarehouseId));
    }
    setIsDeleteConfirmModalOpen(false);
    setDeletingWarehouseId(null);
  };

  const handleNonSellableWarehouseSubmit = (formData: WarehouseData) => {
    if (nonSellableWarehouseDialogMode === 'add') {
      const newWarehouse: WarehouseData = {
        ...formData, // formData from dialog already has sellable=false and pool_id=''
        id: `nswh-${Date.now()}`, // Generate new ID
      };
      setNonSellableWarehouses(prev => [...prev, newWarehouse]);
    } else if (nonSellableWarehouseDialogMode === 'edit' && editingNonSellableWarehouse) {
      const updatedWarehouse: WarehouseData = {
        ...formData,
        id: editingNonSellableWarehouse.id, // Ensure original ID is kept
      };
      setNonSellableWarehouses(prev => 
        prev.map(wh => wh.id === updatedWarehouse.id ? updatedWarehouse : wh)
      );
    }
    setIsCreateNonSellableWarehouseModalOpen(false);
    setEditingNonSellableWarehouse(null);
  };

  // TODO: Implement edit/delete for non-sellable warehouses if needed
  // const handleEditNonSellableWarehouse = (warehouse: WarehouseData) => {
  //   setNonSellableWarehouseDialogMode('edit');
  //   setEditingNonSellableWarehouse(warehouse);
  //   setIsCreateNonSellableWarehouseModalOpen(true);
  // };
  // const handleDeleteNonSellableWarehouse = (warehouseId: string) => { ... };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className='flex items-center'>
        <h1 className="text-2xl font-bold dark:text-neutral-100">Pools & Warehouses</h1>
            <span
              onClick={openDialog}
              className="ml-2 cursor-pointer text-neutral-600 dark:text-neutral-300 font-bold inline-block border border-neutral-600 dark:border-neutral-300 rounded-full w-5 h-5 text-center leading-[18px] hover:bg-neutral-100 dark:hover:bg-neutral-700"
              title="What is a Pool?"
            >
              ?
            </span>
        </div>
       
        <div className="flex space-x-2">
          <Button
            onClick={handleOpenCreateNonSellableWarehouseModal}
            variant="outline"
          >
            Create Non-sellable Warehouse +
          </Button>
          <Dialog open={isAddPoolModalOpen} onOpenChange={setIsAddPoolModalOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsAddPoolModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Add New Pool +
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[475px]  border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white">
              <DialogHeader>
                <DialogTitle className="text-neutral-900 dark:text-white">Create a New Pool</DialogTitle>
                <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                  Enter a name and an optional description for your new pool.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="poolName" className="text-right text-neutral-700 dark:text-neutral-300">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="poolName"
                    value={newPoolName}
                    onChange={(e) => setNewPoolName(e.target.value)}
                    className="col-span-3"
                    placeholder="e.g., Staging Environment"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="poolDescription" className="text-right text-neutral-700 dark:text-neutral-300">
                    Description
                  </Label>
                  <Input
                    id="poolDescription"
                    value={newPoolDescription}
                    onChange={(e) => setNewPoolDescription(e.target.value)}
                    className="col-span-3"
                    placeholder="(Optional) e.g., For testing new integrations"
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setIsAddPoolModalOpen(false)}
                  className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white"
                >
                  Cancel
                </Button>
                <Button type="button" onClick={handleAddNewPool}
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Create Pool
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Pool Modal */}
      {editingPool && (
        <Dialog open={isEditPoolModalOpen} onOpenChange={setIsEditPoolModalOpen}>
          <DialogContent className="sm:max-w-[475px] bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white">
            <DialogHeader>
              <DialogTitle className="text-neutral-900 dark:text-white">Edit Pool</DialogTitle>
              <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                Update the name and description for your pool.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPoolName" className="text-right text-neutral-700 dark:text-neutral-300">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="editPoolName"
                  value={editPoolName}
                  onChange={(e) => setEditPoolName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPoolDescription" className="text-right text-neutral-700 dark:text-neutral-300">
                  Description
                </Label>
                <Input
                  id="editPoolDescription"
                  value={editPoolDescription}
                  onChange={(e) => setEditPoolDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-end">
              <Button type="button" variant="outline" onClick={() => { setIsEditPoolModalOpen(false); setEditingPool(null); }}
                className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white"
              >
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveChanges}
                className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Tabs defaultValue="poolsOverview" className="w-full mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="poolsOverview">Pools Overview</TabsTrigger>
          <TabsTrigger value="nonSellableWarehouses">Non-sellable Warehouses</TabsTrigger>
        </TabsList>

        <TabsContent value="poolsOverview">
          {pools.map((poolItem) => (
            <div key={poolItem.id} id={`pool-item-${poolItem.id}`} className="mb-8 p-8 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold dark:text-neutral-100 mb-1">{poolItem.name}</h2>
                  {poolItem.description && (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">{poolItem.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditModal(poolItem)}
                    className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePool(poolItem.id)}
                    className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
              <div className="mt-4 bg-neutral-100 dark:bg-neutral-900 rounded-md">
                <main>
                  <div className="mx-auto rounded ">
                    <div className="flex px-4 sm:px-0 gap-4">
                      <div className="w-full">
                        <Pool
                          key={poolItem.id} // Add key for proper component lifecycle
                          initialWarehousesData={poolItem.warehouses}
                          initialStoresData={poolItem.stores}
                          poolId={poolItem.id} // Pass poolId to the Pool component
                        />
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          ))}
          {pools.length === 0 && (
            <p className="text-center text-neutral-500 dark:text-neutral-400 py-8">
              No pools created yet. Click "Add New Pool" to get started.
            </p>
          )}
        </TabsContent>

        <TabsContent value="nonSellableWarehouses">
          <NonSellableWarehouse 
            warehouses={nonSellableWarehouses}
            onEdit={handleEditNonSellableWarehouse}
            onDelete={handleDeleteNonSellableWarehouse}
          />
        </TabsContent>
      </Tabs>
      
      <PoolExplanationDialog isOpen={isDialogOpen} onClose={closeDialog} />

      {/* Dialog for Creating/Editing Non-sellable Warehouse */}
      <WarehouseDialog
        open={isCreateNonSellableWarehouseModalOpen}
        onOpenChange={setIsCreateNonSellableWarehouseModalOpen}
        onSubmit={handleNonSellableWarehouseSubmit}
        mode={nonSellableWarehouseDialogMode}
        initialData={editingNonSellableWarehouse}
        creationMode="nonSellable" 
      />

      {/* Confirmation Dialog for Deleting Non-sellable Warehouse */}
      <Dialog open={isDeleteConfirmModalOpen} onOpenChange={setIsDeleteConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete this non-sellable warehouse? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDeleteNonSellableWarehouse}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PoolPage;