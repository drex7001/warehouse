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
import { Checkbox } from '@/components/ui/checkbox'; 

export function WarehouseDialog({ open, onOpenChange, onSubmit, mode, initialData, creationMode }) {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [id, setId] = useState(null);
  const [street_addr, setStreetAddr] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postal_code, setPostalCode] = useState('');
  const [region, setRegion] = useState('');
  const [telephone_1, setTelephone1] = useState('');
  const [telephone_2, setTelephone2] = useState('');
  const [suppliers_id, setSuppliersId] = useState('');
  const [sellable, setSellable] = useState(false); // Will be determined by context
  const [fulfilable_cities, setFulfilableCities] = useState('');
  const [pool_id, setPoolId] = useState(''); // Will be determined by context

  const isNonSellableCreation = creationMode === 'nonSellable';

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) { // EDIT MODE
        setName(initialData.name || '');
        setDetails(initialData.details || '');
        setId(initialData.id || null);
        setStreetAddr(initialData.street_addr || '');
        setCity(initialData.city || '');
        setProvince(initialData.province || '');
        setPostalCode(initialData.postal_code || '');
        setRegion(initialData.region || '');
        setTelephone1(initialData.telephone_1 || '');
        setTelephone2(initialData.telephone_2 || '');
        setSuppliersId(initialData.suppliers_id || '');
        setFulfilableCities(initialData.fulfilable_cities || '');
        
        if (isNonSellableCreation) { // Editing a non-sellable warehouse
          setSellable(false);
          setPoolId(''); 
        } else { // Editing a sellable warehouse
          setSellable(true); // Sellable warehouses are always sellable
          setPoolId(initialData.pool_id || ''); // Retain existing pool_id
        }
      } else { // ADD MODE
        // Reset all fields for add mode
        setName('');
        setDetails('');
        setId(null);
        setStreetAddr('');
        setCity('');
        setProvince('');
        setPostalCode('');
        setRegion('');
        setTelephone1('');
        setTelephone2('');
        setSuppliersId('');
        setFulfilableCities('');
        // Set sellable and pool_id based on creation context
        if (isNonSellableCreation) { // Adding a new non-sellable warehouse
          setSellable(false);
          setPoolId('');
        } else { // Adding a new sellable warehouse (e.g., from within a Pool's context)
          setSellable(true);
          // pool_id for new sellable warehouses should be passed via initialData by the caller if known
          setPoolId(initialData?.pool_id || ''); 
        }
      }
    }
  }, [open, mode, initialData, isNonSellableCreation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Warehouse name cannot be empty.');
      return;
    }
    const submittedData = {
      id: id,
      name: name.trim(),
      details: details.trim(),
      street_addr: street_addr.trim(),
      city: city.trim(),
      province: province.trim(),
      postal_code: postal_code.trim(),
      region: region.trim(),
      telephone_1: telephone_1.trim(),
      telephone_2: telephone_2.trim(),
      suppliers_id: suppliers_id.trim(),
      fulfilable_cities: fulfilable_cities.trim(),
      sellable: sellable, // Use the state variable, which is now correctly set
      pool_id: pool_id ? pool_id.trim() : null, // Use the state variable
    };
    onSubmit(submittedData);
    onOpenChange(false); 
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' 
              ? (isNonSellableCreation ? 'Edit Non-sellable Warehouse' : 'Edit Warehouse')
              : (isNonSellableCreation ? 'Create Non-sellable Warehouse' : 'Add New Warehouse')}
          </DialogTitle>
          {mode === 'add' && (
            <DialogDescription>
              Enter the details for the new warehouse.
            </DialogDescription>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="">
                Name <span className="text-red-500">*</span>
              </Label>
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

            {/* The Pool ID and Sellable checkbox are now removed from the UI */}
            {/* Their values are determined by the context (creationMode and initialData) */}
          </div>
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'edit' ? 'Save Changes' : (isNonSellableCreation ? 'Create Warehouse' : 'Add Warehouse')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default WarehouseDialog;