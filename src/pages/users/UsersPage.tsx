import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '@/components';
import { Search, UserPlus, Loader2 } from 'lucide-react';
import { UserCard } from './components/UserCard';
import { UserSheet } from './components/UserSheet';
import userService from '@/services/user/user.service';
import type { UserTypes } from '@/types/user/user.types';
import { toast } from '@/components/ui/use-toast';

export function UsersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserTypes | null>(null);
  const [users, setUsers] = useState<UserTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async (keyword?: string) => {
    try {
      setIsLoading(true);
      const response = await userService.search({
        page: 1,
        size: 50,
        keyword: keyword,
      });
      setUsers(response.list || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message || "Não foi possível carregar a lista de usuários.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, fetchUsers]);

  const handleEditUser = (user: UserTypes) => {
    setSelectedUser(user);
    setIsSheetOpen(true);
  };

  const handleNewUser = () => {
    setSelectedUser(null);
    setIsSheetOpen(true);
  };

  const handleSaveUser = async (data: any) => {
    try {
      setIsLoading(true);
      if (selectedUser?.id) {
        await userService.update({ 
          id: selectedUser.id,
          isActive: data.isActive,
          mfaEnabled: data.mfaEnabled,
          isAdmin: data.isAdmin,
          singleSession: data.singleSession,
        });
        toast({ title: "Sucesso", description: "Usuário atualizado com sucesso." });
      } else {
        await userService.createUser(data);
        toast({ title: "Sucesso", description: "Usuário criado com sucesso." });
      }
      fetchUsers(search);
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Ocorreu um erro ao tentar salvar o usuário.",
        variant: "destructive"
      });
      throw error; // Re-throw para o UserSheet tratar se necessário
    } finally {
      setIsLoading(false);
      setIsSheetOpen(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setIsLoading(true);
      await userService.delete(userId);
      toast({ title: "Sucesso", description: "Usuário excluído com sucesso." });
      fetchUsers(search);
    } catch (error: any) {
      toast({
        title: "Erro ao excluir",
        description: error.message || "Ocorreu um erro ao tentar excluir o usuário.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsSheetOpen(false);
    }
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
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
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

      {isLoading && users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
          <p className="text-gray-500 font-medium">Carregando usuários...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {(users || []).map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => handleEditUser(user)}
              onMessage={handleMessageUser}
            />
          ))}
          {!isLoading && (!users || users.length === 0) && (
            <div className="col-span-full text-center py-20 text-gray-500">
              Nenhum usuário encontrado para "{search}"
            </div>
          )}
        </div>
      )}

      <UserSheet
        user={selectedUser ? selectedUser : null}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSave={(data) => handleSaveUser(data as any)}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}
