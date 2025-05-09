// src/components/forms/WooCommerceForm.js
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function WooCommerceForm({ initialData = {}, onSave, onCancel }) {
  const [storeName, setStoreName] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [siteUrl, setSiteUrl] = useState('');


  useEffect(() => {
    setStoreName(initialData.name || '');
    setConsumerKey(initialData.consumerKey || '');
    setConsumerSecret(initialData.consumerSecret || '');
    setSiteUrl(initialData.siteUrl || '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!storeName.trim() || !consumerKey.trim() || !consumerSecret.trim() || !siteUrl.trim()) {
      alert('All WooCommerce fields are required.');
      return;
    }
    onSave({
      name: storeName,
      consumerKey,
      consumerSecret,
      siteUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="wooStoreName" className="text-neutral-300">Store Name <span className="text-red-500">*</span></Label>
        <Input
          id="wooStoreName"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          className="mt-1 bg-neutral-700 border-neutral-600 text-white placeholder-neutral-500"
          placeholder="My WooCommerce Shop"
          required
        />
      </div>
      <div>
        <Label htmlFor="wooConsumerKey" className="text-neutral-300">Consumer Key <span className="text-red-500">*</span></Label>
        <Input
          id="wooConsumerKey"
          value={consumerKey}
          onChange={(e) => setConsumerKey(e.target.value)}
          className="mt-1 bg-neutral-700 border-neutral-600 text-white placeholder-neutral-500"
          required
        />
      </div>
      <div>
        <Label htmlFor="wooConsumerSecret" className="text-neutral-300">Consumer Secret <span className="text-red-500">*</span></Label>
        <Input
          id="wooConsumerSecret"
          value={consumerSecret}
          onChange={(e) => setConsumerSecret(e.target.value)}
          className="mt-1 bg-neutral-700 border-neutral-600 text-white placeholder-neutral-500"
          required
        />
      </div>
       <div>
        <Label htmlFor="wooSiteUrl" className="text-neutral-300">Site URL <span className="text-red-500">*</span></Label>
        <Input
          id="wooSiteUrl"
          type="url"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
          className="mt-1 bg-neutral-700 border-neutral-600 text-white placeholder-neutral-500"
          placeholder="https://my-site.com"
          required
        />
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}
          className="border-neutral-600 text-neutral-300 hover:bg-neutral-700 hover:text-white"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Save WooCommerce Store
        </Button>
      </div>
    </form>
  );
}

export default WooCommerceForm;