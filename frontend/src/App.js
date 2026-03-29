import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import CreateProfilePage from '@/pages/CreateProfilePage';
import BrowseFlatsPage from '@/pages/BrowseFlatsPage';
import FlatDetailPage from '@/pages/FlatDetailPage';
import PropertyDetailPage from '@/pages/PropertyDetailPage';
import PostPropertyPage from '@/pages/PostPropertyPage';
import EditPropertyPage from '@/pages/EditPropertyPage';
import MyListingsPage from '@/pages/MyListingsPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminRegisterPage from '@/pages/AdminRegisterPage';
import AdminDashboard from '@/pages/AdminDashboard';
import PostFlatmatePage from '@/pages/PostFlatmatePage';
import MyFlatmateProfilePage from '@/pages/MyFlatmateProfilePage';
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
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/browse-flats" element={<BrowseFlatsPage />} />
            <Route path="/flat/:id" element={<FlatDetailPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            
            {/* Protected Routes - Require Login */}
            <Route 
              path="/create-profile" 
              element={
                <ProtectedRoute>
                  <CreateProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/post-property" 
              element={
                <ProtectedRoute>
                  <PostPropertyPage />
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
              path="/edit-property/:id" 
              element={
                <ProtectedRoute>
                  <EditPropertyPage />
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
              path="/my-flatmate-profile" 
              element={
                <ProtectedRoute>
                  <MyFlatmateProfilePage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/edit-flatmate/:id" 
              element={
                <ProtectedRoute>
                  <PostFlatmatePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
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
            
            {/* Legacy routes - redirect to new structure */}
            <Route path="/find-rooms" element={<Navigate to="/browse-flats" replace />} />
            <Route path="/room/:id" element={<Navigate to="/flat/:id" replace />} />
            <Route path="/find-flatmate" element={<Navigate to="/browse-flats" replace />} />
            <Route path="/flatmate/:id" element={<Navigate to="/flat/:id" replace />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;