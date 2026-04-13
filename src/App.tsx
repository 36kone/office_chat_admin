import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ChatsPage, LoginPage, UsersPage, ProfilePage, DashboardPage } from './pages';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Appbar from './components/Appbar';
import { useAuth } from './contexts/AuthContext';

export type PageType = 'login' | 'chats' | 'users' | 'profile' | 'dashboard';

// --- Layout Wrapper ---
const Layout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (page: PageType) => {
    navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Appbar
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onProfile={() => handleNavigate('profile')}
      />
      <main>{children}</main>
    </div>
  );
};

// --- App Component ---
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
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
                <Route path="/chats" element={<ChatsPage pageContext={{ page: 'chats' }} />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
