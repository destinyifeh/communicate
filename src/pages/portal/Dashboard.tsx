import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientLayout } from '@/components/layouts/ClientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  DollarSign, 
  TrendingUp,
  ShoppingCart,
  UserPlus,
  Instagram,
  Facebook,
  Zap,
  Crown,
  ArrowUpRight,
  Sparkles,
  Plus,
  Calendar,
  CreditCard,
  MessageSquare,
  HeadphonesIcon,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { generateChartData, mockActivities } from '@/lib/mockData';
import { UpgradeDialog } from '@/components/portal/UpgradeDialog';
import { ChannelType, PlanType, planDetails, businessCategories, ConfiguredBusinessAutomation } from '@/lib/businessTypes';
import { toast } from 'sonner';

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const channelIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-4 w-4" />,
  facebook: <Facebook className="h-4 w-4" />,
  whatsapp: <MessageSquare className="h-4 w-4" />,
  tiktok: <TikTokIcon />,
};

const channelColors: Record<string, string> = {
  instagram: 'bg-gradient-to-br from-purple-500 to-pink-500',
  facebook: 'bg-blue-600',
  whatsapp: 'bg-green-500',
  tiktok: 'bg-foreground',
};

const categoryIcons: Record<string, React.ReactNode> = {
  sales_orders: <ShoppingCart className="h-4 w-4" />,
  appointments_bookings: <Calendar className="h-4 w-4" />,
  enquiries_support: <HeadphonesIcon className="h-4 w-4" />,
  lead_capture: <UserPlus className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  sales_orders: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  appointments_bookings: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  enquiries_support: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  lead_capture: 'bg-green-500/10 text-green-600 dark:text-green-400',
};

const chartData = generateChartData();

export default function ClientDashboard() {
  const navigate = useNavigate();
  
  const [currentPlan, setCurrentPlan] = useState<PlanType>('starter');
  const [planExpiryDate, setPlanExpiryDate] = useState('2026-03-15');
  const [connectedChannels, setConnectedChannels] = useState<ChannelType[]>([]);
  const [configuredAutomations, setConfiguredAutomations] = useState<ConfiguredBusinessAutomation[]>([]);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);

  // Check if plan is expired
  const isExpired = new Date(planExpiryDate) < new Date();
  const daysUntilExpiry = Math.ceil((new Date(planExpiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    // Load data from localStorage
    const savedPlan = localStorage.getItem('selected_plan') as PlanType;
    if (savedPlan) setCurrentPlan(savedPlan);

    const savedChannels = localStorage.getItem('connected_channels');
    if (savedChannels) {
      const channels = JSON.parse(savedChannels);
      setConnectedChannels(channels.map((c: any) => c.type));
    }

    const savedAutomations = localStorage.getItem('configured_automations');
    if (savedAutomations) {
      setConfiguredAutomations(JSON.parse(savedAutomations));
    }
  }, []);

  const plan = planDetails[currentPlan];
  const maxChannels = plan.maxChannels;
  const maxAutomations = plan.maxAutomations === 'unlimited' ? 999 : plan.maxAutomations;
  const automationsCount = configuredAutomations.length;

  const planIcon = currentPlan === 'starter' ? Zap : currentPlan === 'professional' ? Crown : Sparkles;
  const PlanIcon = planIcon;

  // Group automations by channel
  const automationsByChannel = configuredAutomations.reduce((acc, automation) => {
    const channel = automation.channel as ChannelType;
    if (!acc[channel]) acc[channel] = [];
    acc[channel].push(automation);
    return acc;
  }, {} as Record<ChannelType, ConfiguredBusinessAutomation[]>);

  // Group automations by category
  const automationsByCategory = configuredAutomations.reduce((acc, automation) => {
    if (!acc[automation.businessCategory]) acc[automation.businessCategory] = [];
    acc[automation.businessCategory].push(automation);
    return acc;
  }, {} as Record<string, ConfiguredBusinessAutomation[]>);

  // Mock stats based on automation types
  const totalLeads = 847;
  const totalSales = 156;
  const appointmentsBooked = 45;
  const supportTickets = 23;

  const stats = [
    { 
      label: 'Total Leads', 
      value: totalLeads.toLocaleString(), 
      change: '+23%',
      icon: UserPlus,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
    },
    { 
      label: 'Sales/Orders', 
      value: totalSales.toString(), 
      change: '+18%',
      icon: ShoppingCart,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    { 
      label: 'Appointments', 
      value: appointmentsBooked.toString(), 
      change: '+12%',
      icon: Calendar,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    { 
      label: 'Support Tickets', 
      value: supportTickets.toString(), 
      change: '-5%',
      icon: HeadphonesIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const handlePlanChange = (newPlan: PlanType) => {
    setCurrentPlan(newPlan);
    localStorage.setItem('selected_plan', newPlan);
  };

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
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-lg">{plan.name} Plan</h3>
                      <Badge variant="secondary" className={isExpired ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}>
                        {isExpired ? 'Expired' : 'Active'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {connectedChannels.length} of {maxChannels} channels • {automationsCount} of {maxAutomations === 999 ? '∞' : maxAutomations} automations
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {isExpired ? (
                        <span className="text-destructive">Plan expired on {new Date(planExpiryDate).toLocaleDateString()}</span>
                      ) : (
                        <span>Expires on {new Date(planExpiryDate).toLocaleDateString()} ({daysUntilExpiry} days left)</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {connectedChannels.map((channel) => (
                      <div
                        key={channel}
                        className={`h-9 w-9 rounded-full ${channelColors[channel]} flex items-center justify-center text-primary-foreground border-2 border-card`}
                        title={channel}
                      >
                        {channelIcons[channel]}
                      </div>
                    ))}
                  </div>
                  {isExpired ? (
                    <Button 
                      size="sm" 
                      className="gap-1 gradient-primary text-primary-foreground"
                      onClick={() => setUpgradeDialogOpen(true)}
                    >
                      <CreditCard className="h-3 w-3" /> Renew Plan
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="gap-1"
                      onClick={() => setUpgradeDialogOpen(true)}
                    >
                      Upgrade <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Channels Used</span>
                    <span className="font-medium">{connectedChannels.length}/{maxChannels}</span>
                  </div>
                  <Progress value={(connectedChannels.length / maxChannels) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Automations Active</span>
                    <span className="font-medium">{automationsCount}/{maxAutomations === 999 ? '∞' : maxAutomations}</span>
                  </div>
                  <Progress value={maxAutomations === 999 ? 10 : (automationsCount / maxAutomations) * 100} className="h-2" />
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
                    <Badge variant="secondary" className={stat.change.startsWith('+') ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}>
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Leads vs Conversions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
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
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
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
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="leads" 
                        stroke="hsl(var(--primary))" 
                        fillOpacity={1} 
                        fill="url(#colorLeads)"
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="hsl(var(--accent))" 
                        fillOpacity={1} 
                        fill="url(#colorSales)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Active Automations by Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-border/50 h-full">
              <CardHeader>
                <CardTitle className="text-lg">Active Automations</CardTitle>
                <CardDescription>By business type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(automationsByCategory).map(([category, automations]) => {
                  const categoryInfo = businessCategories.find(c => c.id === category);
                  return (
                    <div 
                      key={category}
                      className="p-3 rounded-lg bg-secondary/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${categoryColors[category]}`}>
                          {categoryIcons[category]}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{categoryInfo?.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {automations.length} automation{automations.length > 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    </div>
                  );
                })}

                {configuredAutomations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">No automations configured yet.</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-4"
                      onClick={() => navigate('/portal/automations')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Automation
                    </Button>
                  </div>
                )}

                {configuredAutomations.length > 0 && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => navigate('/portal/automations')}
                  >
                    Manage Automations
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Channel Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Channel Performance</CardTitle>
              <CardDescription>Automations and metrics per connected channel</CardDescription>
            </CardHeader>
            <CardContent>
              {connectedChannels.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No channels connected yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 gap-2"
                    onClick={() => navigate('/portal/automations')}
                  >
                    <Plus className="h-4 w-4" />
                    Connect Channels
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {connectedChannels.map((channel) => {
                    const channelAutomations = automationsByChannel[channel] || [];
                    const mockLeads = Math.floor(Math.random() * 300) + 100;
                    
                    return (
                      <div 
                        key={channel}
                        className="p-4 rounded-xl border border-border bg-card hover:shadow-medium transition-shadow"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`h-12 w-12 rounded-xl ${channelColors[channel]} flex items-center justify-center text-white`}>
                            {channelIcons[channel]}
                          </div>
                          <div>
                            <div className="font-semibold capitalize">{channel}</div>
                            <div className="text-xs text-muted-foreground">
                              {channelAutomations.length} automation{channelAutomations.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Leads</span>
                            <span className="font-medium">{mockLeads}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Responses</span>
                            <span className="font-medium">{Math.floor(mockLeads * 0.95)}</span>
                          </div>
                        </div>

                        {channelAutomations.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-border">
                            <div className="text-xs text-muted-foreground mb-2">Active:</div>
                            <div className="flex flex-wrap gap-1">
                              {channelAutomations.map((auto, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {businessCategories.find(c => c.id === auto.businessCategory)?.icon}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest automation triggers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockActivities.slice(0, 5).map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        activity.type === 'lead' ? 'bg-green-500/10 text-green-600' :
                        activity.type === 'sale' ? 'bg-orange-500/10 text-orange-600' :
                        'bg-blue-500/10 text-blue-600'
                      }`}>
                        {activity.type === 'lead' ? <UserPlus className="h-5 w-5" /> :
                         activity.type === 'sale' ? <ShoppingCart className="h-5 w-5" /> :
                         <MessageSquare className="h-5 w-5" />}
                      </div>
                      <div>
                        <div className="font-medium text-sm capitalize">{activity.platform}</div>
                        <div className="text-xs text-muted-foreground">{activity.message}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <UpgradeDialog 
        open={upgradeDialogOpen} 
        onOpenChange={setUpgradeDialogOpen}
        currentPlan={currentPlan}
        onPlanChange={handlePlanChange}
      />
    </ClientLayout>
  );
}
