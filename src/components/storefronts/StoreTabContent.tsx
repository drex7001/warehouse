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
          variant="outline" // variant="outline" might be overridden by explicit bg
          size="sm"
          className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 text-xs px-3 py-1.5"
        >
          Add store +
        </Button>
      </div>

      <div className="space-y-2">
        {stores.length === 0 && (
          <p className="text-neutral-400 text-center py-4">No stores yet. Add one!</p>
        )}
        {stores.map((store) => (
          <div
            key={store.id}
            className="flex justify-between items-center p-3 border border-neutral-600 rounded-md bg-neutral-700"
          >
            <div>
              <span className="text-white text-base">{store.name}</span>
              {/* Display store type */}
              {store.type && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-blue-700 text-blue-100 rounded-full">
                  {formatStoreType(store.type)}
                </span>
              )}
              {/* You might want to display other specific fields based on type here, or in a details view */}
              {store.location && !store.type && ( // Fallback for old data without type
                <span className="text-neutral-400 text-xs ml-1">
                  ({store.location})
                </span>
              )}
            </div>
            <Button
              onClick={() => onEdit(store)} // onEdit will pass the store with its type
              variant="outline" // variant="outline" might be overridden by explicit bg
              size="sm"
              className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700 text-xs px-4 py-1"
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