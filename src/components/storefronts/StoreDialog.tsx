import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Import forms
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
    <div className="py-4 ">
      <DialogDescription className="text-center mb-6 text-muted-foreground">
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
            variant="outline" // Outline variant is theme-aware
            className="flex flex-col items-center justify-center h-32 p-4 hover:bg-accent hover:text-accent-foreground" // Rely on variant for most styling
            onClick={() => handleTypeSelect(platform.type)}
          >
            {/* Replace with actual <img> or SVG component for logos */}
            <div className="w-12 h-12 mb-2 flex items-center justify-center bg-muted rounded-md">
              <span className="text-xs text-muted-foreground">Logo</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{platform.label}</span>
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
      {/* DialogContent will use default Shadcn styling (bg-background/bg-card, p-6, border, shadow) */}
      {/* Adjust max-w if needed, e.g., sm:max-w-xl or sm:max-w-2xl for wider forms */}
      <DialogContent className="sm:max-w-lg md:max-w-xl "> {/* Adjusted max-width for potentially wider forms */}
        <DialogHeader>
          {/* DialogTitle will use default theme styling */}
          <DialogTitle>
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