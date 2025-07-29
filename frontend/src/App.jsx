import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import Home from './pages/Home';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard_NEW';
import VendorDashboard from './pages/VendorDashboard';
import VendorRegistration from './pages/VendorRegistration';
import AdminSetup from './pages/AdminSetup';
import Navbar from './components/Navbar';
import Footer from './components/Footer_NEW';
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CopilotWidget from './components/CopilotWidget';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [], user }) => {
  const token = localStorage.getItem('token');
  
  if (!token || !user) {
    return <Navigate to="/auth" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Layout wrapper component
const AppLayout = ({ user, setUser, searchQuery, setSearchQuery }) => {
  const location = useLocation();
  
  // Check if current route is a dashboard route
  const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/vendor');
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh' 
    }}>
      {/* Only show Navbar for non-dashboard routes */}
      {!isDashboardRoute && (
        <Navbar 
          user={user} 
          setUser={setUser} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route 
            path="/" 
            element={<Home searchQuery={searchQuery} />} 
          />
          <Route 
            path="/admin-setup" 
            element={<AdminSetup />} 
          />
          <Route 
            path="/auth" 
            element={user ? <Navigate to="/" /> : <Auth setUser={setUser} />} 
          />
          <Route 
            path="/vendor-registration" 
            element={user ? <Navigate to="/" /> : <VendorRegistration />} 
          />
          <Route 
            path="/forgot-password" 
            element={<ForgotPassword />} 
          />
          <Route 
            path="/product/:id" 
            element={<ProductDetail />} 
          />
          <Route 
            path="/cart" 
            element={<Cart />} 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']} user={user}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Vendor Routes */}
          <Route 
            path="/vendor/*" 
            element={
              <ProtectedRoute allowedRoles={['vendor']} user={user}>
                <VendorDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Box>
      
      {/* Only show Footer for non-dashboard routes */}
      {!isDashboardRoute && <Footer />}
    </Box>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  return (
    <CartProvider>
      <Router>
        <CssBaseline />
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <CopilotWidget />
        
        <AppLayout 
          user={user} 
          setUser={setUser} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
      </Router>
    </CartProvider>
  );
}

export default App;
