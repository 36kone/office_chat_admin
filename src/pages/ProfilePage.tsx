import { useState } from 'react';
import type { AppContextType } from '../App';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { LogOut, Save } from 'lucide-react';

interface ProfilePageProps {
  pageContext: AppContextType;
}

export function ProfilePage({ pageContext }: ProfilePageProps) {
  const [user, setUser] = useState({
    name: 'Administrador',
    email: 'admin@empresa.com',
    role: 'Administrador',
    avatar: '👨‍💼',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Salvando perfil:', user);
  };

  const handleLogout = () => {
    pageContext.setIsAuthenticated(false);
    pageContext.setCurrentPage('login');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
        <Button variant="destructive" onClick={handleLogout} className="rounded-full gap-2">
          <LogOut className="h-4 w-4" />
          Sair do Sistema
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col items-center p-8 bg-gray-50/50 rounded-t-lg">
          <span className="text-7xl mb-4 bg-white p-6 rounded-full shadow-sm">{user.avatar}</span>
          <CardTitle className="text-2xl font-bold text-gray-800">{user.name}</CardTitle>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">{user.role}</p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail Corporativo</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="h-12 rounded-xl bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Cargo / Função</Label>
              <Input
                id="role"
                value={user.role}
                onChange={(e) => setUser({ ...user, role: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl bg-black hover:bg-gray-800 gap-2 font-bold">
              <Save className="h-5 w-5" />
              Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
