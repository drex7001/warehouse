import React from 'react';
import { Button } from '@/components/ui/button';

// Define an interface for the warehouse data, ensure it matches what PoolPage will provide
interface WarehouseData {
  id: string;
  name: string;
  details?: string;
  city?: string;
  street_addr?: string;
  // Add other fields you want to display
}

interface NonSellableWarehouseProps {
  warehouses: WarehouseData[];
  onEdit: (warehouse: WarehouseData) => void;
  onDelete: (warehouseId: string) => void;
}

const NonSellableWarehouse: React.FC<NonSellableWarehouseProps> = ({
  warehouses,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4 mt-4">
      {warehouses.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No non-sellable warehouses have been created yet.
        </p>
      ) : (
        warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="flex justify-between items-center p-4 border rounded-md bg-card shadow"
          >
            <div>
              <h3 className="text-lg font-semibold text-foreground">{warehouse.name}</h3>
              {warehouse.details && (
                <p className="text-sm text-muted-foreground">{warehouse.details}</p>
              )}
              {warehouse.city && (
                <p className="text-sm text-muted-foreground">City: {warehouse.city}</p>
              )}
              {warehouse.street_addr && (
                <p className="text-sm text-muted-foreground">Address: {warehouse.street_addr}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(warehouse)}>Edit</Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(warehouse.id)}>Delete</Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NonSellableWarehouse;