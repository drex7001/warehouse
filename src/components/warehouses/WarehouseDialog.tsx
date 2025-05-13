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
import { Checkbox } from '@/components/ui/checkbox'; // Import Checkbox

export function WarehouseDialog({ open, onOpenChange, onSubmit, mode, initialData }) {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [id, setId] = useState(null);
  // New state variables
  const [street_addr, setStreetAddr] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postal_code, setPostalCode] = useState('');
  const [region, setRegion] = useState('');
  const [telephone_1, setTelephone1] = useState('');
  const [telephone_2, setTelephone2] = useState('');
  const [suppliers_id, setSuppliersId] = useState('');
  const [sellable, setSellable] = useState(false);
  const [fulfilable_cities, setFulfilableCities] = useState('');
  const [pool_id, setPoolId] = useState('');

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setName(initialData.name || '');
        setDetails(initialData.details || '');
        setId(initialData.id || null);
        // Initialize new fields for edit mode
        setStreetAddr(initialData.street_addr || '');
        setCity(initialData.city || '');
        setProvince(initialData.province || '');
        setPostalCode(initialData.postal_code || '');
        setRegion(initialData.region || '');
        setTelephone1(initialData.telephone_1 || '');
        setTelephone2(initialData.telephone_2 || '');
        setSuppliersId(initialData.suppliers_id || '');
        setSellable(initialData.sellable || false);
        setFulfilableCities(initialData.fulfilable_cities || '');
        setPoolId(initialData.pool_id || '');
      } else {
        setName('');
        setDetails('');
        setId(null);
        // Reset new fields for add mode
        setStreetAddr('');
        setCity('');
        setProvince('');
        setPostalCode('');
        setRegion('');
        setTelephone1('');
        setTelephone2('');
        setSuppliersId('');
        setSellable(false);
        setFulfilableCities('');
        setPoolId('');
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
      // Include new fields in submission
      street_addr: street_addr.trim(),
      city: city.trim(),
      province: province.trim(),
      postal_code: postal_code.trim(),
      region: region.trim(),
      telephone_1: telephone_1.trim(),
      telephone_2: telephone_2.trim(),
      suppliers_id: suppliers_id.trim(),
      sellable: sellable,
      fulfilable_cities: fulfilable_cities.trim(),
      pool_id: pool_id.trim(),
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
              <Label htmlFor="name" className="">
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
              <Label htmlFor="details" className="">
                Details
              </Label>
              <Input
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="col-span-3 placeholder:text-muted-foreground"
                placeholder="(Optional) General details"
              />
            </div>
            {/* New Input Fields */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street_addr" className="">
                Street Address
              </Label>
              <Input
                id="street_addr"
                value={street_addr}
                onChange={(e) => setStreetAddr(e.target.value)}
                className="col-span-3 placeholder:text-muted-foreground"
                placeholder="e.g., 123 Main St"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="">
                City
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="col-span-3 placeholder:text-muted-foreground"
                placeholder="e.g., Anytown"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="province" className="">
                Province/State
              </Label>
              <Input
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="col-span-3 placeholder:text-muted-foreground"
                placeholder="e.g., CA"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="postal_code" className="">
                Postal Code
              </Label>
              <Input
                id="postal_code"
                value={postal_code}
                onChange={(e) => setPostalCode(e.target.value)}
                className="col-span-3 placeholder:text-muted-foreground"
                placeholder="e.g., 90210"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="region" className="">
                Region
              </Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="col-span-3 placeholder:text-muted-foreground"
                placeholder="e.g., West Coast"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telephone_1" className="">
                Telephone 1
              </Label>
              <Input
                id="telephone_1"
                value={telephone_1}
                onChange={(e) => setTelephone1(e.target.value)}
                className="col-span-3 placeholder:text-muted-foreground"
                placeholder="e.g., 555-1234"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telephone_2" className="">
                Telephone 2
              </Label>
              <Input
                id="telephone_2"
                value={telephone_2}
                onChange={(e) => setTelephone2(e.target.value)}
                className="col-span-3 placeholder:text-muted-foreground"
                placeholder="(Optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="suppliers_id" className="">
                Suppliers ID
              </Label>
              <Input
                id="suppliers_id"
                value={suppliers_id}
                onChange={(e) => setSuppliersId(e.target.value)}
                className="col-span-3 placeholder:text-muted-foreground"
                placeholder="e.g., SUP-001"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fulfilable_cities" className="">
                Fulfilable Cities
              </Label>
              <Input
                id="fulfilable_cities"
                value={fulfilable_cities}
                onChange={(e) => setFulfilableCities(e.target.value)}
                className="col-span-3 placeholder:text-muted-foreground"
                placeholder="e.g., New York, Boston (comma-separated)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pool_id" className="">
                Pool ID
              </Label>
              <Input
                id="pool_id"
                value={pool_id}
                onChange={(e) => setPoolId(e.target.value)}
                className="col-span-3 placeholder:text-muted-foreground"
                placeholder="e.g., P001"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sellable" className="">
                Sellable
              </Label>
              <div className="col-span-3 flex items-center">
                <Checkbox
                  id="sellable"
                  checked={sellable}
                  onCheckedChange={setSellable}
                />
                 <label htmlFor="sellable" className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Is this warehouse sellable?
                </label>
              </div>
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