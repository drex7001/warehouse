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

// Interface for Pool data
interface PoolData {
  id: string;
  name: string;
  description: string;
}

const PoolPage = () => {
  const [pools, setPools] = useState<PoolData[]>([
    { id: 'pool-initial-1', name: 'Default Operations Pool', description: 'Main operational pool for warehouses and stores.' }
  ]);
  const [isAddPoolModalOpen, setIsAddPoolModalOpen] = useState(false);
  const [newPoolName, setNewPoolName] = useState('');
  const [newPoolDescription, setNewPoolDescription] = useState('');

  // State for editing a pool
  const [isEditPoolModalOpen, setIsEditPoolModalOpen] = useState(false);
  const [editingPool, setEditingPool] = useState<PoolData | null>(null);
  const [editPoolName, setEditPoolName] = useState('');
  const [editPoolDescription, setEditPoolDescription] = useState('');

  // State to trigger scroll to a newly added pool
  const [scrollToPoolId, setScrollToPoolId] = useState<string | null>(null);

  useEffect(() => {
    if (scrollToPoolId) {
      requestAnimationFrame(() => {
        const element = document.getElementById(`pool-item-${scrollToPoolId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setScrollToPoolId(null); // Reset after scrolling is initiated
        } else {
          // Element not found, reset to avoid issues if pools update again without the element
          setScrollToPoolId(null);
        }
      });
    }
  }, [scrollToPoolId]); // Depend only on scrollToPoolId

  const handleAddNewPool = () => {
    if (!newPoolName.trim()) {
      alert('Pool name cannot be empty.');
      return;
    }
    const newPoolId = `pool-${Date.now()}`;
    const newPool: PoolData = {
      id: newPoolId,
      name: newPoolName.trim(),
      description: newPoolDescription.trim(),
    };
    setPools(prevPools => [...prevPools, newPool]);
    setNewPoolName('');
    setNewPoolDescription('');
    setIsAddPoolModalOpen(false);
    setScrollToPoolId(newPoolId); // Set ID to scroll to
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-neutral-100">Pools Overview</h1>
        <Dialog open={isAddPoolModalOpen} onOpenChange={setIsAddPoolModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsAddPoolModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Add New Pool +
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[475px] bg-neutral-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white">
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
                  className="col-span-3 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
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
                  className="col-span-3 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
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
                  className="col-span-3 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
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
                  className="col-span-3 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
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
                    <Pool />
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
    </div>
  );
};

export default PoolPage;