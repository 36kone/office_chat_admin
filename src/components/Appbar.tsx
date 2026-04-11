import { Bell, LogOut, User, MoreVertical, MessageSquare, Users, LayoutDashboard, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';
import type { User as UserType } from '../types/types';
import type { PageType } from '../App';

interface AppbarProps {
  user: UserType;
  onLogout: () => void;
  onNavigate: (page: PageType) => void;
  onProfile: () => void;
  currentPage?: PageType;
}

export default function Appbar({ user, onLogout, onNavigate, onProfile, currentPage }: AppbarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chats', label: 'Chats', icon: MessageSquare },
    { id: 'users', label: 'Usuários', icon: Users },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Left side - Brand/Logo */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Office Chat</span>
        </div>

        {/* Center - Tabs Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as PageType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-accent/10 text-accent' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right side - User & Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-gray-50 rounded-full transition text-gray-500 relative group focus:outline-none">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
            <div className="bg-[#1a1a1a] p-4 flex items-center justify-between">
              <h3 className="text-white font-bold text-lg">Notificações</h3>
              <Mail className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            </div>
            <div className="bg-white p-8 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-gray-900 text-lg">Sem notificações</p>
                <p className="text-sm text-gray-500 leading-relaxed px-4">
                  Quando você tiver notificações, elas aparecerão aqui.
                </p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

        {/* User Info & Profile Dropdown */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-gray-900 leading-none">{user.name}</p>
            <p className="text-[11px] text-accent font-medium mt-1">Online</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 hover:opacity-80 transition-opacity focus:outline-none">
                <Avatar className="w-10 h-10 border-2 border-gray-50">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-accent/10 text-accent font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 mt-1 shadow-xl border-gray-100 rounded-xl">
              <div className="px-2 py-3 mb-2 border-b border-gray-50 sm:hidden">
                <p className="text-sm font-bold text-gray-900">{user.name}</p>
                <p className="text-xs text-accent">Administrador</p>
              </div>
              <DropdownMenuItem onClick={onProfile} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Meu Perfil</span>
                  <span className="text-[10px] text-gray-400 text-left">Editar dados pessoais</span>
                </div>
              </DropdownMenuItem>
              
              <div className="my-1 border-t border-gray-50 md:hidden"></div>
              {navItems.map((item) => (
                <DropdownMenuItem 
                  key={item.id} 
                  onClick={() => onNavigate(item.id as PageType)}
                  className="flex md:hidden items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50"
                >
                  <item.icon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">{item.label}</span>
                </DropdownMenuItem>
              ))}

              <div className="my-1 border-t border-gray-50"></div>
              <DropdownMenuItem onClick={onLogout} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-sm font-bold">Sair do Sistema</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
