import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import AddProduct from './components/AddProduct';
import Analytics from './components/Analytics';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App; 