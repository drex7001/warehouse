// src/components/StoreDialog.js
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Import your new forms
import { ShopifyForm } from '../forms/ShopifyForm';
import { WooCommerceForm } from '../forms/WooCommerceForm';
import { DarazForm } from '../forms/DarazForm';

const STORE_TYPES = {
  SHOPIFY: 'shopify',
  WOOCOMMERCE: 'woocommerce',
  DARAZ: 'daraz',
};

export function StoreDialog({ open, onOpenChange, onSubmit, mode, initialData }) {
  const [currentStep, setCurrentStep] = useState('selection'); // 'selection' or 'form'
  const [selectedType, setSelectedType] = useState(null); // e.g., STORE_TYPES.SHOPIFY

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData && initialData.type) {
        setSelectedType(initialData.type);
        setCurrentStep('form');
      } else {
        // Reset for 'add' mode or if dialog is re-opened
        setCurrentStep('selection');
        setSelectedType(null);
      }
    }
  }, [open, mode, initialData]);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setCurrentStep('form');
  };

  const handleFormSave = (formDataFromSpecificForm) => {
    onSubmit({
      ...initialData, // Preserve ID if editing
      ...formDataFromSpecificForm, // Contains name and platform-specific fields
      type: selectedType, // Add the type
    });
    onOpenChange(false); // Close dialog after successful submission
  };

  const handleCancelForm = () => {
    if (mode === 'add') {
      setCurrentStep('selection'); // Go back to type selection for 'add' mode
      setSelectedType(null);
    } else {
      onOpenChange(false); // Close dialog directly for 'edit' mode
    }
  };

  const renderPlatformSelection = () => (
    <div className="py-4">
      <DialogDescription className="text-center mb-6 text-gray-400">
        Select the type of store you want to add.
      </DialogDescription>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { type: STORE_TYPES.SHOPIFY, label: 'Shopify', logoText: 'Shopify Logo' },
          { type: STORE_TYPES.WOOCOMMERCE, label: 'WooCommerce', logoText: 'WooComm Logo' },
          { type: STORE_TYPES.DARAZ, label: 'Daraz', logoText: 'Daraz Logo' },
        ].map((platform) => (
          <Button
            key={platform.type}
            variant="outline"
            className="flex flex-col items-center justify-center h-32 p-4 border-gray-600 hover:bg-gray-700 text-white bg-gray-750" // Adjusted styling
            onClick={() => handleTypeSelect(platform.type)}
          >
            <span className="text-xs text-gray-400 mb-2">logo here</span> {/* Placeholder for actual logo */}
            <span className="text-sm font-semibold">{platform.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );

  const renderForm = () => {
    const formProps = {
      initialData: mode === 'edit' ? initialData : {}, // Pass full initialData for edit
      onSave: handleFormSave,
      onCancel: handleCancelForm,
    };

    switch (selectedType) {
      case STORE_TYPES.SHOPIFY:
        return <ShopifyForm {...formProps} />;
      case STORE_TYPES.WOOCOMMERCE:
        return <WooCommerceForm {...formProps} />;
      case STORE_TYPES.DARAZ:
        return <DarazForm {...formProps} />;
      default:
        return <p className="text-red-500">Error: Invalid store type selected.</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) { // If dialog is closing
            setCurrentStep('selection'); // Reset step
            setSelectedType(null);
        }
        onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md md:max-w-lg bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {mode === 'edit' ? `Edit ${selectedType ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1) : ''} Store` : 'Add New Store'}
          </DialogTitle>
        </DialogHeader>
        {currentStep === 'selection' && mode === 'add' ? renderPlatformSelection() : null}
        {currentStep === 'form' && selectedType ? renderForm() : null}
        {/* Footer is now part of individual forms */}
      </DialogContent>
    </Dialog>
  );
}

export default StoreDialog;