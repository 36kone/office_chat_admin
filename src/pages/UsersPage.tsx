import { useState } from 'react';
import type { AppContextType } from '../App';
import type { User } from '../types/types';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, UserPlus, MessageCircle } from 'lucide-react';

interface UsersPageProps {
  pageContext: AppContextType;
}

export function UsersPage({ }: UsersPageProps) {
  const [search, setSearch] = useState('');
  const [users] = useState<User[]>([
    { id: '1', name: 'João Silva', email: 'joao@empresa.com', avatar: '👨‍💼' },
    { id: '2', name: 'Maria Souza', email: 'maria@empresa.com', avatar: '👩‍💼' },
    { id: '3', name: 'Pedro Santos', email: 'pedro@empresa.com', avatar: '👨‍🔧' },
    { id: '4', name: 'Ana Costa', email: 'ana@empresa.com', avatar: '👩‍🎨' },
  ]);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Usuários</h1>
        <Button className="rounded-full bg-black hover:bg-gray-800 gap-2">
          <UserPlus className="h-4 w-4" />
          Convidar Usuário
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Pesquisar usuários por nome ou e-mail..."
          className="pl-10 h-12 rounded-xl bg-white shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl bg-gray-100 p-2 rounded-full">{user.avatar}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-green-50 text-green-600">
                <MessageCircle className="h-6 w-6" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
