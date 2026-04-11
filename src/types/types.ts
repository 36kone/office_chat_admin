export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  bio?: string;
  role?: 'admin' | 'user';
}

export interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  read?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  isGroup: boolean;
  lastMessage?: {
    sender: {
      name: string;
    };
    content: string;
    timestamp: Date;
  };
  unreadCount?: number;
}
