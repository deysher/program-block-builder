import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('trainer');
    if (stored) setTrainer(JSON.parse(stored));
    setLoading(false);
  }, []);

  const register = async (data) => {
    const res = await authAPI.register(data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('trainer', JSON.stringify(res.data.trainer));
    setTrainer(res.data.trainer);
  };

  const login = async (data) => {
    const res = await authAPI.login(data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('trainer', JSON.stringify(res.data.trainer));
    setTrainer(res.data.trainer);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('trainer');
    setTrainer(null);
  };

  return (
    <AuthContext.Provider value={{ trainer, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);