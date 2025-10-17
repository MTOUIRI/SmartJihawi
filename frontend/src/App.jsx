import React, { useState, useEffect } from 'react';
import LoginPage from './components/Auth/LoginPage';
import DashboardLayout from './components/Panel/DashboardLayout';
import ExamPlatform from './components/ExamPlatform';
import StudentLoginModal from './components/Auth/StudentLoginModal';
import authService from './components/Auth/AuthService';
import './App.css';

const App = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [studentUser, setStudentUser] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isLoading, setIsLoading] = useState(true);
  const [showStudentLogin, setShowStudentLogin] = useState(false);
  
  // Check for existing authentication on app start
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check admin authentication
        const adminAuth = authService.getAdminAuth();
        if (adminAuth.token && adminAuth.user) {
          setAdminUser(adminAuth.user);
        }
        
        // Check student authentication
        const studentAuth = authService.getStudentAuth();
        if (studentAuth.token && studentAuth.user) {
          setStudentUser(studentAuth.user);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear any invalid tokens
        authService.logoutAdmin();
        authService.logoutStudent();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Handle Admin Login (from /login page)
  const handleAdminLogin = (userData) => {
    setAdminUser(userData);
    // Redirect admin to dashboard
    window.history.pushState({}, '', '/dashboard');
    setCurrentPath('/dashboard');
  };

  // Handle Student Login (from modal on main platform)
  const handleStudentLogin = (userData) => {
    console.log('Student logged in:', userData);
    setStudentUser(userData);
    setShowStudentLogin(false);
    // Student stays on main platform, no redirect needed
  };

  // Handle Admin Logout
  const handleAdminLogout = async () => {
    await authService.logoutAdmin();
    setAdminUser(null);
    
    // Redirect to home page
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  };

  // Handle Student Logout
  const handleStudentLogout = async () => {
    await authService.logoutStudent();
    setStudentUser(null);
  };

  // Listen for URL changes (browser back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // ===== ADMIN LOGIN PAGE =====
  // Show admin login page when path is '/login' and admin is not logged in
  if (currentPath === '/login' && !adminUser) {
    return <LoginPage onLogin={handleAdminLogin} />;
  }

  // ===== ADMIN DASHBOARD =====
  // Show dashboard when path is '/dashboard'
  if (currentPath === '/dashboard') {
    // Redirect to login if admin not authenticated
    if (!adminUser) {
      return <LoginPage onLogin={handleAdminLogin} />;
    }
    
    return (
      <div className="App">
        <DashboardLayout 
          user={adminUser} 
          onLogout={handleAdminLogout}
        />
      </div>
    );
  }

  // ===== MAIN EXAM PLATFORM (DEFAULT) =====
  // Accessible to everyone (students and guests)
  // Students login via modal
  return (
    <div className="App">
      <ExamPlatform 
        user={studentUser}
        onLogout={handleStudentLogout}
        onShowStudentLogin={() => setShowStudentLogin(true)}
      />
      
      {/* Student Login/Register Modal */}
      <StudentLoginModal
        isOpen={showStudentLogin}
        onClose={() => setShowStudentLogin(false)}
        onLogin={handleStudentLogin}
      />
    </div>
  );
};

export default App;