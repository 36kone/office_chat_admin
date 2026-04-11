import { useState } from 'react';
import type { AppContextType } from '../App';
import ConversationItem from '../components/ConversationItem';
import ChatMessage from '../components/ChatMessage';
import type { Conversation, Message, User } from '../types/types';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Send, Search, PlusCircle } from 'lucide-react';
import CreateGroupModal from '../components/CreateGroupModal';

interface ChatsPageProps {
  pageContext: AppContextType;
}

export function ChatsPage({ }: ChatsPageProps) {
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  // Mock users for modal
  const [users] = useState<User[]>([
    { id: '1', name: 'João Silva', email: 'joao@empresa.com', avatar: '👨‍💼' },
    { id: '2', name: 'Maria Souza', email: 'maria@empresa.com', avatar: '👩‍💼' },
    { id: '3', name: 'Pedro Santos', email: 'pedro@empresa.com', avatar: '👨‍🔧' },
  ]);

  // Mock data for demonstration
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Equipe de Vendas',
      avatar: '🛍️',
      isGroup: true,
      lastMessage: {
        sender: { name: 'João' },
        content: 'Olá pessoal, como estão as metas?',
        timestamp: new Date(),
      },
      unreadCount: 3,
    },
    {
      id: '2',
      name: 'Maria Silva',
      avatar: '👩‍💼',
      isGroup: false,
      lastMessage: {
        sender: { name: 'Maria' },
        content: 'Pode me enviar o relatório?',
        timestamp: new Date(Date.now() - 3600000),
      },
      unreadCount: 0,
    },
  ]);

  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: { id: '2', name: 'Maria', avatar: '👩‍💼' },
      content: 'Olá! 👋',
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: '2',
      sender: { id: 'me', name: 'Eu', avatar: '👨‍💻' },
      content: 'Oi, tudo bem?',
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden border-t border-gray-200">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-gray-200 bg-gray-50/50">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Conversas</h2>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-500 hover:text-green-600 hover:bg-green-50"
              onClick={() => setIsCreateGroupOpen(true)}
            >
              <PlusCircle className="h-6 w-6" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar conversas..."
              className="pl-9 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 text-xs active bg-green-500 text-white hover:bg-green-600 hover:text-white border-green-500">
              Todos
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              Aguardando
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-xs">
              Atendimento
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                selected={selectedChat?.id === conv.id}
                onClick={() => setSelectedChat(conv)}
              />
            ))
          ) : (
            <p className="p-4 text-center text-gray-500 text-sm">Nenhuma conversa encontrada</p>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-6 flex items-center justify-between bg-white border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedChat.avatar}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedChat.name}</h3>
                  <p className="text-xs text-green-500 font-medium">online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col">
              <div className="flex-1" /> {/* Spacer to push messages down */}
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isOwn={msg.sender.id === 'me'}
                />
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Digite sua mensagem..."
                  className="flex-1 rounded-full bg-gray-100 border-none h-12 px-6"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button type="submit" className="rounded-full w-12 h-12 p-0 bg-green-500 hover:bg-green-600">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg">Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>

      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        users={users}
        onCreate={(name, members) => {
          console.log('Creating group:', name, members);
          setIsCreateGroupOpen(false);
        }}
      />
    </div>
  );
}
