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
import FindRoomsPage from '@/pages/FindRoomsPage';
import RoomDetailPage from '@/pages/RoomDetailPage';
import PostFlatmatePage from '@/pages/PostFlatmatePage';
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
            
            {/* Main Room Finding Routes */}
            <Route path="/find-rooms" element={<FindRoomsPage />} />
            <Route path="/room/:id" element={<RoomDetailPage />} />
            
            {/* Legacy routes - redirect to new structure */}
            <Route path="/find-flatmate" element={<Navigate to="/find-rooms" replace />} />
            <Route path="/flatmate/:id" element={<Navigate to="/room/:id" replace />} />
            
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;