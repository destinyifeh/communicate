import { ClientLayout } from '@/components/layouts/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Bot,
  MessageSquare,
  ShoppingCart,
  UserPlus,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { generateChartData, mockActivities } from '@/lib/mockData';

const stats = [
  { 
    label: 'Total Leads', 
    value: '1,247', 
    change: '+23%',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  { 
    label: 'Confirmed Sales', 
    value: '₦2.4M', 
    change: '+18%',
    icon: DollarSign,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  { 
    label: 'Conversion Rate', 
    value: '12.4%', 
    change: '+2.1%',
    icon: TrendingUp,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  { 
    label: 'Bot Status', 
    value: 'Active', 
    status: 'online',
    icon: Bot,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
  },
];

const chartData = generateChartData();

const platformIcons: Record<string, string> = {
  whatsapp: '💬',
  instagram: '📸',
  facebook: '👤',
  tiktok: '🎵',
};

const activityIcons: Record<string, typeof UserPlus> = {
  lead: UserPlus,
  sale: ShoppingCart,
  message: MessageSquare,
  bot: Bot,
};

export default function ClientDashboard() {
  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border/50 hover:shadow-medium transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    {stat.change && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        {stat.change}
                      </Badge>
                    )}
                    {stat.status === 'online' && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        Online
                      </Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Chart and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads vs Sales Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Leads vs Sales</CardTitle>
                <CardDescription>Performance over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        interval="preserveStartEnd"
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: 'var(--shadow-medium)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="leads" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorLeads)" 
                        strokeWidth={2}
                        name="Leads"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="hsl(var(--accent))" 
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                        strokeWidth={2}
                        name="Sales"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-border/50 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Real-time platform pings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[280px] overflow-y-auto pr-2">
                  {mockActivities.map((activity, index) => {
                    const Icon = activityIcons[activity.type];
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-0 last:pb-0"
                      >
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">
                            {platformIcons[activity.platform]} {activity.message}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ClientLayout>
  );
}
