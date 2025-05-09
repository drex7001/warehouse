import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import PoolPage from './pages/PoolPage';
import ProductsPage from './pages/ProductsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import DashboardHomePage from './pages/DashboardHomePage'; // Added import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes that use the DashboardLayout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHomePage />} /> {/* Changed to DashboardHomePage */}
          <Route path="pools" element={<PoolPage />} /> {/* Added pools route */}
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