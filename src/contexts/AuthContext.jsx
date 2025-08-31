import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Backend API base URL from env
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // Run checkAuth once at the start
    checkAuth();

    // Auth check every 2 hours
    const authCheckInterval = setInterval(checkAuth, 2 * 60 * 60 * 1000);

    // Token refresh every 23 hours
    const tokenRefreshInterval = setInterval(refreshToken, 23 * 60 * 60 * 1000);

    return () => {
      clearInterval(authCheckInterval);
      clearInterval(tokenRefreshInterval);
    };
  }, []);

  // ✅ Unified fetch with API_BASE + retry on 401
  const authenticatedFetch = async (endpoint, options = {}) => {
    try {
      let response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        credentials: 'include',
      });

      if (response.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            credentials: 'include',
          });
        } else {
          setUser(null);
          throw new Error('Authentication failed, please login again');
        }
      }

      return response;
    } catch (error) {
      console.error('Authenticated fetch error:', error);
      throw error;
    }
  };

  // ✅ Refresh token
  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        await response.json();
        console.log('Token refreshed successfully');
        return true;
      } else {
        console.error('Token refresh failed');
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      setUser(null);
      return false;
    }
  };

  // ✅ Check authentication
  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/user/home`, {
        credentials: 'include',
      });

      if (response.ok) {
        setUser({ authenticated: true });
      } else if (response.status === 401) {
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          const retryResponse = await fetch(`${API_BASE}/api/v1/user/home`, {
            credentials: 'include',
          });
          if (retryResponse.ok) {
            setUser({ authenticated: true });
          }
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Manual login
  const login = (userData) => {
    setUser(userData);
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/v1/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        authenticatedFetch,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
