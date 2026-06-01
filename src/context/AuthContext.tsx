import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getUserById, getUserByEmail, createUser } from '../data/users';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isLoading: false, error: null };
    case 'LOGOUT':
      return { ...state, user: null, isLoading: false, error: null };
    case 'REGISTER':
      return { ...state, user: action.payload, isLoading: false, error: null };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      const user = getUserById(savedUserId);
      if (user) {
        dispatch({ type: 'LOGIN', payload: user });
      } else {
        localStorage.removeItem('userId');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = getUserByEmail(email);
      if (user) {
        localStorage.setItem('userId', user.id);
        dispatch({ type: 'LOGIN', payload: user });
      } else {
        dispatch({ type: 'SET_ERROR', payload: '邮箱或密码错误' });
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: '登录失败' });
    }
  };

  const register = async (email: string, password: string, nickname: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const existingUser = getUserByEmail(email);
      if (existingUser) {
        dispatch({ type: 'SET_ERROR', payload: '该邮箱已被注册' });
        return;
      }
      const newUser = createUser(email, password, nickname);
      localStorage.setItem('userId', newUser.id);
      dispatch({ type: 'REGISTER', payload: newUser });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: '注册失败' });
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isLoading: state.isLoading,
        error: state.error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
