import type { Conversation } from '../types/types';

interface ConversationItemProps {
  conversation: Conversation;
  onClick?: () => void;
  selected?: boolean;
}

export default function ConversationItem({
  conversation,
  onClick,
  selected = false,
}: ConversationItemProps) {
  const formatTime = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const msgDate = new Date(date);
    const diffMs = now.getTime() - msgDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;

    return msgDate.toLocaleDateString('pt-BR');
  };

  const getLastMessagePreview = () => {
    if (!conversation.lastMessage) return 'Sem mensagens';
    const prefix = `${conversation.lastMessage.sender.name}: `;
    return prefix + conversation.lastMessage.content.substring(0, 40);
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full px-4 py-3 border-b border-gray-100 text-left hover:bg-gray-50 transition-colors duration-150
        ${selected ? 'bg-gray-100 border-l-4 border-l-black' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 text-3xl">{conversation.avatar}</div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-gray-800 truncate">
              {conversation.name}
            </p>
            <span className="flex-shrink-0 text-xs text-gray-500">
              {formatTime(conversation.lastMessage?.timestamp)}
            </span>
          </div>

          <p className="text-sm text-gray-600 truncate mt-0.5">
            {getLastMessagePreview()}
          </p>
        </div>

        {/* Unread Badge */}
        {conversation.unreadCount && conversation.unreadCount > 0 && (
          <div className="flex-shrink-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
