import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { AppContextType } from '../../App';
import type { Conversation, Message, User } from '../../types/types';
import { Input, Button, Badge, Avatar, AvatarFallback, AvatarImage } from '../../components';
import { Send, Search, Plus, Filter, Paperclip, Smile, Mic, PaperclipIcon, FileText, Image as ImageIcon } from 'lucide-react';

interface ChatsPageProps {
  pageContext: AppContextType;
}

export function ChatsPage({ }: ChatsPageProps) {
  const location = useLocation();
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Todos');

  // Mock data for demonstration
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Usuário 1',
      avatar: 'VS',
      isGroup: false,
      lastMessage: {
        sender: { name: 'Usuário 1' },
        content: 'Bibibi',
        timestamp: new Date(),
      },
      unreadCount: 17,
      tag: 'Suporte',
      time: '1 hora'
    },
    {
      id: '2',
      name: 'Usuário 2',
      avatar: 'VS',
      isGroup: false,
      lastMessage: {
        sender: { name: 'Usuário 2' },
        content: 'Bem vindo a Mobiq, como podemos te ajudar?',
        timestamp: new Date(Date.now() - 7200000),
      },
      unreadCount: 2,
      tag: 'Suporte',
      time: '2 horas'
    },
    {
      id: '3',
      name: 'Usuário 3',
      avatar: 'CH',
      isGroup: false,
      lastMessage: {
        sender: { name: 'Usuário 3' },
        content: 'Olá! Informamos que sua visita técnica...',
        timestamp: new Date(Date.now() - 3600000 * 8),
      },
      unreadCount: 0,
      tag: 'Multiverso',
      time: '8 horas'
    },
    {
      id: '4',
      name: 'Usuário 4',
      avatar: 'RV',
      isGroup: false,
      lastMessage: {
        sender: { name: 'Usuário 4' },
        content: 'Olá, rodrigo tadeu victorino! Tudo bem?',
        timestamp: new Date(Date.now() - 3600000 * 15),
      },
      unreadCount: 0,
      tag: 'Suporte',
      time: '15 horas'
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: { id: '1', name: 'Usuário 1', avatar: 'VS' },
      content: 'ola',
      timestamp: new Date('2026-03-31T21:10:00'),
    },
    {
      id: '2',
      sender: { id: '1', name: 'Usuário 1', avatar: 'VS' },
      content: 'e ai',
      timestamp: new Date('2026-03-31T21:39:00'),
    },
    {
      id: '3',
      sender: { id: '1', name: 'Usuário 1', avatar: 'VS' },
      content: 'dxx',
      timestamp: new Date('2026-03-31T21:39:00'),
    },
    {
      id: '4',
      sender: { id: 'me', name: 'Eu', avatar: 'Eu' },
      content: 'Olá Usuário 1, seja muito bem-vindo(a) à plataforma Chatverse! 🚀\n\nEstamos muito felizes por ter você a bordo. Prepare-se para transformar a comunicação com seus clientes e elevar seus resultados a um novo patamar.',
      timestamp: new Date('2026-03-31T20:39:00'),
    },
  ]);

  useEffect(() => {
    if (location.state?.userId) {
      const chat = conversations.find(c => c.id === location.state.userId);
      if (chat) setSelectedChat(chat);
    }
  }, [location.state, conversations]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log('Sending message:', message);
    setMessage('');
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Aguardando': return 'bg-red-500 hover:bg-red-600';
      case 'Em Atendimento': return 'bg-yellow-500 hover:bg-yellow-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-96 flex-shrink-0 flex flex-col border-r border-gray-200">
        <div className="p-4 space-y-4">
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {['Todos'].map((tab) => (
              <Button
                key={tab}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 text-xs font-medium whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-accent/10 text-accent hover:bg-accent/20' 
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar por"
                className="pl-9 bg-gray-50 border-none rounded-xl h-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full text-gray-400">
              <Filter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-gray-400">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-50">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedChat(conv)}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 flex gap-3 relative ${
                  selectedChat?.id === conv.id ? 'bg-gray-50 border-l-4 border-accent' : 'border-l-4 border-transparent'
                }`}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 border border-gray-100">
                    <AvatarFallback className="bg-gray-100 text-gray-500 font-bold">{conv.avatar}</AvatarFallback>
                  </Avatar>
                  {conv.unreadCount && conv.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] text-gray-400 font-medium">{conv.tag}</span>
                    <span className="text-[10px] text-gray-400">{conv.time}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-gray-800 truncate">{conv.name}</h4>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessage?.content}</p>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#f0f2f5] relative overflow-hidden">
        {/* Background Pattern Mockup */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ backgroundImage: 'url("https://w0.peakpx.com/wallpaper/818/148/HD-wallpaper-whatsapp-background-whatsapp-texture.jpg")', backgroundSize: '400px' }}>
        </div>

        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-6 flex items-center justify-between bg-white border-b border-gray-200 z-10">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gray-100 text-gray-500">{selectedChat.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sm text-gray-800">{selectedChat.name}</h3>
                  <p className="text-[11px] text-gray-500">+55 (11) 94044-6695</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="font-medium">POF2P4T</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 z-10 overflow-y-auto">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-center my-4">
                  <span className="bg-white/80 backdrop-blur-sm px-4 py-1 rounded-lg text-[11px] text-gray-500 font-medium shadow-sm">
                    31 de março de 2026
                  </span>
                </div>
                
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender.id === 'me' ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div className={`max-w-[80%] relative rounded-xl px-4 py-2 shadow-sm ${
                      msg.sender.id === 'me' 
                        ? 'bg-accent text-white rounded-tr-none' 
                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      <div className={`flex items-center gap-1 mt-1 justify-end ${
                        msg.sender.id === 'me' ? 'text-white/70' : 'text-gray-400'
                      }`}>
                        <span className="text-[10px]">
                          {msg.timestamp.getHours()}:{msg.timestamp.getMinutes().toString().padStart(2, '0')}
                        </span>
                        {msg.sender.id === 'me' && (
                          <span className="text-[10px]">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200 z-10">
              <div className="w-full flex gap-3 items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-accent">
                    <FileText className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-accent">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-accent">
                    <PaperclipIcon className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-accent">
                    <Mic className="h-5 w-5" />
                  </Button>
                </div>
                
                <Input
                  placeholder="Digite uma mensagem..."
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm h-10 shadow-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                
                <Button 
                  onClick={handleSendMessage}
                  className="h-10 w-10 rounded-full bg-accent hover:bg-accent/90 p-0"
                >
                  <Send className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 z-10 bg-white/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smile className="h-10 w-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Selecione uma conversa ou inicie um novo chat.</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
