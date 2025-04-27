import React, { createContext, useState, useEffect } from 'react';

// Helper functions for localStorage
const getLocalStorage = (key) => localStorage.getItem(key);
const setLocalStorage = (key, value) => localStorage.setItem(key, value);
const removeLocalStorage = (keys) => keys.forEach((key) => localStorage.removeItem(key));

// Create the AuthContext
export const AuthContext = createContext({
  authenticated: false,
  userDetails: null,
  setAuthenticated: () => {}, // Default function should be empty
  setUserDetails: () => {},   // Default function should be empty
  logout: () => {}
});

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  // Check if the user is authenticated on app load
  useEffect(() => {
    const token = getLocalStorage('token');
    if (token) {
      setAuthenticated(true);
      setUserDetails({
        userId: getLocalStorage('userId'),
        email: getLocalStorage('userEmail'),
        address: getLocalStorage('userAddress'),
        phone: getLocalStorage('userPhone'),
      });
    }
  }, []);

  // Logout function
  const logout = () => {
    removeLocalStorage(['cart', 'token', 'userId', 'userEmail', 'userAddress', 'userPhone']);
    setAuthenticated(false);
    setUserDetails(null);
  };

  return (
    <AuthContext.Provider value={{ authenticated, userDetails, setAuthenticated, setUserDetails, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
