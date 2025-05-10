import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

export function DarazForm({ initialData = {}, onSave, onCancel }) {
  const [storeName, setStoreName] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [usdExchangeRate, setUsdExchangeRate] = useState('');
  const [manageStock, setManageStock] = useState(false);

  useEffect(() => {
    setStoreName(initialData.name || '');
    setSellerId(initialData.sellerId || ''); // Example field for Daraz
    setExchangeRate(initialData.exchangeRate || '');
    setUsdExchangeRate(initialData.usdExchangeRate || '');
    setManageStock(initialData.manageStock || false);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!storeName.trim() || !sellerId.trim() || !exchangeRate.trim() || !usdExchangeRate.trim()) {
      alert('All Daraz fields are required.');
      return;
    }
    onSave({
      name: storeName,
      sellerId,
      exchangeRate,
      usdExchangeRate,
      manageStock,
    });
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="darazStoreName" className="text-foreground">Store Name <span className="text-red-500">*</span></Label>
          <Input
            id="darazStoreName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="mt-1 placeholder:text-muted-foreground"
            placeholder="My Daraz Store"
            required
          />
        </div>
        <div>
          <Label htmlFor="darazSellerId" className="text-foreground">Seller ID <span className="text-red-500">*</span></Label>
          <Input
            id="darazSellerId"
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            className="mt-1 placeholder:text-muted-foreground"
            placeholder="Your Daraz Seller ID"
            required
          />
        </div>
        <div>
          <Label htmlFor="exchangeRate" className="text-foreground">Exchange Rate (USD to Local Currency) <span className="text-red-500">*</span></Label>
          <Input
            id="exchangeRate"
            type="number"
            step="0.01"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
            className="mt-1 placeholder:text-muted-foreground"
            placeholder="Exchange Rate"
            required
          />
        </div>
        <div>
          <Label htmlFor="usdExchangeRate" className="text-foreground">USD Exchange Rate for Shipping <span className="text-red-500">*</span></Label>
          <Input
            id="usdExchangeRate"
            type="number"
            step="0.01"
            value={usdExchangeRate}
            onChange={(e) => setUsdExchangeRate(e.target.value)}
            className="mt-1 placeholder:text-muted-foreground"
            placeholder="USD Exchange Rate"
            required
          />
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="manageStockDaraz"
              checked={manageStock}
              onCheckedChange={setManageStock}
            />
            <Label htmlFor="manageStockDaraz" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
              Manage stock from TES
            </Label>
            <Tooltip>
              <TooltipTrigger type="button" className="ml-1 flex items-center">
                <Info size={16} className="text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <p>If enabled, TES (this system) will manage your product stock levels for this Daraz storefront.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground ml-6">
            Enable this if you want TES to synchronize stock quantities to Daraz.
          </p>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Daraz Store
          </Button>
        </div>
      </form>
    </TooltipProvider>
  );
}

export default DarazForm;