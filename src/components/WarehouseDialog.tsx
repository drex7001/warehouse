// src/components/WarehouseDialog.js (or your preferred path)
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Adjust path if needed
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function WarehouseDialog({ open, onOpenChange, onSubmit, mode, initialData }) {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [id, setId] = useState(null);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setName(initialData.name || '');
        setDetails(initialData.details || '');
        setId(initialData.id || null);
      } else {
        setName('');
        setDetails('');
        setId(null);
      }
    }
  }, [open, mode, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      // You might want to use shadcn/ui's toast for notifications
      alert('Warehouse name cannot be empty.');
      return;
    }
    onSubmit({
      id: id,
      name: name.trim(),
      details: details.trim(),
    });
    onOpenChange(false); // Close dialog
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {mode === 'edit' ? 'Edit Warehouse' : 'Add New Warehouse'}
          </DialogTitle>
          {mode === 'add' && (
            <DialogDescription className="text-gray-400">
              Enter the details for the new warehouse.
            </DialogDescription>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-gray-300">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                placeholder="e.g., Main Warehouse"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="details" className="text-right text-gray-300">
                Details
              </Label>
              <Input
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="col-span-3 bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500"
                placeholder="(Optional)"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {mode === 'edit' ? 'Save Changes' : 'Add Warehouse'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default WarehouseDialog;