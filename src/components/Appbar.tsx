import { Bell, LogOut, User, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import type { User as UserType } from '../types/types';
import type { PageType } from '../App';

interface AppbarProps {
  user: UserType;
  onLogout: () => void;
  onNavigate: (page: PageType) => void;
  onProfile: () => void;
}

export default function Appbar({ user, onLogout, onNavigate, onProfile }: AppbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Left side - User info */}
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500">Online</p>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onProfile} className="flex items-center gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('users')} className="flex items-center gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              Usuários
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onLogout} className="flex items-center gap-2 cursor-pointer text-red-600">
              <LogOut className="w-4 h-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
