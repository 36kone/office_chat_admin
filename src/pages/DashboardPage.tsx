import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';

export function DashboardPage() {
  const stats = [
    { title: 'Total de Conversas', value: '45', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Usuários Ativos', value: '12', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Mensagens Hoje', value: '342', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Tempo Médio Resposta', value: '4m', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const recentActivity = [
    { user: 'João Silva', action: 'enviou uma mensagem em', target: 'Equipe de Vendas', time: '2m atrás' },
    { user: 'Maria Souza', action: 'iniciou um novo chat com', target: 'Pedro Santos', time: '15m atrás' },
    { user: 'Ana Costa', action: 'entrou no grupo', target: 'Marketing', time: '1h atrás' },
    { user: 'Carlos Oliveira', action: 'alterou a foto do grupo', target: 'Projetos', time: '3h atrás' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Bem-vindo de volta, Admin! 👋</h1>
        <p className="text-muted-foreground text-lg">Aqui está um resumo do que aconteceu hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500 font-medium">+12%</span> em relação ao mês passado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between text-sm border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{activity.user}</span>
                  <span className="text-muted-foreground">
                    {activity.action} <span className="font-medium text-foreground">{activity.target}</span>
                  </span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-primary-foreground">Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8 space-y-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center">
                <span className="text-3xl font-bold">100%</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">Todos os serviços operacionais</h3>
              <p className="text-primary-foreground/80 text-sm">Próxima manutenção agendada para Domingo, 02:00 AM</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
