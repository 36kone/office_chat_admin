import { Card, CardContent, Button, Badge } from '@/components';
import { MessageCircle, ChevronRight } from 'lucide-react';
import type { User } from '@/types/types';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onMessage: (userId: string) => void;
}

export function UserCard({ user, onEdit, onMessage }: UserCardProps) {
  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'online': return 'Ativo';
      case 'away': return 'Ausente';
      case 'offline': return 'Inativo';
      default: return 'Ativo';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online': return 'bg-green-50 text-green-600 border-green-200';
      case 'away': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'offline': return 'bg-gray-50 text-gray-500 border-gray-200';
      default: return 'bg-green-50 text-green-600 border-green-200';
    }
  };

  const getRoleBadge = (role?: string) => {
    if (role === 'admin') {
      return (
        <Badge variant="outline" className="px-2 py-0 h-5 text-[10px] font-bold rounded-full bg-red-50 text-red-600 border-red-200">
          Administrador
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="px-2 py-0 h-5 text-[10px] font-bold rounded-full bg-[#020817] text-white border-transparent">
        Usuário
      </Badge>
    );
  };

  return (
    <Card 
      className="hover:shadow-md transition-all group border-gray-100 overflow-hidden relative cursor-pointer"
      onClick={() => onEdit(user)}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="text-4xl bg-gray-50 p-3 rounded-2xl block border border-gray-100 group-hover:bg-white transition-colors">
              {user.avatar || '👤'}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-lg leading-none">{user.name}</h3>
              <Badge variant="outline" className={`px-2 py-0 h-5 text-[10px] font-bold rounded-full ${getStatusColor(user.status)}`}>
                {getStatusLabel(user.status)}
              </Badge>
              {getRoleBadge(user.role)}
            </div>
            <p className="text-sm text-gray-500 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-green-50 text-green-600 h-10 w-10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onMessage(user.id);
            }}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          <div className="rounded-full hover:bg-gray-100 text-gray-400 h-10 w-10 transition-colors flex items-center justify-center">
            <ChevronRight className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
