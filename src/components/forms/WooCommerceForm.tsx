import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, EyeIcon, EyeOffIcon } from 'lucide-react';

// Helper component for required label (similar to ShopifyForm)
const RequiredLabel = ({ htmlFor, children, className = "" }) => (
  <Label htmlFor={htmlFor} className={`text-foreground ${className}`}>
    {children} <span className="text-red-500">*</span>
  </Label>
);

export function WooCommerceForm({ initialData = {}, onSave, onCancel }) {
  const [storeName, setStoreName] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [currency, setCurrency] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [usdExchangeRate, setUsdExchangeRate] = useState('');
  const [orderPrefix, setOrderPrefix] = useState('');
  const [manageStock, setManageStock] = useState(false);

  const [showConsumerKey, setShowConsumerKey] = useState(false);
  const [showConsumerSecret, setShowConsumerSecret] = useState(false);

  const companyCurrency = initialData.companyCurrency || 'USD'; // Assuming companyCurrency is provided
  const isFirstStorefront = initialData.isFirstStorefront === true; // Assuming isFirstStorefront is provided


  useEffect(() => {
    setStoreName(initialData.name || '');
    setConsumerKey(initialData.credentials?.consumerKey || initialData.consumerKey || '');
    setConsumerSecret(initialData.credentials?.consumerSecret || initialData.consumerSecret || '');
    setSiteUrl(initialData.siteUrl || '');
    setCurrency(initialData.currency || '');
    setExchangeRate(initialData.exchangeRate || '');
    setUsdExchangeRate(initialData.usdExchangeRate || '');
    setOrderPrefix(initialData.prefix || '');
    setManageStock(initialData.manageStock || false);
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = {
      storeName,
      consumerKey,
      consumerSecret,
      siteUrl,
      currency,
      exchangeRate,
      usdExchangeRate,
      orderPrefix,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (typeof value === 'string' && !value.trim()) {
        alert(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} is required.`);
        return;
      }
    }

    onSave({
      name: storeName,
      credentials: {
        consumerKey,
        consumerSecret,
      },
      siteUrl,
      currency,
      exchangeRate,
      usdExchangeRate,
      prefix: orderPrefix,
      manageStock,
    });
  };

  const commonInputProps = {
    className: "mt-1 placeholder:text-muted-foreground",
  };

  const commonPasswordInputProps = {
    className: "mt-1 placeholder:text-muted-foreground pr-10",
  };

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <RequiredLabel htmlFor="wooStoreName">Storefront name</RequiredLabel>
          <Input
            id="wooStoreName"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            {...commonInputProps}
            placeholder="My WooCommerce Shop"
            required
          />
        </div>
        <div>
          <RequiredLabel htmlFor="wooSiteUrl">Site URL</RequiredLabel>
          <Input
            id="wooSiteUrl"
            type="url"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
            {...commonInputProps}
            placeholder="https://my-site.com"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <RequiredLabel htmlFor="wooConsumerKey">Consumer Key</RequiredLabel>
            <div className="relative mt-1">
              <Input
                id="wooConsumerKey"
                type={showConsumerKey ? "text" : "password"}
                value={consumerKey}
                onChange={(e) => setConsumerKey(e.target.value)}
                {...commonPasswordInputProps}
                placeholder="ck_xxxxxxxxxxxx"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConsumerKey(!showConsumerKey)}
              >
                {showConsumerKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <RequiredLabel htmlFor="wooConsumerSecret">Consumer Secret</RequiredLabel>
            <div className="relative mt-1">
              <Input
                id="wooConsumerSecret"
                type={showConsumerSecret ? "text" : "password"}
                value={consumerSecret}
                onChange={(e) => setConsumerSecret(e.target.value)}
                {...commonPasswordInputProps}
                placeholder="cs_xxxxxxxxxxxx"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConsumerSecret(!showConsumerSecret)}
              >
                {showConsumerSecret ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <RequiredLabel htmlFor="wooStorefrontCurrency">Storefront Currency</RequiredLabel>
          <Select value={currency} onValueChange={setCurrency} required>
            <SelectTrigger id="wooStorefrontCurrency" className="w-full mt-1">
              <SelectValue placeholder="Choose currency" />
            </SelectTrigger>
            <SelectContent>
              {["USD", "LKR", "PKR", "AED", "INR", "SAR", "GBP"].map(c => ( // Added more common currencies
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <RequiredLabel htmlFor="wooExchangeRate">
              Exchange Rate ({currency || '..'} to {companyCurrency})
            </RequiredLabel>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  id="wooExchangeRate"
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  {...commonInputProps}
                  placeholder="e.g., 1.00"
                  step="0.01"
                  min="0"
                  required
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>This is used to convert the storefront's currency to the company's currency.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div>
            <RequiredLabel htmlFor="wooUsdExchangeRate">USD exchange rate for shipping</RequiredLabel>
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  id="wooUsdExchangeRate"
                  type="number"
                  value={usdExchangeRate}
                  onChange={(e) => setUsdExchangeRate(e.target.value)}
                  {...commonInputProps}
                  placeholder="e.g., 1.00"
                  step="0.01"
                  min="0"
                  required
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>USD exchange rate for shipping purposes.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        <div>
          <RequiredLabel htmlFor="wooOrderPrefix">Order Prefix</RequiredLabel>
          <Input
            id="wooOrderPrefix"
            value={orderPrefix}
            onChange={(e) => setOrderPrefix(e.target.value.toUpperCase().slice(0, 2))}
            {...commonInputProps}
            maxLength={2}
            placeholder="WC"
            disabled={!isFirstStorefront && !!initialData.id}
            required
          />
           <p className="mt-1 text-sm text-muted-foreground">
            Two characters. This will be prefixed to all order numbers from this website.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wooManageStock"
              checked={manageStock}
              onCheckedChange={setManageStock}
            />
            <Label htmlFor="wooManageStock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
              Manage stock from TES
            </Label>
            <Tooltip>
              <TooltipTrigger type="button" className="ml-1 flex items-center">
                <Info size={16} className="text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <p>If enabled, TES (this system) will manage your product stock levels for this WooCommerce storefront.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-muted-foreground ml-6">
            Enable this if you want TES to synchronize stock quantities to WooCommerce.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white"> {/* WooCommerce brand color */}
            {initialData.id ? 'Update WooCommerce Store' : 'Save WooCommerce Store'}
          </Button>
        </div>
      </form>
    </TooltipProvider>
  );
}

export default WooCommerceForm;