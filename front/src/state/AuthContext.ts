import { createContext, useContext } from 'react';

interface AuthContextProps {
  isLoggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  setLoggedIn: () => {},
  checkAuth: () => Promise.resolve(),
});

export const useAuthContext = () => useContext(AuthContext);
