# Chat Interno - MVP

Uma aplicação de chat interno modular e componentizada para substituir o WhatsApp dos funcionários.

## Stack Tecnológico

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Utility-first CSS framework

## Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Appbar.tsx       # Barra superior com perfil e notificações
│   ├── Button.tsx       # Componente de botão genérico
│   ├── ChatMessage.tsx  # Componente individual de mensagem
│   ├── ConversationItem.tsx # Item da conversa na sidebar
│   ├── Input.tsx        # Campo de input genérico
│   ├── Modal.tsx        # Modal genérico
│   ├── UserCard.tsx     # Card de usuário
│   └── index.ts         # Exportações dos componentes
│
├── pages/               # Páginas principais
│   ├── ChatsPage.tsx    # Página principal de chats
│   ├── LoginPage.tsx    # Página de login
│   ├── UsersPage.tsx    # Listagem de usuários
│   ├── ProfilePage.tsx  # Página de perfil do usuário
│   └── index.ts         # Exportações das páginas
│
├── data/                # Dados mockados
│   └── mock.ts          # Dados simulados para MVP
│
├── types/               # Tipos TypeScript
│   └── index.ts         # Definição de interfaces
│
├── layouts/             # Layouts reutilizáveis (para expansão futura)
│
├── App.tsx             # Componente raiz
├── main.tsx            # Entrada da aplicação
└── index.css           # Estilos globais
```

## Componentes

### Componentes Base

- **Button** - Botão com variantes (primary, secondary, danger) e tamanhos (sm, md, lg)
- **Input** - Campo de entrada com suporte a ícones e validação
- **Modal** - Modal genérico reutilizável
- **Appbar** - Barra superior com menu dropdown do usuário

### Componentes de Features

- **ChatMessage** - Renderiza uma mensagem individual
- **ConversationItem** - Item de conversa na sidebar com preview
- **UserCard** - Card de usuário com status e badges

## Páginas

### LoginPage
Tela de login com validação básica.
- Email e password obrigatórios
- Feedback visual de erros

### ChatsPage (Principal)
Tela principal de chat com:
- Sidebar com lista de conversas
- Preview da última mensagem
- Indicador de mensagens não lidas
- Área de chat com histórico de mensagens
- Input para enviar mensagens

### UsersPage
Listagem de usuários com:
- Busca e filtros
- Seleção para criar grupos
- Opção de iniciar conversa individual

### ProfilePage
Página de perfil com:
- Edição de informações pessoais
- Alteração de senha

## Como Rodar

### Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

## Próximos Passos

1. Integração com API/WebSocket
2. Autenticação real (JWT)
3. State management com Context API
4. Upload de arquivos
5. Notificações em tempo real
6. Dark mode e responsividade mobile

