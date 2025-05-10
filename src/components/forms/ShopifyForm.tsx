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
import { Separator } from '@/components/ui/separator';
import { X as XIcon, Info, EyeIcon, EyeOffIcon } from 'lucide-react';

// Helper component for required label
const RequiredLabel = ({ htmlFor, children, className = "" }) => (
  <Label htmlFor={htmlFor} className={`text-foreground ${className}`}>
    {children} <span className="text-red-500">*</span>
  </Label>
);

export function ShopifyForm({ initialData = {}, onSave, onCancel }) {
  const [storeName, setStoreName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [adminApiAccessToken, setAdminApiAccessToken] = useState('');
  const [apiSecretKey, setApiSecretKey] = useState('');
  const [webhookSecret, setWebhookSecret] = useState('');
  const [locationId, setLocationId] = useState('');
  const [currency, setCurrency] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [usdExchangeRate, setUsdExchangeRate] = useState('');
  const [orderPrefix, setOrderPrefix] = useState('');
  const [manageStock, setManageStock] = useState(false);

  const [showAdminApiAccessToken, setShowAdminApiAccessToken] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecretKey, setShowApiSecretKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const companyCurrency = initialData.companyCurrency || 'USD';
  const isFirstStorefront = initialData.isFirstStorefront === true;


  useEffect(() => {
    setStoreName(initialData.name || '');
    setStoreUrl(initialData.storeUrl || '');
    setApiKey(initialData.credentials?.apiKey || initialData.apiKey || '');
    setAdminApiAccessToken(initialData.credentials?.adminApiAccessToken || '');
    setApiSecretKey(initialData.credentials?.apiSecretKey || '');
    setWebhookSecret(initialData.credentials?.webhookSecret || '');
    setLocationId(initialData.credentials?.locationId || '');
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
      apiKey,
      storeUrl,
      locationId,
      currency,
      exchangeRate,
      usdExchangeRate,
      orderPrefix,
    };

    for (const [key, value] of Object.entries(requiredFields)) {
      if (typeof value === 'string' && !value.trim()) {
        // Consider a more user-friendly notification system than alert
        alert(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} is required.`);
        return;
      }
    }
    
    onSave({
      name: storeName,
      storeUrl,
      credentials: {
        apiKey,
        adminApiAccessToken,
        apiSecretKey,
        webhookSecret,
        locationId,
      },
      currency,
      exchangeRate,
      usdExchangeRate,
      prefix: orderPrefix,
      manageStock,
    });
  };

  // Use Shadcn's default input styling by not overriding className excessively,
  // or use theme-aware utility classes if specific overrides are needed.
  // For simplicity, we'll rely more on default component styles.
  const commonInputProps = {
    className: "mt-1 placeholder:text-muted-foreground", // Basic common styling
  };

  const commonPasswordInputProps = {
    className: "mt-1 placeholder:text-muted-foreground pr-10", // Add padding for the icon
  };

  return (
    <TooltipProvider>
      <div>
        {/* <div className="flex items-center justify-between mb-4">
          <div>
            <img width={80} src="/images/shopify.png" alt="shopify_logo" />
          </div>
        </div> */}
        <Separator className="mb-6 mt-3 bg-border" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <RequiredLabel htmlFor="shopifyStoreName">Storefront title</RequiredLabel>
            <Input
              id="shopifyStoreName"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              {...commonInputProps}
              placeholder="My Shopify Store"
              required
            />
          </div>
          <div>
            <RequiredLabel htmlFor="shopifyStoreUrl">Store URL</RequiredLabel>
            <Input
              id="shopifyStoreUrl"
              type="url"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              {...commonInputProps}
              placeholder="https://store.myshopify.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="adminApiAccessToken" className="text-foreground">Admin API access token</Label>
              <div className="relative mt-1">
                <Input
                  id="adminApiAccessToken"
                  type={showAdminApiAccessToken ? "text" : "password"}
                  value={adminApiAccessToken}
                  onChange={(e) => setAdminApiAccessToken(e.target.value)}
                  {...commonPasswordInputProps}
                  placeholder="shpat_xxxxxxxxxxxx"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowAdminApiAccessToken(!showAdminApiAccessToken)}
                >
                  {showAdminApiAccessToken ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <RequiredLabel htmlFor="shopifyApiKey">API Key</RequiredLabel>
              <div className="relative mt-1">
                <Input
                  id="shopifyApiKey"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  {...commonPasswordInputProps}
                  placeholder="Your API Key"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="apiSecretKey" className="text-foreground">API secret key</Label>
              <div className="relative mt-1">
                <Input
                  id="apiSecretKey"
                  type={showApiSecretKey ? "text" : "password"}
                  value={apiSecretKey}
                  onChange={(e) => setApiSecretKey(e.target.value)}
                  {...commonPasswordInputProps}
                  placeholder="Your API Secret Key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowApiSecretKey(!showApiSecretKey)}
                >
                  {showApiSecretKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="webhookSecret" className="text-foreground">Webhook Secret</Label>
              <div className="relative mt-1">
                <Input
                  id="webhookSecret"
                  type={showWebhookSecret ? "text" : "password"}
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  {...commonPasswordInputProps}
                  placeholder="Your Webhook Secret"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                >
                  {showWebhookSecret ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <RequiredLabel htmlFor="locationId">Location ID</RequiredLabel>
            <Input
              id="locationId"
              type="number"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              {...commonInputProps}
              placeholder="Your Location ID"
              required
            />
          </div>

          <div>
            <RequiredLabel htmlFor="storefrontCurrency">Storefront Currency</RequiredLabel>
            <Select value={currency} onValueChange={setCurrency} required>
              <SelectTrigger id="storefrontCurrency" className="w-full mt-1">
                <SelectValue placeholder="Choose currency" />
              </SelectTrigger>
              {/* SelectContent and SelectItem will use theme styles by default */}
              <SelectContent>
                {["USD", "LKR", "PKR", "AED", "INR", "SAR", "GBP"].map(c => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <RequiredLabel htmlFor="exchangeRate">
                Exchange Rate ({currency || '..'} to {companyCurrency})
              </RequiredLabel>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    id="exchangeRate"
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
                <TooltipContent> {/* Relies on default Shadcn Tooltip styling */}
                  <p>This is used to convert the storefront's currency to the company's currency, such as for reporting and other purposes.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div>
              <RequiredLabel htmlFor="usdExchangeRate">USD exchange rate for shipping</RequiredLabel>
               <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    id="usdExchangeRate"
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
            <RequiredLabel htmlFor="orderPrefix">Order Prefix</RequiredLabel>
            <Input
              id="orderPrefix"
              value={orderPrefix}
              onChange={(e) => setOrderPrefix(e.target.value.toUpperCase().slice(0, 2))}
              {...commonInputProps}
              maxLength={2}
              placeholder="AA"
              disabled={!isFirstStorefront && !!initialData.id}
              required
            />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="manageStock"
                checked={manageStock}
                onCheckedChange={setManageStock}
                // Checkbox will use theme styles by default
              />
              <Label htmlFor="manageStock" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">
                Manage stock from TES
              </Label>
              <Tooltip>
                <TooltipTrigger type="button" className="ml-1 flex items-center">
                  <Info size={16} className="text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="w-80">
                  <p>If enabled, TES (this system) will manage your product stock levels for this Shopify storefront.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              Enable this if you want TES to synchronize stock quantities to Shopify.
            </p>
          </div>


          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit"> {/* Default variant is theme-aware */}
              {initialData.id ? 'Update Shopify Store' : 'Save Shopify Store'}
            </Button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
}

export default ShopifyForm;