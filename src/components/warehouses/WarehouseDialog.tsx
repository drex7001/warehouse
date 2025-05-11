import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
      {/* DialogContent will use default Shadcn styling (bg-background/bg-card, p-6, border, shadow) */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {/* DialogTitle will use default theme styling */}
          <DialogTitle>
            {mode === 'edit' ? 'Edit Warehouse' : 'Add New Warehouse'}
          </DialogTitle>
          {mode === 'add' && (
            // DialogDescription will use default theme styling (text-muted-foreground)
            <DialogDescription>
              Enter the details for the new warehouse.
            </DialogDescription>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              {/* Label will use default theme styling (text-foreground) */}
              <Label htmlFor="name" className="text-right">
                Name <span className="text-red-500">*</span>
              </Label>
              {/* Input will use default theme styling */}
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3 placeholder:text-muted-foreground"
                placeholder="e.g., Main Warehouse"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="details" className="text-right">
                Details
              </Label>
              <Input
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="col-span-3 placeholder:text-muted-foreground"
                placeholder="(Optional)"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            {/* Button variant="outline" is theme-aware */}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {/* Default Button variant is theme-aware (primary) */}
            <Button type="submit">
              {mode === 'edit' ? 'Save Changes' : 'Add Warehouse'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default WarehouseDialog;