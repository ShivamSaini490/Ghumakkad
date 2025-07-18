// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../services/axios';

export const AuthContext = createContext(); // <-- Exported here

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Auto-login from cookie if exists
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:8081/users/profile', { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
