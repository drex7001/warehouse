// src/components/forms/DarazForm.js
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function DarazForm({ initialData = {}, onSave, onCancel }) {
  const [storeName, setStoreName] = useState('');
  const [sellerId, setSellerId] = useState('');

  useEffect(() => {
    setStoreName(initialData.name || '');
    setSellerId(initialData.sellerId || ''); // Example field for Daraz
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!storeName.trim() || !sellerId.trim()) {
      alert('All Daraz fields are required.');
      return;
    }
    onSave({
      name: storeName,
      sellerId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="darazStoreName" className="text-gray-300">Store Name <span className="text-red-500">*</span></Label>
        <Input
          id="darazStoreName"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
          placeholder="My Daraz Store"
          required
        />
      </div>
      <div>
        <Label htmlFor="darazSellerId" className="text-gray-300">Seller ID <span className="text-red-500">*</span></Label>
        <Input
          id="darazSellerId"
          value={sellerId}
          onChange={(e) => setSellerId(e.target.value)}
          className="mt-1 bg-gray-700 border-gray-600 text-white placeholder-gray-500"
          placeholder="Your Daraz Seller ID"
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
          Save Daraz Store
        </Button>
      </div>
    </form>
  );
}

export default DarazForm;