import React from 'react';
import { Button } from '@/components/ui/button';

// Helper to format type for display
const formatStoreType = (type) => {
  if (!type) return '';
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export function StoreTabContent({ stores, onAdd, onEdit }) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={onAdd} // This will now trigger the multi-step dialog
          variant="outline" 
          size="sm"
          // Removed specific bg, hover, text, and border colors to use default outline variant styling
          className="text-xs px-3 py-1.5" 
        >
          Add store +
        </Button>
      </div>

      <div className="space-y-2">
        {stores.length === 0 && (
          <p className="text-muted-foreground text-center py-4">No stores yet. Add one!</p>
        )}
        {stores.map((store) => (
          <div
            key={store.id}
            className="flex justify-between items-center p-3 border rounded-md bg-card" // Use bg-card for background and default border
          >
            <div>
              <span className="text-foreground text-base">{store.name}</span>
              {/* Display store type */}
              {store.type && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                  {formatStoreType(store.type)}
                </span>
              )}
              {/* You might want to display other specific fields based on type here, or in a details view */}
              {store.location && !store.type && ( // Fallback for old data without type
                <span className="text-muted-foreground text-xs ml-1">
                  ({store.location})
                </span>
              )}
            </div>
            <Button
              onClick={() => onEdit(store)} // onEdit will pass the store with its type
              variant="outline" 
              size="sm"
              // Removed specific bg, hover, text, and border colors for the edit button
              className="text-xs px-4 py-1"
            >
              edit
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoreTabContent;