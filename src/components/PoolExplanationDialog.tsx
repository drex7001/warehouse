import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface PoolExplanationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const PoolExplanationDialog: React.FC<PoolExplanationDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const PlaceholderBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="my-4 flex h-32 items-center justify-center rounded-md border-2 border-dashed border-muted bg-muted/50 p-4 text-center text-muted-foreground">
      {children}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Understanding Pools: Your Guide to Multi-Location Management
          </DialogTitle>
          <DialogDescription>
            Learn how Pools can help you efficiently manage separate sets of warehouses and storefronts.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <section>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Introduction</h3>
            <PlaceholderBox>[Introductory Diagram/GIF: Pool branching to Warehouse & Storefront]</PlaceholderBox>
            <p className="text-sm text-muted-foreground">
              Pools help you manage separate sets of warehouses and storefronts, perfect for expanding your business to new areas or countries.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-foreground">1. What is a Pool?</h3>
            <p className="text-sm text-muted-foreground">
              Think of a Pool as an independent branch of your business. It allows you to operate distinct warehouse and sales operations for specific regions or markets.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              <strong>Example:</strong> If you're selling in Europe and want to start operations in North America, you'd create a new Pool for North America.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-foreground">2. How Pools Work: Warehouses & Storefronts</h3>
            <PlaceholderBox>[Animation/GIF: Pool with multiple Warehouses (W1, W2) and Storefronts (S1, S2), showing connections]</PlaceholderBox>
            <p className="text-sm text-muted-foreground">
              Within each Pool, you can set up:
            </p>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
              <li><strong>Multiple Warehouses:</strong> Physical locations where you store your inventory.</li>
              <li><strong>Multiple Storefronts:</strong> Your online shops or sales channels.</li>
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">
              Storefronts in a Pool are connected to the warehouses within that <em>same</em> Pool. This keeps operations organized and localized.
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-foreground">3. Smart Order Fulfillment</h3>
            <p className="text-sm text-muted-foreground">
              When an order comes into a storefront, the Pool system intelligently decides which warehouse should fulfill it.
            </p>
            <div className="mt-3">
              <h4 className="font-medium text-foreground">Scenario 1: City-Based Fulfillment</h4>
              <PlaceholderBox>[Animation/GIF: Map UI showing order routing based on city match with warehouse service area]</PlaceholderBox>
              <p className="text-sm text-muted-foreground">
                You can assign specific cities or regions to each warehouse. If an order's delivery address matches a warehouse's service area, that warehouse handles the order.
              </p>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-foreground">Scenario 2: Default Warehouse</h4>
              <PlaceholderBox>[Animation/GIF: Order routing to Default Warehouse when no city match is found]</PlaceholderBox>
              <p className="text-sm text-muted-foreground">
                Each Pool can have a 'Default Warehouse'. If an order's city doesn't match any specific warehouse's list, or if you prefer a simpler setup, the order goes to this default warehouse.
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-lg font-semibold text-foreground">4. Why Use Pools?</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li><strong>Organized Expansion:</strong> Keep operations for different markets (e.g., USA vs. Canada) completely separate.</li>
              <li><strong>Localized Inventory & Fulfillment:</strong> Optimize shipping costs and times by fulfilling orders from the nearest warehouse.</li>
              <li><strong>Targeted Sales Strategies:</strong> Tailor storefronts and product offerings to specific regions.</li>
            </ul>
          </section>
        </div>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PoolExplanationDialog;
