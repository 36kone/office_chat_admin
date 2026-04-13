import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { LogOut, Save, Loader2, Key, Mail, Phone, ShieldCheck, Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { formatDateTime, formatCellphone } from '@/lib/utils';
import { ProfileMFADialog } from '@/components/ProfileMFADialog';

export function ProfilePage() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({  
    name: '',
    email: '',
    isAdmin: false,
    avatar: '👤',
    cellphone: '',
    mfaEnabled: false,
    createdAt: '',
    onlineAt: '',
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
        cellphone: user.cellphone || '',
        mfaEnabled: user.mfaEnabled || false,
        createdAt: user.createdAt || '',
        onlineAt: user.onlineAt || '',
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
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
        <Button 
          variant="ghost" 
          onClick={logout} 
          size="sm"
          className="rounded-full gap-2 font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair do Sistema
        </Button>
      </div>

      <div className="space-y-6">
        {/* Row 1: Resumo e Dados Pessoais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="w-full shadow-sm flex flex-col md:col-span-1">
            <CardHeader className="flex flex-col items-center p-6 bg-muted/40 rounded-t-lg flex-1 justify-center">
              <span className="text-6xl mb-4 bg-background p-5 rounded-full shadow-sm border border-border block">
                {formData.avatar}
              </span>
              <CardTitle className="text-lg font-bold text-foreground text-center">{formData.name}</CardTitle>
              <p className="text-[10px] uppercase tracking-widest font-black text-indigo-600 mt-1 bg-indigo-50 px-2 py-0.5 rounded-full">
                {formData.isAdmin ? 'Admin' : 'Usuário'}
              </p>
            </CardHeader>
            <CardContent className="p-5 space-y-3 bg-card rounded-b-lg border-t border-border">
              <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 hover:bg-muted transition-colors border border-transparent hover:border-border">
                  <div className="p-2 bg-background rounded-lg shadow-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight leading-none mb-0.5">E-mail</p>
                    <p className="text-xs font-bold text-foreground truncate">{formData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40 hover:bg-muted transition-colors border border-transparent hover:border-border">
                  <div className="p-2 bg-background rounded-lg shadow-sm">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tight leading-none mb-0.5">Celular</p>
                    <p className="text-xs font-bold text-foreground truncate">{formatCellphone(formData.cellphone)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm flex flex-col md:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-1">
              <form onSubmit={handleSaveProfile} className="space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-muted-foreground">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-10 rounded-xl bg-muted/30"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-muted-foreground">E-mail Corporativo</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="h-10 rounded-xl bg-muted text-muted-foreground border-border cursor-not-allowed"
                    />
                    <p className="text-[9px] text-muted-foreground italic">O e-mail não pode ser alterado por segurança.</p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 gap-2 font-bold text-primary-foreground shadow-sm transition-all active:scale-[0.98] mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Salvar Alterações
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Status e Segurança */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="w-full shadow-sm overflow-hidden border-border flex flex-col md:col-span-1">
            <div className="bg-primary p-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary-foreground" />
              <span className="text-xs font-bold text-primary-foreground uppercase tracking-wider">Status e Segurança</span>
            </div>

            <CardContent className="p-6 space-y-6 bg-card flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Membro desde</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{formatDateTime(formData.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Último acesso</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{formatDateTime(formData.onlineAt)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <ProfileMFADialog 
                  mfaEnabled={formData.mfaEnabled} 
                  onStatusChange={(enabled) => setFormData({ ...formData, mfaEnabled: enabled })}
                />
              </div>

              <div className="pt-4">
                <div className="bg-green-50 text-green-700 text-[10px] font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 border border-green-100 w-full">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  SISTEMA ONLINE E SEGURO
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm flex flex-col md:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                Segurança e Senha
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 flex-1">
              <form onSubmit={handleUpdatePassword} className="space-y-4 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPassword" title="Senha Atual" className="text-xs font-bold text-muted-foreground">Senha Atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="h-10 rounded-xl bg-muted/30"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="newPassword" title="Nova Senha" className="text-xs font-bold text-muted-foreground">Nova Senha</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="h-10 rounded-xl bg-muted/30"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" title="Confirmar Nova Senha" className="text-xs font-bold text-muted-foreground">Confirmar Senha</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="h-10 rounded-xl bg-muted/30"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  variant="outline"
                  className="w-full h-11 rounded-xl gap-2 font-bold border-2 hover:bg-gray-50 transition-all active:scale-[0.98] mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
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
