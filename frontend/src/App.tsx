import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Navbar } from './components/Navbar';

import { ChangePassword } from './pages/ChangePassword';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { user, isFirstLogin } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  
  if (isFirstLogin && window.location.pathname !== '/change-password') {
    return <Navigate to="/change-password" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />; // Or unauthorized page
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <div className={user ? "container" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          
          <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/teacher" element={<ProtectedRoute role="TEACHER"><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/student" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
          
          <Route path="/" element={
            <Navigate to={user ? `/${user.role.toLowerCase()}` : "/login"} />
          } />
        </Routes>
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
