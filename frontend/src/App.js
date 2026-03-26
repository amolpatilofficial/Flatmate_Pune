import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminRegisterPage from '@/pages/AdminRegisterPage';
import BrowseListingsPage from '@/pages/BrowseListingsPage';
import PropertyDetailPage from '@/pages/PropertyDetailPage';
import PostPropertyPage from '@/pages/PostPropertyPage';
import MyListingsPage from '@/pages/MyListingsPage';
import FindFlatmatePage from '@/pages/FindFlatmatePage';
import PostFlatmatePage from '@/pages/PostFlatmatePage';
import FlatmateDetailPage from '@/pages/FlatmateDetailPage';
import MyFlatmateProfilePage from '@/pages/MyFlatmateProfilePage';
import AdminDashboard from '@/pages/AdminDashboard';
import { seedMockData } from '@/utils/seedData';
import '@/App.css';

function App() {
  useEffect(() => {
    // Seed mock data on initial load
    seedMockData();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Admin Routes - Separate from regular user flow */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/register" element={<AdminRegisterPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Regular User Routes */}
            <Route path="/browse/:category" element={<BrowseListingsPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/find-flatmate" element={<FindFlatmatePage />} />
            <Route path="/flatmate/:id" element={<FlatmateDetailPage />} />
            <Route 
              path="/post-property" 
              element={
                <ProtectedRoute>
                  <PostPropertyPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post-flatmate" 
              element={
                <ProtectedRoute>
                  <PostFlatmatePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-listings" 
              element={
                <ProtectedRoute>
                  <MyListingsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-flatmate-profile" 
              element={
                <ProtectedRoute>
                  <MyFlatmateProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;