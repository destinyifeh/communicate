import { ClientLayout } from '@/components/layouts/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Bot,
  MessageSquare,
  ShoppingCart,
  UserPlus,
  Activity,
  Instagram,
  Facebook,
  Zap,
  Crown,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { generateChartData, mockActivities } from '@/lib/mockData';
import { useState } from 'react';

// Mock current plan - in real app this would come from user context/API
const currentPlan = {
  name: 'Professional',
  channels: 2,
  maxChannels: 2,
  automations: 7,
  maxAutomations: 10,
  connectedChannels: ['instagram', 'whatsapp'],
};

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

const channelIcons: Record<string, { icon: React.ReactNode; color: string; name: string }> = {
  instagram: { 
    icon: <Instagram className="h-4 w-4" />, 
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    name: 'Instagram'
  },
  facebook: { 
    icon: <Facebook className="h-4 w-4" />, 
    color: 'bg-blue-600',
    name: 'Facebook'
  },
  whatsapp: { 
    icon: <MessageSquare className="h-4 w-4" />, 
    color: 'bg-green-500',
    name: 'WhatsApp'
  },
  tiktok: { 
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
      </svg>
    ), 
    color: 'bg-black dark:bg-white dark:text-black',
    name: 'TikTok'
  },
};

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
  const planIcon = currentPlan.name === 'Starter' ? Zap : currentPlan.name === 'Professional' ? Crown : Sparkles;
  const PlanIcon = planIcon;

  return (
    <ClientLayout>
      <div className="space-y-6">
        {/* Plan Overview Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                    <PlanIcon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{currentPlan.name} Plan</h3>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentPlan.channels} of {currentPlan.maxChannels} channels • {currentPlan.automations} of {currentPlan.maxAutomations} automations
                    </p>
                  </div>
                </div>
                
                {/* Connected Channels */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {currentPlan.connectedChannels.map((channel) => {
                      const channelInfo = channelIcons[channel];
                      return (
                        <div
                          key={channel}
                          className={`h-9 w-9 rounded-full ${channelInfo.color} flex items-center justify-center text-white border-2 border-card`}
                          title={channelInfo.name}
                        >
                          {channelInfo.icon}
                        </div>
                      );
                    })}
                    {currentPlan.channels < currentPlan.maxChannels && (
                      <div className="h-9 w-9 rounded-full bg-secondary border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+{currentPlan.maxChannels - currentPlan.channels}</span>
                      </div>
                    )}
                  </div>
                  <Button size="sm" variant="outline" className="gap-1">
                    Upgrade <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Usage Progress */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Channels Used</span>
                    <span className="font-medium">{currentPlan.channels}/{currentPlan.maxChannels}</span>
                  </div>
                  <Progress value={(currentPlan.channels / currentPlan.maxChannels) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Automations Active</span>
                    <span className="font-medium">{currentPlan.automations}/{currentPlan.maxAutomations}</span>
                  </div>
                  <Progress value={(currentPlan.automations / currentPlan.maxAutomations) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your automations and channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="text-sm">Create Automation</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Connect Channel</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  <span className="text-sm">View Leads</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ClientLayout>
  );
}
