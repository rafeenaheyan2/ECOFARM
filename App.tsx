
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Login from './pages/Login.tsx';
import Dashboard from './pages/Dashboard.tsx';
import RoleDashboard from './pages/RoleDashboards.tsx';
import About from './pages/About.tsx';
import Gallery from './pages/Gallery.tsx';
import Contact from './pages/Contact.tsx';
import { LanguageProvider } from './contexts/LanguageContext.tsx';
import { ToastProvider } from './contexts/ToastContext.tsx';
import { UserRole } from './types.ts';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    return localStorage.getItem('userRole') as UserRole | null;
  });

  const handleLogin = (role: UserRole) => {
    setIsLoggedIn(true);
    setUserRole(role);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-slate-50">
        <NavigationWrapper 
          isLoggedIn={isLoggedIn} 
          userRole={userRole} 
          onLogout={handleLogout} 
          onLogin={handleLogin} 
        />
        <Footer />
      </div>
    </Router>
  );
};

const NavigationWrapper: React.FC<{ 
  isLoggedIn: boolean; 
  userRole: UserRole | null; 
  onLogout: () => void;
  onLogin: (role: UserRole) => void;
}> = ({ isLoggedIn, userRole, onLogout, onLogin }) => {
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (userRole === 'ADMIN') return '/admin-dashboard.html';
    if (userRole === 'ENTREPRENEUR') return '/entrepreneur-dashboard.html';
    return '/customer-dashboard.html';
  };

  const handleProtectedAction = () => {
    if (isLoggedIn) {
      navigate(getDashboardPath());
    } else {
      navigate('/login?role=CUSTOMER');
    }
  };

  return (
    <>
      <Navbar 
        isLoggedIn={isLoggedIn} 
        onLogout={onLogout} 
        onProtectedAction={handleProtectedAction} 
      />
      <main className="flex-grow">
        <Routes>
          {/* Main Landing Page - Redirect to dashboard if logged in */}
          <Route 
            index 
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Home />} 
          />
          <Route 
            path="/" 
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Home />} 
          />
          
          {/* Public Routes - Accessible from menu even when logged in */}
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery isLoggedIn={isLoggedIn} onProtectedAction={(t) => t === 'dashboard' ? handleProtectedAction() : navigate('/gallery')} />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login onLogin={onLogin} />} 
          />

          {/* Protected Dashboard Entry Route */}
          <Route 
            path="/dashboard" 
            element={isLoggedIn ? (
              <Navigate to={getDashboardPath()} replace />
            ) : <Navigate to="/login" replace />} 
          />

          {/* Specific Dashboard Layouts */}
          <Route 
            path="/admin-dashboard.html" 
            element={isLoggedIn && userRole === 'ADMIN' ? <Dashboard /> : <Navigate to="/login?role=ADMIN" replace />} 
          />
          
          <Route 
            path="/entrepreneur-dashboard.html" 
            element={isLoggedIn && userRole === 'ENTREPRENEUR' ? <RoleDashboard role="ENTREPRENEUR" user={{ name: 'Muktarul Huq', id: 'muktarul_123' }} /> : <Navigate to="/login?role=ENTREPRENEUR" replace />} 
          />
          
          <Route 
            path="/customer-dashboard.html" 
            element={isLoggedIn && userRole === 'CUSTOMER' ? <RoleDashboard role="CUSTOMER" user={{ name: 'Valued Customer', id: 'customer_123' }} /> : <Navigate to="/login?role=CUSTOMER" replace />} 
          />

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </LanguageProvider>
  );
};

export default App;
