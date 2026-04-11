import type { User } from '../types/types';

interface UserCardProps {
  user: User;
  onClick?: () => void;
  showStatus?: boolean;
  selected?: boolean;
}

export default function UserCard({ user, onClick, showStatus = true, selected = false }: UserCardProps) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${selected ? 'border-black bg-gray-50' : 'border-transparent hover:bg-gray-100'}
      `}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="text-3xl">{user.avatar || '👤'}</div>
          {showStatus && (
            <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 truncate">{user.name}</p>
          {user.bio && <p className="text-xs text-gray-500 truncate">{user.bio}</p>}
          {user.status && showStatus && (
            <p className="text-xs text-gray-400 capitalize">{user.status}</p>
          )}
        </div>

        {/* Role Badge */}
        {user.role === 'admin' && (
          <span className="flex-shrink-0 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-semibold">
            👑
          </span>
        )}
      </div>
    </div>
  );
}
