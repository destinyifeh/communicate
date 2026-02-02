import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Users, 
  TrendingUp,
  Activity,
  ArrowUpRight,
  Plus,
  UserPlus,
  Instagram,
  Facebook,
  MessageSquare,
  LucideIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { mockClients, clientTrafficData } from '@/lib/mockData';

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const totalRevenue = mockClients.reduce((sum, c) => sum + c.revenue, 0);
const activeClients = mockClients.filter(c => c.status === 'active').length;
const totalLeads = mockClients.reduce((sum, c) => sum + c.leadsUsed, 0);

const stats = [
  { 
    label: 'Total Revenue', 
    value: `₦${(totalRevenue / 1000000).toFixed(1)}M`, 
    change: '+24%',
    icon: DollarSign,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  { 
    label: 'Active Clients', 
    value: activeClients.toString(), 
    change: '+2',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  { 
    label: 'Total Leads', 
    value: totalLeads.toLocaleString(), 
    change: '+18%',
    icon: TrendingUp,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
  },
  { 
    label: 'Avg. Conversion', 
    value: '14.2%', 
    change: '+3.1%',
    icon: Activity,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
];

// Mock data for automation types distribution
const automationTypesData = [
  { name: 'Lead Capture', value: 45, color: 'hsl(142, 76%, 36%)' },
  { name: 'Sales/Orders', value: 30, color: 'hsl(25, 95%, 53%)' },
  { name: 'Appointments', value: 15, color: 'hsl(199, 89%, 48%)' },
  { name: 'Support', value: 10, color: 'hsl(271, 91%, 65%)' },
];

// Mock data for channel distribution
interface ChannelDistribution {
  name: string;
  value: number;
  icon: LucideIcon | (() => JSX.Element);
  color: string;
}

const channelDistributionData: ChannelDistribution[] = [
  { name: 'WhatsApp', value: 45, icon: MessageSquare, color: 'bg-green-500' },
  { name: 'Instagram', value: 30, icon: Instagram, color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { name: 'Facebook', value: 20, icon: Facebook, color: 'bg-blue-600' },
  { name: 'TikTok', value: 5, icon: TikTokIcon, color: 'bg-foreground' },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Agency Command Center</h2>
            <p className="text-muted-foreground">Overview of all client performance and automation metrics</p>
          </div>
          <Link to="/admin/clients">
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </Link>
        </div>

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
                    <Badge variant="secondary" className="bg-accent/10 text-accent flex items-center gap-1">
                      {stat.change}
                      <ArrowUpRight className="h-3 w-3" />
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Traffic Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Client Traffic Distribution</CardTitle>
                <CardDescription>Leads generated by each active client</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clientTrafficData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                      <XAxis 
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      />
                      <YAxis 
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        width={100}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [value.toLocaleString() + ' leads', 'Leads']}
                      />
                      <Bar 
                        dataKey="leads" 
                        fill="hsl(var(--primary))" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Automation Types Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Automation Types</CardTitle>
                <CardDescription>Distribution across all clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={automationTypesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {automationTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [`${value}%`, 'Share']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {automationTypesData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                      <span className="text-sm font-medium ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Channel Distribution */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Channel Distribution</CardTitle>
              <CardDescription>Active automations per platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {channelDistributionData.map((channel, index) => {
                const IconComponent = channel.icon;
                return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${channel.color} flex items-center justify-center text-white`}>
                    {channel.name === 'TikTok' ? <TikTokIcon /> : <IconComponent className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{channel.name}</span>
                      <span className="text-sm text-muted-foreground">{channel.value}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${channel.color}`}
                        style={{ width: `${channel.value}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
              })}
            </CardContent>
          </Card>

          {/* Top Performer */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Top Performing Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                  FH
                </div>
                <div>
                  <p className="font-semibold text-lg">Fashion Hub</p>
                  <p className="text-sm text-muted-foreground">Enterprise Plan</p>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-medium">₦7.5M</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Leads</span>
                  <span className="font-medium">2,890</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Conversion</span>
                  <span className="font-medium text-accent">18.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Summary */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                <div className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-green-600" />
                  <span className="text-sm">New Clients</span>
                </div>
                <span className="font-semibold text-green-600">+3</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-destructive" />
                  <span className="text-sm">Churned</span>
                </div>
                <span className="font-semibold text-destructive">1</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                  <span className="text-sm">Upgrades</span>
                </div>
                <span className="font-semibold text-primary">2</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
