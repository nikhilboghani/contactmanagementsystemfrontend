// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for notifications

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize user and token from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // Memoize the Axios instance to prevent unnecessary re-creations
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    });

    // Add Axios interceptor to include token
    instance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return instance;
  }, [token]);

  // Sync token state with localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Signup Function
  const signup = async (userData) => {
    try {
      const response = await api.post('/api/users/signup', userData);
      toast.success('Signup successful! You can now log in.');
      return true;
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Signup failed.');
      return false;
    }
  };

  // Login Function
  const login = async (credentials) => {
    try {
      const response = await api.post('/api/users/login', credentials);
      const { token: receivedToken, user: receivedUser } = response.data;

      setToken(receivedToken); // Update token state
      setUser(receivedUser);   // Update user state

      toast.success('Login successful!');
      return true;
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Login failed.');
      return false;
    }
  };

  // Logout Function
  const logout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      setToken(null); // Clear token state
      setUser(null);  // Clear user state
      toast.success('Logged out successfully!');
    }
  };

  // Update Profile Function
  const updateProfile = async (formData) => {
  try {
    const response = await api.put('/api/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Required for file uploads
      },
    });
    setUser(response.data);
    localStorage.setItem('user', JSON.stringify(response.data));
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    alert('Failed to update profile. Please try again.');
  }
};

  // Memoize the context value to optimize performance
  const contextValue = useMemo(() => ({
    user,
    signup,
    login,
    logout,
    updateProfile,
  }), [user, signup, login, logout, updateProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
