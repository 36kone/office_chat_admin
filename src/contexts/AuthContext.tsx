import { createContext, type ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock implementation
  return (
    <AuthContext.Provider value={{
      user: null,
      isLoading: false,
      login: async () => {},
      logout: () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
}
