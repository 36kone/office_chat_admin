import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { LogOut, Save, Loader2, Key } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export function ProfilePage() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false,
    avatar: '👤',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        isAdmin: user.isAdmin || false,
        email: user.email || '',
        avatar: '👤',
      });
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateProfile({
        name: formData.name,
      });
    } catch (error: any) {
      // O erro já é tratado no AuthContext via toast
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro na senha",
        description: "A nova senha e a confirmação não coincidem.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      // Erro tratado no context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
        <Button 
          variant="ghost" 
          onClick={logout} 
          className="rounded-full gap-2 font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair do Sistema
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        <div className="w-full md:w-1/3 flex">
          <Card className="w-full flex flex-col h-full">
            <CardHeader className="flex flex-col items-center p-8 bg-gray-50/50 rounded-t-lg flex-1 justify-center">
              <span className="text-7xl mb-6 bg-white p-6 rounded-full shadow-sm border border-gray-100">
                {formData.avatar}
              </span>
              <CardTitle className="text-xl font-bold text-gray-800">{formData.name}</CardTitle>
              <p className="text-xs text-muted-foreground tracking-widest font-bold mt-1">
                {formData.isAdmin ? 'Admin' : 'Usuário'}
              </p>
            </CardHeader>
            <CardContent className="p-6 border-t border-gray-100 bg-white rounded-b-lg">
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-gray-500">E-mail</p>
                <p className="text-sm font-bold text-gray-800">{formData.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3 space-y-8">
          {/* Dados Pessoais */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail Corporativo</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="h-12 rounded-xl bg-gray-50 text-gray-500 border-gray-200"
                  />
                  <p className="text-[10px] text-gray-400">O e-mail não pode ser alterado diretamente.</p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-black hover:bg-gray-800 gap-2 font-bold text-white shadow-md transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Salvar Informações
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Alterar Senha */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Segurança</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="h-12 rounded-xl"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="h-12 rounded-xl"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="h-12 rounded-xl"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  variant="outline"
                  className="w-full h-12 rounded-xl gap-2 font-bold border-2 hover:bg-gray-50 transition-all active:scale-[0.98]"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Key className="h-5 w-5" />}
                  Atualizar Senha
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
