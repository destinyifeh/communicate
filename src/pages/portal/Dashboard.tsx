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
  Sparkles,
  Plus,
  Settings,
  Play,
  Pause,
  MoreVertical,
  Loader2,
  Calendar,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { generateChartData, mockActivities } from '@/lib/mockData';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AutomationManager } from '@/components/portal/AutomationManager';
import { UpgradeDialog } from '@/components/portal/UpgradeDialog';
import { ChannelSettingsDialog } from '@/components/portal/ChannelSettingsDialog';
import { ChannelType, PlanType, planDetails, ChannelConnection, mockManyChatOAuth, mockTikTokOAuth } from '@/lib/onboardingTypes';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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

const chartData = generateChartData();

export default function ClientDashboard() {
  const navigate = useNavigate();
  
  // Load data from localStorage (simulating API)
  const [currentPlan, setCurrentPlan] = useState<PlanType>('starter');
  const [planExpiryDate, setPlanExpiryDate] = useState('2025-02-15');
  const [connectedChannels, setConnectedChannels] = useState<Array<{
    type: ChannelType;
    name: string;
    accountName: string;
    connected: boolean;
    leads: number;
    automationsActive: number;
    status: string;
  }>>([]);
  
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [channelSettingsOpen, setChannelSettingsOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<typeof connectedChannels[0] | null>(null);
  const [addChannelDialogOpen, setAddChannelDialogOpen] = useState(false);
  const [disconnectAlertOpen, setDisconnectAlertOpen] = useState(false);
  const [channelToDisconnect, setChannelToDisconnect] = useState<ChannelType | null>(null);
  const [connectingChannel, setConnectingChannel] = useState<ChannelType | null>(null);

  // Check if plan is expired
  const isExpired = new Date(planExpiryDate) < new Date();
  const daysUntilExpiry = Math.ceil((new Date(planExpiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    // Load plan from localStorage
    const savedPlan = localStorage.getItem('selected_plan') as PlanType;
    if (savedPlan) {
      setCurrentPlan(savedPlan);
    }

    // Load connected channels
    const savedChannels = localStorage.getItem('connected_channels');
    if (savedChannels) {
      const channels = JSON.parse(savedChannels);
      // Enrich with mock data
      const enrichedChannels = channels.map((ch: ChannelConnection) => ({
        type: ch.type,
        name: ch.type.charAt(0).toUpperCase() + ch.type.slice(1),
        accountName: ch.accountName || `@${ch.type}_account`,
        connected: true,
        leads: Math.floor(Math.random() * 500) + 100,
        automationsActive: Math.floor(Math.random() * 5) + 1,
        status: 'active',
      }));
      setConnectedChannels(enrichedChannels);
    }
  }, []);

  const plan = planDetails[currentPlan];
  const maxChannels = plan.maxChannels;
  const maxAutomations = plan.maxAutomations === 'unlimited' ? 999 : plan.maxAutomations;
  const automationsCount = connectedChannels.reduce((acc, ch) => acc + ch.automationsActive, 0);
  const totalLeads = connectedChannels.reduce((acc, ch) => acc + ch.leads, 0);

  const planIcon = currentPlan === 'starter' ? Zap : currentPlan === 'professional' ? Crown : Sparkles;
  const PlanIcon = planIcon;

  // Available channels that can be added
  const availableChannels: ChannelType[] = (['instagram', 'facebook', 'whatsapp', 'tiktok'] as ChannelType[])
    .filter(ch => !connectedChannels.some(c => c.type === ch));

  const handlePlanChange = (newPlan: PlanType) => {
    setCurrentPlan(newPlan);
    // Check if connected channels exceed new plan limit
    const newMax = planDetails[newPlan].maxChannels;
    if (connectedChannels.length > newMax) {
      toast.warning(`Note: You have more channels than allowed in ${planDetails[newPlan].name}. Some features may be limited.`);
    }
  };

  const handleConnectChannel = async (channelType: ChannelType) => {
    if (connectedChannels.length >= maxChannels) {
      toast.error('Channel limit reached. Upgrade to add more channels.');
      setAddChannelDialogOpen(false);
      setUpgradeDialogOpen(true);
      return;
    }

    setConnectingChannel(channelType);

    try {
      const response = channelType === 'tiktok'
        ? await mockTikTokOAuth()
        : await mockManyChatOAuth(channelType);

      if (response.success) {
        const newChannel = {
          type: channelType,
          name: channelType.charAt(0).toUpperCase() + channelType.slice(1),
          accountName: response.accountName,
          connected: true,
          leads: 0,
          automationsActive: 0,
          status: 'active',
        };

        const updatedChannels = [...connectedChannels, newChannel];
        setConnectedChannels(updatedChannels);
        
        // Save to localStorage
        const savedChannels = updatedChannels.map(ch => ({
          type: ch.type,
          connected: true,
          accountName: ch.accountName,
        }));
        localStorage.setItem('connected_channels', JSON.stringify(savedChannels));

        toast.success(`${newChannel.name} connected successfully!`);
        setAddChannelDialogOpen(false);
      }
    } catch (error) {
      toast.error(`Failed to connect ${channelType}`);
    } finally {
      setConnectingChannel(null);
    }
  };

  const handleDisconnectChannel = (channelType: ChannelType) => {
    const updatedChannels = connectedChannels.filter(ch => ch.type !== channelType);
    setConnectedChannels(updatedChannels);
    
    // Update localStorage
    const savedChannels = updatedChannels.map(ch => ({
      type: ch.type,
      connected: true,
      accountName: ch.accountName,
    }));
    localStorage.setItem('connected_channels', JSON.stringify(savedChannels));
    
    toast.success(`Channel disconnected successfully`);
    setDisconnectAlertOpen(false);
    setChannelToDisconnect(null);
  };

  const handleAddChannelClick = () => {
    if (connectedChannels.length >= maxChannels) {
      toast.error(`You've reached your channel limit (${maxChannels}). Please upgrade to add more.`);
      setUpgradeDialogOpen(true);
    } else {
      setAddChannelDialogOpen(true);
    }
  };

  const stats = [
    { 
      label: 'Total Leads', 
      value: totalLeads.toLocaleString(), 
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
      label: 'Automations', 
      value: `${automationsCount} Active`, 
      status: 'online',
      icon: Bot,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
    },
  ];

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
                      <Calendar className="h-3 w-3" />
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
                        key={channel.type}
                        className={`h-9 w-9 rounded-full ${channelColors[channel.type]} flex items-center justify-center text-primary-foreground border-2 border-card`}
                        title={channel.name}
                      >
                        {channelIcons[channel.type]}
                      </div>
                    ))}
                    {connectedChannels.length < maxChannels && (
                      <div className="h-9 w-9 rounded-full bg-secondary border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">+{maxChannels - connectedChannels.length}</span>
                      </div>
                    )}
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

        {/* Connected Channels Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Connected Channels</CardTitle>
                <CardDescription>Leads and automation status per channel</CardDescription>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="gap-2"
                onClick={handleAddChannelClick}
              >
                <Plus className="h-4 w-4" />
                Add Channel
              </Button>
            </CardHeader>
            <CardContent>
              {connectedChannels.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No channels connected yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 gap-2"
                    onClick={handleAddChannelClick}
                  >
                    <Plus className="h-4 w-4" />
                    Connect Your First Channel
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {connectedChannels.map((channel) => (
                    <div 
                      key={channel.type}
                      className="p-4 rounded-xl border border-border bg-card hover:shadow-medium transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-11 w-11 rounded-lg ${channelColors[channel.type]} flex items-center justify-center text-primary-foreground`}>
                            {channelIcons[channel.type]}
                          </div>
                          <div>
                            <div className="font-medium">{channel.name}</div>
                            <div className="text-sm text-muted-foreground">{channel.accountName}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                            Active
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedChannel(channel);
                                setChannelSettingsOpen(true);
                              }}>
                                <Settings className="h-4 w-4 mr-2" /> Settings
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => {
                                  setChannelToDisconnect(channel.type);
                                  setDisconnectAlertOpen(true);
                                }}
                              >
                                Disconnect
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <div className="text-2xl font-bold">{channel.leads.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Total Leads</div>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/50">
                          <div className="text-2xl font-bold">{channel.automationsActive}</div>
                          <div className="text-xs text-muted-foreground">Automations</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Automation Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AutomationManager 
            maxAutomations={maxAutomations} 
            connectedChannels={connectedChannels.map(c => c.type)} 
            onUpgradeNeeded={() => setUpgradeDialogOpen(true)}
          />
        </motion.div>

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
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => {
                    const automationSection = document.querySelector('[data-automation-manager]');
                    if (automationSection) {
                      automationSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <Bot className="h-5 w-5 text-primary" />
                  <span className="text-sm">Create Automation</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex-col gap-2"
                  onClick={handleAddChannelClick}
                >
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Connect Channel</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => navigate('/portal/leads')}
                >
                  <Users className="h-5 w-5 text-accent" />
                  <span className="text-sm">View Leads</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => setUpgradeDialogOpen(true)}
                >
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">Upgrade Plan</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upgrade Dialog */}
      <UpgradeDialog
        open={upgradeDialogOpen}
        onOpenChange={setUpgradeDialogOpen}
        currentPlan={currentPlan}
        onPlanChange={handlePlanChange}
        mode="both"
      />

      {/* Channel Settings Dialog */}
      {selectedChannel && (
        <ChannelSettingsDialog
          open={channelSettingsOpen}
          onOpenChange={setChannelSettingsOpen}
          channel={selectedChannel}
          onDisconnect={() => {
            setChannelToDisconnect(selectedChannel.type);
            setChannelSettingsOpen(false);
            setDisconnectAlertOpen(true);
          }}
        />
      )}

      {/* Add Channel Dialog */}
      <Dialog open={addChannelDialogOpen} onOpenChange={setAddChannelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect a Channel</DialogTitle>
            <DialogDescription>
              Choose a channel to connect ({connectedChannels.length}/{maxChannels} used)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {availableChannels.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <p>No more channels available to connect.</p>
              </div>
            ) : (
              availableChannels.map((channelType) => (
                <button
                  key={channelType}
                  onClick={() => handleConnectChannel(channelType)}
                  disabled={connectingChannel !== null}
                  className="w-full p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${channelColors[channelType]} flex items-center justify-center text-primary-foreground`}>
                      {channelIcons[channelType]}
                    </div>
                    <span className="font-medium capitalize">{channelType}</span>
                  </div>
                  {connectingChannel === channelType ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Disconnect Alert */}
      <AlertDialog open={disconnectAlertOpen} onOpenChange={setDisconnectAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Channel?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect the channel and remove all associated automations. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => channelToDisconnect && handleDisconnectChannel(channelToDisconnect)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ClientLayout>
  );
}