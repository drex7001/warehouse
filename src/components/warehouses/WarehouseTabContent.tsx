import React from 'react';
import { Button } from '@/components/ui/button';

export function WarehouseTabContent({ warehouses, onAdd, onEdit }) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          onClick={onAdd}
          variant="outline"
          size="sm"
          // Removed specific dark/light bg, hover, text, and border colors
          className="text-xs px-3 py-1.5"
        >
          Add warehouse +
        </Button>
      </div>

      <div className="space-y-2">
        {warehouses.length === 0 && (
          <p className="text-muted-foreground text-center py-4">No warehouses yet. Add one!</p>
        )}
        {warehouses.map((wh) => (
          <div
            key={wh.id}
            className="flex justify-between items-center p-3 border rounded-md bg-card" // Use bg-card and default border
          >
            <div>
              <span className="text-foreground text-base">{wh.name}</span>
              {wh.details && (
                <span className="text-muted-foreground text-xs ml-1">
                  {wh.details}
                </span>
              )}
            </div>
            <Button
              onClick={() => onEdit(wh)}
              variant="outline" 
              size="sm"
              // Removed specific hover, text, and border colors
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

export default WarehouseTabContent;