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
import ProfilePage from './pages/ProfilePage';
import PracticePage from './pages/PracticePage';
import AdminPractice from './pages/AdminPractice';
import PracticeHub from './pages/PracticeHub';

// Simple Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};


import PublicLayout from './components/PublicLayout';

function App() {
  return (
    <BrowserRouter>
      <TeachingProvider>
        <Routes>
          <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />

          <Route path="/profile" element={<PublicLayout><ProfilePage /></PublicLayout>} />
          <Route path="/courses" element={<PublicLayout><AvailableCoursesPage /></PublicLayout>} />

          <Route path="/lessons/:slug" element={<MainLayout><LessonPage /></MainLayout>} />
          <Route path="/practice" element={<PublicLayout><PracticeHub /></PublicLayout>} />
          <Route path="/practice/:courseId/:topicId" element={<PublicLayout><PracticePage /></PublicLayout>} />

          {/* Protected Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/admin/practice" element={
            <ProtectedRoute>
              <AdminPractice />
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
