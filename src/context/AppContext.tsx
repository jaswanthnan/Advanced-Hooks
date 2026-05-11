import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_THEME' };

const getInitialState = (): AppState => {
  let user = null;
  let isAuthenticated = false;
  
  try {
    const savedUser = localStorage.getItem('auth_user');
    
    // Safely check if savedUser exists and is not a corrupted string
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      user = JSON.parse(savedUser);
      isAuthenticated = true;
    } else if (savedUser === 'undefined' || savedUser === 'null') {
      // Clear corrupt data
      localStorage.removeItem('auth_user');
    }
  } catch (error) {
    console.error("Failed to parse auth_user from localStorage", error);
    localStorage.removeItem('auth_user');
  }

  return {
    user,
    isAuthenticated,
    theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
    isLoading: false,
    error: null,
  };
};

const initialState: AppState = getInitialState();

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('auth_user', JSON.stringify(action.payload));
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      localStorage.removeItem('auth_user');
      return { ...state, user: null, isAuthenticated: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_THEME':
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', nextTheme);
      return { ...state, theme: nextTheme };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

