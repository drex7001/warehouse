
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout'; // Adjust path
import Pool from "./components/flow/Pool";
import Main from "./components/Main";

// Example Page Components
const DashboardOverviewPage = () => <div>
  <div className="text-xl font-bold">Pools Overview</div>
  <div className="min-h-screen bg-gray-100">
       <main>
         <div className="mx-auto py-6 sm:px-6 lg:px-8">
           <div className="flex px-4 py-6 sm:px-0 gap-4">
             <div className="w-full">
               <Main />
             </div>
             <div className="w-full border-4 border-dashed border-gray-200 rounded-lg h-96">
               <Pool />
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