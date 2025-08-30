import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // Set up intervals for periodic auth check and token refresh
  useEffect(() => {
    // Run checkAuth once at the start
    checkAuth();

    // Auth check every 2 hours
    const authCheckInterval = setInterval(() => {
      checkAuth();  
    }, 2 * 60 * 60 * 1000); // 2 hours

    // Token refresh every 23 hours
    const tokenRefreshInterval = setInterval(() => {
      refreshToken();
    }, 23 * 60 * 60 * 1000); // 23 hours

    return () => {
      clearInterval(authCheckInterval);
      clearInterval(tokenRefreshInterval);
    };
  }, []);


  // Enhanced fetch function with automatic token refresh
  const authenticatedFetch = async (url, options = {}) => {
    try {
      let response = await fetch(url, {
        ...options,
        credentials: 'include'
      });

      // If access token is expired (401), try to refresh
      if (response.status === 401) {
        const refreshSuccess = await refreshToken();
        
        if (refreshSuccess) {
          // Retry the original request with new token
          response = await fetch(url, {
            ...options,
            credentials: 'include'
          });
        } else {
          // Refresh failed, user needs to login again
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

  const refreshToken = async () => {
    try {
      const response = await fetch('/api/v1/auth/refresh', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
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

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/v1/user/home', {
        credentials: 'include'
      });
      
      if (response.ok) {
        setUser({ authenticated: true });
      } else if (response.status === 401) {
        // Try to refresh token
        const refreshSuccess = await refreshToken();
        if (refreshSuccess) {
          // Retry auth check after refresh
          const retryResponse = await fetch('/api/v1/user/home', {
            credentials: 'include'
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

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'GET',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      authenticatedFetch,
      refreshToken 
    }}>
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