import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ChooseAuth from './pages/ChooseAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddSubscription from './pages/AddSubscription';
import EditSubscription from './pages/EditSubscription';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/auth" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/auth" 
            element={
              <PublicRoute>
                <ChooseAuth />
              </PublicRoute>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-subscription" 
            element={
              <ProtectedRoute>
                <AddSubscription />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-subscription/:id" 
            element={
              <ProtectedRoute>
                <EditSubscription />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;