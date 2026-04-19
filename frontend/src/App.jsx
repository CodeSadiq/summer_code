import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TeachingProvider } from './contexts/TeachingContext';
import MainLayout from './components/MainLayout';
import LandingPage from './pages/LandingPage';
import AvailableCoursesPage from './pages/AvailableCoursesPage';
import LessonPage from './pages/LessonPage';
import AdminPage from './pages/AdminPage';
import AdminLessonEditor from './pages/AdminLessonEditor';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProfilePage from './pages/ProfilePage';

// Simple Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/admin-login" replace />;
  return children;
};


function App() {
  return (
    <BrowserRouter>
      <TeachingProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/courses" element={<AvailableCoursesPage />} />

          <Route path="/lessons/:slug" element={<MainLayout><LessonPage /></MainLayout>} />
          
          {/* Protected Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/lesson/:slug" element={
            <ProtectedRoute>
              <AdminLessonEditor />
            </ProtectedRoute>
          } />
        </Routes>
      </TeachingProvider>
    </BrowserRouter>
  );
}

export default App;
