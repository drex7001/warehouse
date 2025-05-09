
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout'; // Adjust path
import Pool from "./components/flow/Pool";
import Main from "./components/Main";

// Example Page Components
const DashboardOverviewPage = () => <div>
  <div className="text-xl font-bold dark:text-neutral-100">Pools Overview</div>
  <div className="bg-neutral-100 dark:bg-neutral-900"> {/* Applied dark background for this section */}
       <main>
         {/* Added light mode border for consistency, dark mode styles were already present */}
         <div className="mx-auto py-6 sm:px-6 lg:px-8 rounded border-1 border-neutral-300  dark:border-neutral-700 ">
           <div className="flex px-4 sm:px-0 gap-4">
             <div className="w-full">
               <Main />
             </div>
           </div>
         </div>
       </main>
     </div>
  </div>;
const ProductsPage = () => <div className="text-xl font-bold">Manage Products</div>;
const SettingsPage = () => <div className="text-xl font-bold">Application Settings</div>;
const LoginPage = () => <div className="flex items-center justify-center h-screen text-2xl">Login Page</div>;


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes that use the DashboardLayout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverviewPage />} /> {/* Default child for /dashboard */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Route without the DashboardLayout (e.g., login page) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Redirect to dashboard or login */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;