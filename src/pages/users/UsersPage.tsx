import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AppContextType } from '../../App';
import type { User } from '../../types/types';
import { Input, Button } from '../../components';
import { Search, UserPlus } from 'lucide-react';
import { UserCard } from './components/UserCard';
import { UserSheet } from './components/UserSheet';

interface UsersPageProps {
  pageContext: AppContextType;
}

export function UsersPage({ }: UsersPageProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'João Silva', email: 'joao@empresa.com', avatar: '👨‍💼', status: 'online', role: 'admin' },
    { id: '2', name: 'Maria Souza', email: 'maria@empresa.com', avatar: '👩‍💼', status: 'online', role: 'user' },
    { id: '3', name: 'Pedro Santos', email: 'pedro@empresa.com', avatar: '👨‍🔧', status: 'away', role: 'user' },
    { id: '4', name: 'Ana Costa', email: 'ana@empresa.com', avatar: '👩‍🎨', status: 'offline', role: 'user' },
  ]);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsSheetOpen(true);
  };

  const handleNewUser = () => {
    setSelectedUser(null);
    setIsSheetOpen(true);
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...userData } as User : u));
    } else {
      // Create new user
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name || '',
        email: userData.email || '',
        avatar: userData.avatar || '👤',
        status: userData.status || 'online',
        role: userData.role || 'user',
      };
      setUsers([...users, newUser]);
    }
    setIsSheetOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    setIsSheetOpen(false);
  };

  const handleMessageUser = (userId: string) => {
    navigate('/chats', { state: { userId } });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Usuários</h1>
        <Button 
          onClick={handleNewUser}
          className="rounded-full bg-black hover:bg-gray-800 h-12 px-8 gap-2 font-bold text-white shadow-lg transition-transform active:scale-95"
        >
          <UserPlus className="h-5 w-5" />
          Novo Usuário
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 group-focus-within:text-black transition-colors" />
        <Input
          placeholder="Pesquisar usuários por nome ou e-mail..."
          className="pl-12 h-14 rounded-2xl bg-white border-gray-100 shadow-sm focus:ring-black focus:border-black text-lg transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredUsers.map((user) => (
          <UserCard 
            key={user.id} 
            user={user} 
            onEdit={handleEditUser}
            onMessage={handleMessageUser}
          />
        ))}
      </div>

      <UserSheet 
        user={selectedUser}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSave={handleSaveUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}
