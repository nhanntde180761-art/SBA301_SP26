import React, { createContext, useReducer, useContext } from 'react';
import loginReducer, { initialState } from '../stores/login/loginReducer';

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Hook để sử dụng nhanh
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  } 
  return context;
};
