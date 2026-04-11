import { useState, createContext, useContext, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ChatsPage, LoginPage, UsersPage, ProfilePage, DashboardPage } from './pages';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Appbar from './components/Appbar';
import type { User } from './types/types';

// --- Context Types ---
export type PageType = 'login' | 'chats' | 'users' | 'profile' | 'dashboard';

export type AppContextType = {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Custom hook to use context easily ---
const useAppValue = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('AppContext must be used within a provider');
  return context;
};

// --- Layout Wrapper ---
const Layout = ({ children }: { children: ReactNode }) => {
  const { user, setIsAuthenticated, setCurrentPage, setUser, currentPage } = useAppValue();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('login');
    navigate('/login');
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onProfile={() => handleNavigate('profile')}
        currentPage={currentPage}
      />
      <main>{children}</main>
    </div>
  );
};

// --- App Component ---
function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const contextValue: AppContextType = {
    currentPage,
    setCurrentPage,
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
  };

  const handleLogin = (email: string, pass: string) => {
    // Mock login
    console.log('Login:', email, pass);
    const mockUser: User = {
      id: 'me',
      name: 'Administrador',
      email: email,
      avatar: '👨‍💼',
    };
    setUser(mockUser);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  return (
    <AppContext.Provider value={contextValue}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/chats" element={<ChatsPage pageContext={contextValue} />} />
                  <Route path="/users" element={<UsersPage pageContext={contextValue} />} />
                  <Route path="/profile" element={<ProfilePage pageContext={contextValue} />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;