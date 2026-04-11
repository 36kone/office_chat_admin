import type { Message } from '../types/types';

interface ChatMessageProps {
  message: Message;
  isOwn?: boolean;
}

export default function ChatMessage({ message, isOwn = false }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex gap-3 mb-4 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0 text-2xl">{message.sender.avatar}</div>

      {/* Message Bubble */}
      <div className={`max-w-xs ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isOwn && (
          <p className="text-xs text-gray-600 font-semibold mb-1">{message.sender.name}</p>
        )}
        
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isOwn
              ? 'bg-black text-white rounded-br-none'
              : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
          }`}
        >
          <p className="break-words">{message.content}</p>
        </div>

        <p className={`text-xs mt-1 ${isOwn ? 'text-gray-600' : 'text-gray-500'}`}>
          {formatTime(message.timestamp)}
          {isOwn && message.read && ' ✓✓'}
        </p>
      </div>
    </div>
  );
}
