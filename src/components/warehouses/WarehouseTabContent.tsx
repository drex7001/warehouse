// src/components/WarehouseTabContent.js (or your preferred path)
import React from 'react';
import { Button } from '@/components/ui/button'; // Adjust path

export function WarehouseTabContent({ warehouses, onAdd, onEdit }) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={onAdd}
          variant="outline"
          size="sm"
          className="dark:bg-neutral-800 dark:hover:bg-neutral-700 bg-gray-100 hover:bg-gray-200 dark:text-white text-gray-800 dark:border-neutral-700 border-gray-300 text-xs px-3 py-1.5"
        >
          Add warehouse +
        </Button>
      </div>

      <div className="space-y-2">
        {warehouses.length === 0 && (
          <p className="text-neutral-400 text-center py-4">No warehouses yet. Add one!</p>
        )}
        {warehouses.map((wh) => (
          <div
            key={wh.id}
            className="flex justify-between items-center p-3 border border-neutral-600 rounded-md "
          >
            <div>
              <span className="text-white text-base">{wh.name}</span>
              {wh.details && (
                <span className="text-neutral-400 text-xs ml-1">
                  {wh.details}
                </span>
              )}
            </div>
            <Button
              onClick={() => onEdit(wh)}
              variant="outline" // variant="outline" might be overridden by explicit bg
              size="sm"
              className=" hover:bg-neutral-700 text-white border-neutral-700 text-xs px-4 py-1"
            >
              edit
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WarehouseTabContent;