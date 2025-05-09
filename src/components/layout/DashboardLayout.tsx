// src/components/layout/DashboardLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'; // Adjust path
import { Button } from '@/components/ui/button'; // Adjust path
import { Menu, Home, Settings, Package } from 'lucide-react'; // Icons
import DarkModeSwitch from "../DarkModeSwitch";

const SidebarContent = () => (
  <nav className="flex flex-col gap-2 p-4">
    <Button variant="ghost" className="justify-start" asChild>
      <Link to="/dashboard"><Home className="mr-2 h-4 w-4" /> Dashboard</Link>
    </Button>
    <Button variant="ghost" className="justify-start" asChild>
      <Link to="/dashboard/products"><Package className="mr-2 h-4 w-4" /> Products</Link>
    </Button>
    <Button variant="ghost" className="justify-start" asChild>
      <Link to="/dashboard/settings"><Settings className="mr-2 h-4 w-4" /> Settings</Link>
    </Button>
  </nav>
);

const DashboardLayout = () => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar - Visible on larger screens */}
      <div className="hidden border-r  md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
              <Package className="h-6 w-6" />
              <span>My App</span>
            </Link>
          </div>
          <div className="flex-1">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        {/* Header for Mobile + Main Header Content */}
        <header className="flex h-14 items-center gap-4 border-b  px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Sidebar Toggle using Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SheetHeader className="mb-4">
                <SheetTitle>
                  <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
                    <Package className="h-6 w-6" />
                    <span>My App</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>

          {/* You can add more header content here like search bar, user profile dropdown */}
          <div className="w-full flex-1">
            {/* <SearchInput /> */}
          </div>
          <DarkModeSwitch />
          {/* <UserDropdown /> */}
        </header>

        {/* Page Content using Outlet */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet /> {/* Specific page content renders here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;