// src/components/forms/ShopifyForm.js
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function ShopifyForm({ initialData = {}, onSave, onCancel }) {
  const [storeName, setStoreName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [storeUrl, setStoreUrl] = useState('');

  useEffect(() => {
    setStoreName(initialData.name || '');
    setApiKey(initialData.apiKey || ''); // Assuming 'apiKey' is a field for Shopify
    setStoreUrl(initialData.storeUrl || ''); // Assuming 'storeUrl' is a field for Shopify
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!storeName.trim() || !apiKey.trim() || !storeUrl.trim()) {
      alert('All Shopify fields are required.');
      return;
    }
    onSave({
      name: storeName,
      apiKey,
      storeUrl,
      // any other Shopify-specific fields
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="shopifyStoreName" className="text-gray-300">Store Name <span className="text-red-500">*</span></Label>
        <Input
          id="shopifyStoreName"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
          placeholder="My Shopify Store"
          required
        />
      </div>
      <div>
        <Label htmlFor="shopifyApiKey" className="text-gray-300">API Key <span className="text-red-500">*</span></Label>
        <Input
          id="shopifyApiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
          placeholder="shpat_xxxxxxxxxxxx"
          required
        />
      </div>
      <div>
        <Label htmlFor="shopifyStoreUrl" className="text-gray-300">Store URL <span className="text-red-500">*</span></Label>
        <Input
          id="shopifyStoreUrl"
          type="url"
          value={storeUrl}
          onChange={(e) => setStoreUrl(e.target.value)}
          className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
          placeholder="https://my-store.myshopify.com"
          required
        />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}
          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Save Shopify Store
        </Button>
      </div>
    </form>
  );
}

export default ShopifyForm;